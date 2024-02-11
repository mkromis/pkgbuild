#!/bin/bash
#  DO NOT JUST RUN THIS. EXAMINE AND JUDGE. RUN AT YOUR OWN RISK.

# this will setup interperter see https://google.github.io/zx/cli
echo "Installing zx interpeter"
npm i --no-audit --no-fund -g zx vite-node

# make sure we are up to date
echo "Checking for updates (global)"
npm outdated --no-fund -g
npm update --no-fund -g

# for local cache
npm install