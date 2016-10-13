#!/usr/bin/env bash

# config.ini as bash array
eval "$(cat ./etc/config.ini | ./bin/ini2basharr.py)"

pids=`lsof -i :${webserver[port]} | awk 'NR>1 {print $2}'`

kill -TERM $pids
rm ./var/httpd.pid
