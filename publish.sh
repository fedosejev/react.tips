#!/bin/bash

# Build content and static files
./generate-for-production.sh

# Copy files needed to deploy on GitHub Pages
cp ./deploy/CNAME ./docs/CNAME
cp ./deploy/.nojekyll ./docs/.nojekyll

# Commit and push
git add .
git commit -m "Update"
git push
