#!/usr/bin/env bash
# print number of liens created in this porject
files=`find ./ -type f | grep -v ./.git/ | grep -v './www/static/lib' | grep -v './build' | grep -v './dist' | grep -v './lib/site-packages' | grep -v '~$' | grep -v '.pyc$' | grep -v Makefile | grep -v .gitignore | grep -v .bowerrc | grep -v ".md$" | grep -v ".db$" | grep -v ".spec$" | grep -v ".ini$"`
echo "$files"
for f in $files; do 
	wc -l $f | sed -e 's/ .*//';
done | paste -sd+ | bc
