#!/bin/bash
# Fetch docs structure
curl -s "https://api.github.com/repos/soroswap/docs/contents/docs" | python3 -c "import sys,json; data=json.load(sys.stdin); [print(f['type'], f['path']) if isinstance(f,dict) else print('folder:', f['name']+'/'+f['path']) for f in data]"
