#!/bin/bash

# Build content and static files
./generate-for-production.sh

# Copy files needed to deploy on GitHub Pages
cp ./deploy/CNAME ./build/CNAME
cp ./deploy/.nojekyll ./build/.nojekyll

# Commit and push
git add .
git commit -m "Update"
git push

# Deploy on GitHub Pages
git subtree push --prefix build origin gh-pages