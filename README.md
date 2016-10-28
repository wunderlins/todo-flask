# todo-flask

Check: http://js.cytoscape.org/#demos for graphing

## install development environment

	$ ./bin/setup.sh

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


# TODO
## Database Schema
- add flexible Node type configurarion. Base type shall have an id and name which should be inherited by all children. 
- Add a Person data type which may be `M:M` referenced from any Node and multiple properties per Node
- .