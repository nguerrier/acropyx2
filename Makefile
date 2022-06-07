default:
	echo "Default target, doing nothing"

deploy:
	test -d .git -a -d back
	git subtree push --prefix back/ heroku main
