### BEGIN INIT INFO
# Provides:          todo-webservice
# Required-Start:    $remote_fs $syslog
# Required-Stop:     $remote_fs $syslog
# Default-Start:     2 3 4 5
# Default-Stop:      0 1 6
# Short-Description: todo web service (uwsgi or flask web server)
# Description:       The todo app uses this flask web backend for data storage.
### END INIT INFO

set -e

# resolve the applications installation folder
_basedir="`realpath $0`"
basedir="`dirname $_basedir`/.."
basedir="`realpath $basedir`"

cd $basedir

test -x ./bin/start.sh || exit 0

umask 022

. /lib/lsb/init-functions

export PATH="$basedir/bin:${PATH}"

case "$1" in
  start)
		log_daemon_msg "Restarting todo-webservice" "todo" || true
		$basedir/bin/start.sh
  stop)
  	log_daemon_msg "Restarting todo-webservice" "todo" || true
		$basedir/bin/stop.sh
	restart)
		log_daemon_msg "Restarting todo-webservice" "todo" || true
		$basedir/bin/stop.sh
		$basedir/bin/start.sh
  *)
		log_action_msg "Usage: $basedir/etc/init.sh {start|stop|restart}" || true
		exit 1
esac

