# todo-flask

Check: http://js.cytoscape.org/#demos for graphing

## install development environment
Install pip, bower
	
	$ sudo apt-get install python-pip nodejs python-dev build-essential
	$ sudo npm install bower -g	

	$ ./bin/setup.sh

Optional for building binaries (do not install into project directory)

	$ sudo pip install pyinstaller==3.1.1

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
