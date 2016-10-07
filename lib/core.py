import sys, os
from flask import Flask
from flask import jsonify
from flask_sqlalchemy import SQLAlchemy
import json

# application setup
app_name = "todo"
app = Flask(__name__)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///../var/test.db'
os.environ['FLASK_APP'] = __name__ # required for cli commands
db = SQLAlchemy(app)

def traverse(n):
	if len(n.children):
		print n.tojson()
		for e in n.children:
			traverse(e)
	else:
		print n.tojson()

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
