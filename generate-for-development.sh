#!/bin/bash

rm -r build
node generate.js
node create-sitemap.js
gulp build-for-development
