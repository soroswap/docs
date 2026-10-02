#!/bin/bash
# Fetch repo structure
curl -s "https://api.github.com/repos/soroswap/docs/contents" | python3 -c "import sys,json; [print(f['type'], f['path']) for f in json.load(sys.stdin)]"
