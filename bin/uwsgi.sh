#!/usr/bin/env bash

uwsgi --plugin python,http --http :8001 --manage-script-name --mount /todo=example:app

