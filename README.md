# codex-template

[![CI](https://github.com/joeneldeasis/codex-template/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/joeneldeasis/codex-template/actions/workflows/ci.yml)
[![CodeQL](https://github.com/joeneldeasis/codex-template/actions/workflows/codeql.yml/badge.svg?branch=main)](https://github.com/joeneldeasis/codex-template/actions/workflows/codeql.yml)
![Node.js](https://img.shields.io/badge/node-%3E%3D20-339933)
![License](https://img.shields.io/badge/license-MIT-blue)

Install [aitmpl.com](https://aitmpl.com/) skills, commands, agents, and MCPs into Codex.

```bash
npx codex-template --skill creative-design/frontend-design
```

## Installation

```bash
npm install -g codex-template
codex-template --help
```

Or run it once without a global install:

```bash
npx codex-template@latest --skill creative-design/frontend-design
```

## Quick start

Global install is the default. Add `--project` or `--directory <path>` to write into a repository.

```bash
npx codex-template --skill creative-design/frontend-design
npx codex-template --command testing/generate-tests
npx codex-template --agent development-team/frontend-developer
npx codex-template --mcp web/web-fetch
npx codex-template --doctor
```

| Component | Location |
| --- | --- |
| Skill | `~/.agents/skills/<name>/` |
| Command | `~/.agents/skills/<name>/` as an explicit skill (`SKILL.md` plus `agents/openai.yaml`) |
| Agent | `~/.codex/agents/<name>.toml` |
| MCP | merged into `~/.codex/config.toml` as `[mcp_servers.<id>]` |

The category prefix is dropped, so `creative-design/frontend-design` installs as `frontend-design`. Command text keeps `$ARGUMENTS` and Claude `!` syntax. The first write to `config.toml` also saves `config.toml.bak`.

## Commands and options

```text
codex-template [options]

--skill <ids>          Install skills, comma-separated
--command <ids>        Install commands, comma-separated
--agent <ids>          Install agents, comma-separated
--mcp <ids>            Install MCPs, comma-separated
-d, --directory <path> Install into a project instead of the user profile
--project              Same as --directory .
-y, --yes              Overwrite without prompting
--dry-run              Show planned writes and do not change files
--list [type]          List catalog ids
--search <type> <query>
--info <type> <id>
--installed
--remove <type> <id>
--update <type> <id>
--update --all
--doctor
--verbose
--debug                Print stack traces
-h, --help
-V, --version
```

Browse the catalog at [skills](https://aitmpl.com/skills/), [commands](https://aitmpl.com/commands/), [agents](https://aitmpl.com/agents/), and [MCPs](https://aitmpl.com/mcps/).

## Configuration

There is no config file. Scope comes from the CLI:

1. `--directory` or `--project` installs into that project
2. otherwise files go under the user profile

Existing keys in `config.toml`, including other MCP servers, are kept. A different value for the same server asks before overwrite unless `--yes` is set.

## Environment variables

| Variable | Purpose |
| --- | --- |
| `GITHUB_TOKEN` | Optional token for the GitHub catalog API when unauthenticated requests are rate-limited. The token is not printed. |

## Programmatic API

```js
import { installComponent, destRoots, createCatalog } from 'codex-template';

const roots = destRoots({ target: 'codex', scope: 'project', directory: process.cwd() });
const catalog = createCatalog();
await installComponent({
  target: 'codex',
  roots,
  type: 'skill',
  id: 'creative-design/frontend-design',
  yes: true,
  catalog,
});
```

Also exported: `removeComponent`, `listInstalled`, `checkInstall`, and `runCli`.

## Troubleshooting

`GitHub rate limit` means the catalog request was rejected. Set `GITHUB_TOKEN` and run the command again.

`Unknown component type` means the type was not `skill`, `command`, `agent`, or `mcp`.

`not found` means that catalog id is not in `davila7/claude-code-templates`. Check the id on aitmpl.com.

Exit codes: `0` success, `1` the operation failed, `2` the arguments were invalid.

## Development

Requires Node.js 20 or newer.

```bash
npm ci
npm run validate
npm run ci
```

`npm run validate` lints, typechecks, builds `dist/`, tests, and writes coverage. `npm run ci` also checks the packed files and runs the tarball with npx from a clean temporary directory.

## Publishing

Publishing happens from a git tag `vX.Y.Z` whose version matches `package.json`. The release workflow runs the same validation, publishes with npm provenance, and creates a GitHub Release.

The published package contains `dist/`, `bin/cli.js`, `README.md`, and `LICENSE`. Check a packed build locally with:

```bash
npm run ci
```
