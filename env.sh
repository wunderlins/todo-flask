#!/usr/bin/env bash

export EDITOR="/usr/bin/gedit"

function mf {
	touch "$1"
	git add "$1"
	$EDITOR "$1"
}

function mfx {
	mf "$1"
	chmod 700 "$1"
}
