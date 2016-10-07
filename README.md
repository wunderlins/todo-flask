# todo-flask

## install 

	$ make dep
	$ ./bin/cli makedb # create database

## configuration
Check `etc/config.ini`
	
## run
### uWSGI (production)

	$ ./bin/uwsgi.sh

### as deamon

	$ ./bin/httpd [--port NNN] [--host 0.0.0.0] &

### command line

	$ ./bin/cli <command> # or
	$ ./bin/cli --help

## resources

	www/template/*  - flask templates
	www/static/*    - static http files
	etc/config.ini  - main configuration file
	var/notes.db    - main database (sqlite3)


