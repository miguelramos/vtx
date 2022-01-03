#!/usr/bin/env node

// check debug mode first before requiring the CLI.
const debugIndex = process.argv.findIndex((arg) => /^(?:-d|--debug)$/.test(arg));

const filterIndex = process.argv.findIndex((arg) =>
  /^(?:-f|--filter)$/.test(arg)
);

const profileIndex = process.argv.indexOf('--profile');

if (debugIndex > 0) {
  let value = process.argv[debugIndex + 1];

  if (!value || value.startsWith('-')) {
    value = 'vite:*';
  } else {
    // support debugging multiple flags with comma-separated list
    value = value
      .split(',')
      .map((v) => `vite:${v}`)
      .join(',');
  }

  process.env.DEBUG = value;

  if (filterIndex > 0) {
    const filter = process.argv[filterIndex + 1];

    if (filter && !filter.startsWith('-')) {
      process.env.VITE_DEBUG_FILTER = filter;
    }
  }
}

function main() {
  require('../dist/cli');
}

main();
