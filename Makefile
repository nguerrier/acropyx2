default:
	echo "Default target, doing nothing"


prepare-local-git:
	git config remote.heroku-preprod-api-acropyx.url || heroku git:remote -a preprod-api-acropyx -r heroku-preprod-api-acropyx
	git config remote.heroku-api-acropyx.url || heroku git:remote -a api-acropyx -r heroku-api-acropyx
	git config remote.heroku-preprod-manager-acropyx.url || heroku git:remote -a preprod-manager-acropyx -r heroku-preprod-manager-acropyx
	git config remote.heroku-manager-acropyx.url || heroku git:remote -a manager-acropyx -r heroku-manager-acropyx
	git config remote.heroku-preprod-acropyx.url || heroku git:remote -a preprod-acropyx -r heroku-preprod-acropyx
	#git config remote.heroku-acropyx.url || heroku git:remote -a preprod-acropyx -r heroku-preprod-acropyx

deploy-preprod: prepare-local-git
	test -d .git -a -d back -a -d frontend-manager -a -d frontend-public
	git subtree push --prefix back/ heroku-preprod-api-acropyx main
	git subtree push --prefix frontend-manager/ heroku-preprod-manager-acropyx main
	#git subtree push --prefix frontend-public/ heroku-preprod-acropyx main

deploy-prod: prepare-local-git
	test -d .git -a -d back -a -d frontend-manager -a -d frontend-public
	git subtree push --prefix back/ heroku-api-acropyx main
	git subtree push --prefix frontend-manager/ heroku-manager-acropyx main
	#git subtree push --prefix frontend-public/ heroku-acropyx main
