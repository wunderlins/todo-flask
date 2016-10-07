#!/usr/bin/env bash
# print number of liens created in this porject
for f in `find ./ -type f | grep -v ./.git/`; do 
	wc -l $f | sed -e 's/ .*//';
done | paste -sd+ | bc
