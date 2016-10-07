import sys, os
if getattr(sys, 'frozen', False):
	# we are running in a bundle
	basedir = sys._MEIPASS
	exe     = os.path.realpath(sys.executable)
else:
	# we are running in a normal Python environment
	basedir = os.path.realpath(os.path.dirname(__file__) + "/..")
	exe     = os.path.realpath(sys.argv[0])
sys.path.insert(1, os.path.join(basedir, "lib/site-packages"))
sys.path.insert(1, os.path.join(basedir, "lib"))

from flask import Flask
from flask import jsonify
from flask_sqlalchemy import SQLAlchemy
import json

# read configuration file
import ConfigParser
cfg = {}
_cfg = ConfigParser.ConfigParser()
_cfg.read(basedir + "/etc/config.ini")

for s in _cfg.sections():
	#print "[" + s + "]"
	cfg[s] = {}
	for o in _cfg.options(s):
		#print "%s: %s" % (o, _cfg.get(s, o))
		cfg[s][o] = _cfg.get(s, o)
		
		# cast int values to int
		if s == "webserver" and o == "port" or \
		   s == "flask" and o == "debug":
			cfg[s][o] = int(cfg[s][o])
#print cfg
#sys.exit(0)

# flask startup options
flask_config = {
	"static_folder": basedir + "/www/static",
	"static_url_path": "/static",
	"template_folder": basedir + "/www/template"
}

app_name = "todo"
app = Flask(__name__, **flask_config)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///../var/notes.db'
os.environ['FLASK_APP'] = __name__ # required for cli commands

# set flask config values
for e in cfg["flask"]:
	app.config[e.upper()] = cfg["flask"][e]

db = SQLAlchemy(app)

def traverse(n):
	""" pritn all nodes in the tree """
	if len(n.children):
		print n
		for e in n.children:
			traverse(e)
	else:
		print n

class NodeError(Exception):
	"""node exeptions"""
	code    = None
	message = None
	
	def __init__(self, code, message):
		"""node error message
		
		code: integer
		message: string
		"""
		self.code = code
		self.message = message
	
	def __str__(self):
		return self.message
	
	def __repr__(self):
		return "<NodeError: " + str(self.code) + " " + self.message + ">"

class Node(db.Model):
	"""Node tree class
	
	Every node has a parent (id of the parent) and 0-N children. The parent of 
	the root node is None.
	
	A nodes name may not begin with '_' and must not contain the following 
	characters: ^, /, ?, #.
	
	"""
	
	name   = ""
	parent = None
	
	# database options
	__tablename__ = 'node'
	
	# schema
	id     = db.Column(db.Integer, primary_key=True)
	parent = db.Column(db.Integer, db.ForeignKey("node.id"), nullable=True)
	name   = db.Column(db.String(80))
	children = db.relationship("Node")
	
	# FIXME: add path variable to nodes for quicker lookups by name
	
	"""
	FIXME: disallow certain characters in names:
	- /
	- ^_
	- ?
	- #
	"""
	
	def __init__(self, name):
		self.name = name
		#self.parent = parent

	def __repr__(self):
		return '<Node [%d/%s/%d] %s>' % (self.id, self.parent, len(self.children), self.name)
		
	def to_dict(self):
		return {
			"id": self.id,
			"name": self.name,
			"parent": self.parent,
			"numc": len(self.children)
		}
