# PAC 自动更新

`master` 保存无敏感的生成代码、公开模板 `templates/white.pac` 与 GitHub Actions 工作流；它不直接充当发布分支。

| 分支 | 内容 |
| --- | --- |
| `dev` | 通用 PAC 的 `8989.pac` 与 `7070.pac`。 |
| `devip` | 基于公开 APNIC 中国 IPv4 委派数据生成的 PAC，以及兼容旧链接的 `m.*.pac` 文件。 |

工作流每天从 APNIC 的公开 delegated 数据生成文件。它只使用公开数据，不读取订阅、账号、密码、Token 或带鉴权的代理节点信息。旧的外部 Closure Compiler 步骤已移除：`m.8989.pac` 和 `m.7070.pac` 现在是对应有效 PAC 的兼容副本，而不是可能失效的压缩结果。

## 本地运行

```bash
python3 scripts/generate_pac.py --template templates/white.pac --out-dir generated
python3 -m unittest discover -s tests -v
```

生成器在写出文件前会校验 APNIC 数据、CIDR 数量和 PAC 必要函数。GitHub Actions 只有在定时触发或手动触发时才会更新 `dev` / `devip`；推送到 `master` 与 Pull Request 仅运行测试。

敏感订阅更新不属于本仓库或本工作流。若将来需要自动化该类数据，必须使用独立私有任务、受限 Secret 和非公开存储。
