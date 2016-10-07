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

# application setup
cfg = {
	"static_folder": basedir + "/www/static",
	"static_url_path": "/static",
	"template_folder": basedir + "/www/template"
}

app_name = "todo"
app = Flask(__name__, **cfg)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///../var/test.db'
os.environ['FLASK_APP'] = __name__ # required for cli commands
db = SQLAlchemy(app)

def traverse(n):
	if len(n.children):
		print n.to_dict()
		for e in n.children:
			traverse(e)
	else:
		print n.to_dict()

class Node(db.Model):
	__tablename__ = 'node'
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
		self.name   = name
		#self.parent = parent

	def __repr__(self):
		return '<Node [%d/%s] %s>' % (self.id, self.parent, self.name)
		
	def to_dict(self):
		return {
			"id": self.id,
			"name": self.name,
			"parent": self.parent,
			"numc": len(self.children)
		}
