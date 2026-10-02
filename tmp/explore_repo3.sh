#!/bin/bash
# Fetch all content recursively
curl -s "https://api.github.com/repos/soroswap/docs/git/trees/main?recursive=1" | python3 -c "
import sys,json
data = json.load(sys.stdin)
for item in data.get('tree', []):
    if item['type'] == 'blob':
        print(item['path'])
"
