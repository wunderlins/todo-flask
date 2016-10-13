#!/usr/bin/env bash

# config.ini as bash array
eval "$(cat ./etc/config.ini | ./bin/ini2basharr.py)"

nohup ./bin/httpd >> ./var/httpd.log &
echo $! > ./var/httpd.pid
