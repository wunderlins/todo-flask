#!/usr/bin/env bash

# download all dependencies (bower, pip)
make dep

# create an initial (empty) database with a root node
./bin/cli makedb

