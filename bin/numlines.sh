#!/usr/bin/env bash
# print number of liens created in this porject
for f in `find ./ -type f | grep -v ./.git/ | grep -v './www/static/lib' | grep -v './build' | grep -v './dist' | grep -v './lib/site-packages' | grep -v '~$' | grep -v '.pyc$'`; do 
	wc -l $f | sed -e 's/ .*//';
done | paste -sd+ | bc
