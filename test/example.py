#!/usr/bin/env python
"""
flask + SQLAlchemy example

run
 - cli mode: $ FLASK_CLI=1 ./example.py mycmd
 - www mode: $ ./example.py
"""

# library path
import sys, os, json, re
basedir = os.path.abspath(os.path.dirname(__file__))
sys.path.insert(1, os.path.realpath(os.path.join(basedir, "../lib/site-packages")))
sys.path.insert(1, os.path.realpath(os.path.join(basedir, "../lib")))

import click
from flask import Flask
from flask import jsonify
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///../var/test.db'
db = SQLAlchemy(app)

#print "\n".join(sys.path)

class Node(db.Model):
	__tablename__ = 'node'
	id     = db.Column(db.Integer, primary_key=True)
	parent = db.Column(db.Integer, db.ForeignKey("node.id"), nullable=True)
	name   = db.Column(db.String(80))
	
	children = db.relationship("Node")
	
	def __init__(self, name):
		self.name   = name
		#self.parent = parent

	def __repr__(self):
		return '<Node [%d/%s] %s>' % (self.id, self.parent, self.name)

@app.route('/')
def hello_world():
	ret = json.dumps(app.config, indent=4, default=lambda x:str(x))
	return ret

def traverse(n):
	if len(n.children):
		print n
		for e in n.children:
			traverse(e)
	else:
		print n

@app.cli.command()
def displayrec():
	root = Node.query.get(1)
	traverse(root)
	
@app.cli.command()
def samplerec():
	""" Generate a sample records for testing """
	r = Node("Root")
	n1 = Node("Erster")
	r.children.append(n1)
	n2 = Node("Zweiter")
	r.children.append(n2)
	n3 = Node("zwei drei")
	n2.children.append(n3)
	db.session.add(r)
	db.session.commit()

@app.cli.command()
def makedb():
	db.create_all()

if __name__ == "__main__":
	if os.getenv("FLASK_CLI", default=None):
		from flask.cli import main
		os.environ['FLASK_APP'] = __name__ # required for cli commands
		sys.argv[0] = re.sub(r'(-script\.pyw|\.exe)?$', '', sys.argv[0])
		sys.exit(main())
	else:
		app.run(debug=True)
