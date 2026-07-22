#!/usr/bin/env bash
# Deploy only public PAC artifacts from Git remote refs to tinykvm's static root.

set -euo pipefail

repo_dir="${PAC_REPO_DIR:-/home/xf/repo/pac}"
static_dir="${PAC_STATIC_DIR:-/opt/www/gfw.ssssp.net/pac}"
lock_file="${PAC_SYNC_LOCK:-/tmp/pac-remote-sync.lock}"
dry_run=0

if [ "$#" -gt 1 ] || { [ "$#" -eq 1 ] && [ "$1" != "--dry-run" ]; }; then
  echo "usage: $0 [--dry-run]" >&2
  exit 2
fi
if [ "$#" -eq 1 ]; then
  dry_run=1
fi

if [ ! -d "$repo_dir/.git" ]; then
  echo "PAC repository is not available: $repo_dir" >&2
  exit 1
fi
if [ ! -d "$static_dir" ]; then
  echo "PAC static directory is not available: $static_dir" >&2
  exit 1
fi

exec 9>"$lock_file"
if ! flock -n 9; then
  echo "PAC remote sync is already running; skipping"
  exit 0
fi

stage_dir="$(mktemp -d "${TMPDIR:-/tmp}/pac-remote-sync.XXXXXX")"
trap 'rm -rf "$stage_dir"' EXIT
updated=()

git -C "$repo_dir" remote update --prune origin

copy_ref_file() {
  local ref_path="$1"
  local output_path="$2"
  git -C "$repo_dir" show "$ref_path" > "$output_path"
}

copy_ref_file "origin/dev:8989.pac" "$stage_dir/white.pac"
copy_ref_file "origin/devip:8989.pac" "$stage_dir/ip.white.pac"
copy_ref_file "origin/devip:m.8989.pac" "$stage_dir/m.ip.white.pac"

sed 's/127\.0\.0\.1:8989/4006024680.com:8989/g' "$stage_dir/white.pac" > "$stage_dir/white_hiwifi.pac"
sed 's/127\.0\.0\.1:8989/127.0.0.1:13659/g' "$stage_dir/white.pac" > "$stage_dir/13659.pac"

if git -C "$repo_dir" cat-file -e "origin/devip:cn.lst" 2>/dev/null; then
  copy_ref_file "origin/devip:cn.lst" "$stage_dir/cn.lst"
else
  echo "origin/devip has no cn.lst yet; retaining the current static cn.lst"
fi

for pac_file in "$stage_dir/white.pac" "$stage_dir/ip.white.pac" "$stage_dir/m.ip.white.pac"; do
  if ! grep -Fq "FindProxyForURL" "$pac_file"; then
    echo "invalid PAC artifact: $pac_file" >&2
    exit 1
  fi
done
if [ -f "$stage_dir/cn.lst" ] && [ "$(wc -l < "$stage_dir/cn.lst")" -lt 1000 ]; then
  echo "generated cn.lst is unexpectedly small" >&2
  exit 1
fi

deploy_file() {
  local source_path="$1"
  local target_name="$2"
  local target_path="$static_dir/$target_name"

  if [ ! -f "$source_path" ] || cmp -s "$source_path" "$target_path"; then
    return
  fi
  updated+=("$target_name")
  if [ "$dry_run" -eq 1 ]; then
    return
  fi

  local temporary_path="$static_dir/.${target_name}.tmp.$$"
  install -m 0644 "$source_path" "$temporary_path"
  mv -f "$temporary_path" "$target_path"
}

deploy_file "$stage_dir/white.pac" "white.pac"
deploy_file "$stage_dir/white_hiwifi.pac" "white_hiwifi.pac"
deploy_file "$stage_dir/13659.pac" "13659.pac"
deploy_file "$stage_dir/ip.white.pac" "ip.white.pac"
deploy_file "$stage_dir/m.ip.white.pac" "m.ip.white.pac"
if [ -f "$stage_dir/cn.lst" ]; then
  deploy_file "$stage_dir/cn.lst" "cn.lst"
fi

if [ "${#updated[@]}" -eq 0 ]; then
  echo "public PAC artifacts are already current"
elif [ "$dry_run" -eq 1 ]; then
  printf 'would update: %s\n' "${updated[*]}"
else
  printf 'updated: %s\n' "${updated[*]}"
fi
