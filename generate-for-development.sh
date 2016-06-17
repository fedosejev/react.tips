#!/bin/bash

rm -r build
node generate.js
gulp build-for-development