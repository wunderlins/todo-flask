# todo-flask

## install 

	$ make dep

## configuration
Check `etc/config.ini`
	
## run
###as deamon

	$ ./bin/httpd [--port NNN] [--host 0.0.0.0] &

###command line

	$ ./bin/cli <command> # or
	$ ./bin/cli --help

###uWSGI (production)

	$ ./bin/uwsgi.sh
