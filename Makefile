.PHONY: build test

DOCKER_COMPOSE ?= docker-compose
DEV_BROWSER = -a /Applications/Google\ Chrome.app

UNAME_S := $(shell uname -s)
ifeq ($(UNAME_S), Darwin)
	OPEN_CMD        ?= open
	DOCKER_HOST_IP  ?= $(shell echo $(DOCKER_HOST) | sed 's/tcp:\/\///' | sed 's/:[0-9.]*//')
else
	OPEN_CMD        ?= xdg-open
	DOCKER_HOST_IP  ?= 127.0.0.1
endif

all: build up open

build:
	$(DOCKER_COMPOSE) build

up:
	$(DOCKER_COMPOSE) up -d

setup-backend:
	$(DOCKER_COMPOSE) run --rm  php setup.sh
	$(DOCKER_COMPOSE) run --rm  php yii couch/update-all

open:	 ##@docker open application web service in browser
	$(OPEN_CMD) $(DEV_BROWSER) http://$(DOCKER_HOST_IP):$(shell $(DOCKER_COMPOSE) port builder 9000 | sed 's/[0-9.]*://')

open-backend:	 ##@docker open backend
	$(OPEN_CMD) $(DEV_BROWSER) http://$(DOCKER_HOST_IP):$(shell $(DOCKER_COMPOSE) port nginx 80 | sed 's/[0-9.]*://')

open-db:	 ##@docker open backend
	$(OPEN_CMD) mysql://root:secretadmin@$(DOCKER_HOST_IP):$(shell $(DOCKER_COMPOSE) port db 3306 | sed 's/[0-9.]*://')

open-couch:	 ##@docker open couchdb backend
	$(OPEN_CMD) $(DEV_BROWSER) http://$(DOCKER_HOST_IP):$(shell $(DOCKER_COMPOSE) port couchdb 5984 | sed 's/[0-9.]*://')/_utils

open-vnc:	 ##@docker open application web service in browser
	$(OPEN_CMD) vnc://x:secret@$(DOCKER_HOST_IP):$(shell $(DOCKER_COMPOSE) port chrome 5900 | sed 's/[0-9.]*://')
	#$(OPEN_CMD) vnc://x:secret@$(DOCKER_HOST_IP):$(shell $(DOCKER_COMPOSE) port firefox 5900 | sed 's/[0-9.]*://')

run-tests:	 ##@docker open application web service in browser
	$(DOCKER_COMPOSE) run --rm builder protractor

bash:	 ##@docker open application development bash
	$(DOCKER_COMPOSE) run --rm builder bash

bash-backend:	 ##@docker open application development bash
	$(DOCKER_COMPOSE) run --rm php bash

clean:	 ##@docker open application development bash
	$(DOCKER_COMPOSE) kill
	$(DOCKER_COMPOSE) rm -fv --all
	$(DOCKER_COMPOSE) down --remove-orphans

release: build
	$(DOCKER_COMPOSE) run --rm builder sh -c 'cp -r /data/www/. /data/_output/www'
	$(DOCKER_COMPOSE) run --rm builder sh -c 'ionic prepare && ionic build android && cp -r /data/platforms/android/build/outputs/. ./_output/build/'
