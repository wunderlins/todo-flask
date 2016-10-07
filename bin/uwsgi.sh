#!/usr/bin/env bash

#uwsgi --plugin python,http --http :5000 --manage-script-name --mount /todo=bin/httpd:app

echo "$(cat ./etc/todo.cfg | ./bin/ini2basharr.py)"
exit

uwsgi --http-socket 0.0.0.0:5000 \
      --plugin python \
      --wsgi-file ./bin/httpd \
      --callable app \
      --static-map /static=www/static
