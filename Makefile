.PHONY: kill

bower:
	cd www/static; bower install

pip:
	pip install --ignore-installed -t lib/site-packages Flask Flask-SQLAlchemy
	touch lib/site-packages/__init__.py
	#touch lib/__init__.py

dep: bower pip

linux:
	pyinstaller --clean -s -n cli --paths=lib/ --paths=lib/site-packages/ --paths=--paths=lib/site-packages/flask --paths=lib/site-packages/flask_sqlalchemy --distpath dist/linux -F bin/cli
	
clean:
	rm -rf build | true
	rm -rf dist | true
	rm -rf www/static/lib/* | true
	rm -rf lib/site-packages/* | true
	find ./ -iname "*~" -exec rm {} \;

dump:
	sqlite3 var/notes.db .dump

keygen:
	rm etc/certs/* | true
	bin/gencert.sh

kill:
	kill -KILL `lsof -i :8001|awk 'NR>1 {print $$2}'|sort|uniq` 2>/dev/null | true
