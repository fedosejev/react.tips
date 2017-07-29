#!/bin/bash

rm -r docs
node generate.js
node create-sitemap.js
gulp build-for-development
