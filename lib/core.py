import sys, os
if getattr(sys, 'frozen', False):
	# we are running in a bundle
	basedir  = sys._MEIPASS
	exe      = os.path.realpath(sys.executable)
	cfg_file = os.path.dirname(exe) + "/config.ini"
else:
	# we are running in a normal Python environment
	basedir = os.path.realpath(os.path.dirname(__file__) + "/..")
	exe     = os.path.realpath(sys.argv[0])
	cfg_file = basedir + "/etc/config.ini"

sys.path.insert(1, os.path.join(basedir, "lib/site-packages/email"))
sys.path.insert(1, os.path.join(basedir, "lib/site-packages"))
sys.path.insert(1, os.path.join(basedir, "lib"))

import datetime
from flask import Flask
from flask import jsonify
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Table, MetaData, Column, Integer, ForeignKey
import json

def config_default(cfg_file):
	if not os.path.exists(cfg_file):
		cfg_file = open(cfg_file, "wb")
		cfg_file.write("""[flask]
DEBUG = 1

[webserver]
host = 0.0.0.0
port = 8001

[ssl]
; leave empty for no ssl, use "make keygen" to generate a development key
; paths must be relative to the base directory or absolute
;private_key = etc/certs/shell1.intra.wunderlin.net.csr
;public_key = etc/certs/shell1.intra.wunderlin.net.key

""")
		cfg_file.close()
config_default(cfg_file)

# read configuration file
import ConfigParser
cfg = {}
_cfg = ConfigParser.ConfigParser()
# FIXME: move config directory to absolute path (sitewide) or peofile directory
#        to make this work as work with pyinstaller
_cfg.read(cfg_file)

for s in _cfg.sections():
	#print "[" + s + "]"
	cfg[s] = {}
	for o in _cfg.options(s):
		#print "%s: %s" % (o, _cfg.get(s, o))
		cfg[s][o] = _cfg.get(s, o)
		
		if cfg[s][o] == "":
			cfg[s][o] = None
		
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
	type = None
	message = None
	__errors = [
		"Unknown", # 0
		"Node Name"
	]
	__err_messages = [
		"An unhandled error occured",
		"Failed to create node. The name must not start with '_' and shall not contain any of these characters: ^/?#;"
	]
	
	def __init__(self, code):
		"""node error message
		
		code: integer
		"""
		self.code = code
		self.type = self.__errors[code]
		self.message = self.__err_messages[code]
	
	def __str__(self):
		return "(" + self.type + ") " + self.message
	
	def __repr__(self):
		return "<NodeError: " + str(self.code) + " " + self.message + ">"

""" Many to Many relationship definition for Node<->Person """
association_table = Table('association', MetaData(),
	Column('person_id', Integer, ForeignKey('person.id')),
	Column('node_id', Integer, ForeignKey('node.id'))
)

class Person(db.Model):
	# database options
	__tablename__ = 'person'
	
	id     = db.Column(db.Integer, primary_key=True)
	# this field is required, must be unique and is treated as key
	nick   = db.Column(db.String(80))
	
	firstname = db.Column(db.String(80))
	lastname  = db.Column(db.String(80))
	email     = db.Column(db.String(80))
	phone     = db.Column(db.String(80))

	sAMAccountName  = db.Column(db.String(256))
	
	def __init__(self, nick):
		self.nick = nick

	def __repr__(self):
			return '<Person [%d] %s>' % ( self.id, self.nick)

class Node(db.Model):
	"""Node tree class
	
	Every node has a parent (id of the parent) and 0-N children. The parent of 
	the root node is None.
	
	A nodes name may not begin with '_' and must not contain the following 
	characters: ^, /, ?, #, ;.
	
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
	
	# note properties
	comment = db.Column(db.Text)
	ts_ins  = db.Column(db.DateTime)
	# FIXME: check if create and mutation date timestamps can be automated with flask-sqlalchemy
	#ts_ins  = db.Column(db.DateTime, default=datetime.datetime.utcnow)
	ts_mut  = db.Column(db.DateTime)
	
	# FIXME: add path variable to nodes for quicker lookups by name
	
	def __init__(self, name):
		if name[0] == "_" or '/' in name or '?' in name or '#' in name or ';' in name:
			raise NodeError(1)
		
		self.name = name
		#self.parent = parent

	def __repr__(self):
		return '<Node [%d/%s/%d] %s>' % (self.id, self.parent, len(self.children), self.name)
		
	def to_dict(self):
		ret = {
			"id": self.id,
			"name": self.name,
			"parent": self.parent,
			"numc": len(self.children),
			"comment": self.comment,
			"ts_ins": self.ts_ins,
			"ts_mut": self.ts_mut,
		}
		
		if not ret["parent"]:
			ret["parent"] = 0
		
		return ret

