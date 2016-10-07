#!/usr/bin/env bash

#uwsgi --plugin python,http --http :5000 --manage-script-name --mount /todo=bin/httpd:app

#echo "$(cat ./etc/config.ini | ./bin/ini2basharr.py)"
eval "$(cat ./etc/config.ini | ./bin/ini2basharr.py)"

uwsgi --http-socket ${webserver[host]}:${webserver[port]} \
      --plugin python \
      --wsgi-file ./bin/httpd \
      --callable app \
      --static-map /static=www/static
