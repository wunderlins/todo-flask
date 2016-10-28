#!/usr/bin/env bash

os=`uname`

if [[ "$os" == "Darwin" ]]; then
	PS1="$PS1" /opt/local/bin/bash
else
	export EDITOR="/usr/bin/gedit"
fi

function mf {
	touch "$1"
	git add "$1"
	$EDITOR "$1"
}

function mfx {
	mf "$1"
	chmod 700 "$1"
}
