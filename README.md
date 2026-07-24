# PAC 自动更新

`master` 保存无敏感的生成代码、公开模板 `templates/white.pac` 与 GitHub Actions 工作流；它不直接充当发布分支。

| 分支 | 内容 |
| --- | --- |
| `dev` | 通用 PAC 的 `8989.pac` 与 `7070.pac`。 |
| `devip` | 基于公开 APNIC 中国 IPv4 委派数据生成的 `cn.lst`、可读 PAC，以及兼容旧链接的压缩 `m.*.pac` 文件。 |

工作流每天从 APNIC 的公开 delegated 数据生成文件。它只使用公开数据，不读取订阅、账号、密码、Token 或带鉴权的代理节点信息。`m.8989.pac` 和 `m.7070.pac` 由锁定版本的 Terser 在工作流内压缩；不会再调用外部 Closure Compiler 服务。压缩前后都会校验 PAC 的必要全局接口和路由行为。

## 本地运行

```bash
pnpm install --frozen-lockfile
python3 scripts/generate_pac.py --template templates/white.pac --out-dir generated
pnpm run minify:pac
python3 -m unittest discover -s tests -v
pnpm run test:minify
pnpm run test:white-pac
```

生成器在写出文件前会校验 APNIC 数据、CIDR 数量和 PAC 必要函数；通用模板测试会覆盖域名后缀、IP 段和 DNS 调用路径。GitHub Actions 仅按每日计划运行；这是每日频率保证，不依赖精确触发时点。成功后它会更新 `dev` / `devip`，且仅在内容实际变化时创建发布提交。

## tinykvm 同步

`ops/tinykvm-sync-public-pac.sh` 仅执行 `git remote update`，并从 `origin/dev` 与 `origin/devip` 的公开文件部署 `white.pac`、IP PAC、压缩别名和 `cn.lst` 到静态目录。它不会读取或覆盖同目录的订阅文件。推荐由 tinykvm 的单一、带锁 cron 每 30 分钟执行一次；这样 GitHub 的每日任务即使延迟，服务器也会在随后一次同步中获取新版本。

敏感订阅更新不属于本仓库或本工作流。若将来需要自动化该类数据，必须使用独立私有任务、受限 Secret 和非公开存储。
