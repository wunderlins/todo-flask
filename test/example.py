#!/usr/bin/env python
"""

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

class User(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	username = db.Column(db.String(80), unique=True)
	email = db.Column(db.String(120), unique=True)

	def __init__(self, username, email):
		self.username = username
		self.email = email

	def __repr__(self):
		return '<User %r>' % self.username

@app.route('/')
def hello_world():
	ret = json.dumps(app.config, indent=4, default=lambda x:str(x))
	return ret

@app.cli.command()
def mycmd():
    click.echo("Test ...")

if __name__ == "__main__":
	if os.getenv("FLASK_CLI", default=None):
		from flask.cli import main
		os.environ['FLASK_APP'] = __name__ # required for cli commands
		sys.argv[0] = re.sub(r'(-script\.pyw|\.exe)?$', '', sys.argv[0])
		sys.exit(main())
	else:
		app.run(debug=True)
