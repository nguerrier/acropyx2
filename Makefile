default:
	echo "Default target, doing nothing"


# heroku git:remote -a api-acropyx2 -r heroku-prod
# heroku git:remote -a preprod-api-acropyx2 -r heroku-preprod

deploy-preprod:
	test -d .git -a -d back
	git subtree push --prefix back/ heroku-preprod main

deploy-prod:
	test -d .git -a -d back
	git subtree push --prefix back/ heroku-prod main
