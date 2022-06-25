#!/bin/bash

rm -rf pkg
rm -rf dist

if ! command -v wasm-pack &> /dev/null; then
  curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh
fi
