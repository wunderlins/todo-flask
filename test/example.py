#!/usr/bin/env python

# library path
import sys, os
basedir = os.path.abspath(os.path.dirname(__file__))
sys.path.insert(1, os.path.realpath(os.path.join(basedir, "../lib/site-packages")))
sys.path.insert(1, os.path.realpath(os.path.join(basedir, "../lib")))

from flask import Flask
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
	return 'Hello, World!'

if __name__ == "__main__":
	app.run()
