.PHONY:

bower:
	cd www/static; bower install

pip:
	pip install --ignore-installed -t lib/site-packages Flask Flask-SQLAlchemy
	touch lib/site-packages/__init__.py
	#touch lib/__init__.py

dep: bower pip

linux:
	pyinstaller --clean -s -n cli --paths=lib/ --paths=lib/site-packages/ --distpath dist/linux -F bin/cli
	
clean:
	rm -rf build | true
	rm -rf dist | true
	rm -rf www/static/lib/* | true
	rm -rf lib/site-packages/* | true
	find ./ -iname "*~" -exec rm {} \;

