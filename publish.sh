#!/bin/bash

./generate.sh

# Copy files needed to deploy on GitHub Pages
cp ./deploy/CNAME ./build/CNAME
cp ./deploy/.nojekyll ./build/.nojekyll

./update.sh

# Deploy on GitHub Pages
git subtree push --prefix build origin gh-pages