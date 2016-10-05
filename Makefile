.PHONY:

bower:
	cd www; bower install

pip:
	pip install --ignore-installed -t lib/site-packages Flask Flask-SQLAlchemy
	touch lib/site-packages/__init__.py
	#touch lib/__init__.py

dep: bower pip
