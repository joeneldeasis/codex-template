#!/usr/bin/env node
import { runCli } from '../dist/cli/run.js';

const code = await runCli('codex');
process.exit(code);
