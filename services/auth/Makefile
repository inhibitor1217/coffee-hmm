NODE=$(shell which node 2> /dev/null)
NPM=$(shell which npm 2> /dev/null)
YARN=$(shell which yarn 2> /dev/null)
JQ=$(shell which jq 2> /dev/null)

APP_NAME=${shell jq ".name" package.json}
CURRENT_VERSION:=$(shell jq ".version" package.json)
PKM?=$(if $(YARN),$(YARN),$(shell which npm))

SERVERLESS_CONFIG_FILE=serverless.yml

APP_STAGE=local
PORT=7007
LOG_LEVEL=verbose
GOOGLE_APPLICATION_CREDENTIALS=.firebase/config.json

USER_ID=test

help: info
	@echo
	@echo "List of commands:"
	@echo
	@echo "  make info             - display node, npm and yarn versions."
	@echo "  make deps             - install all dependencies."
	@echo "  make lint             - run lint."
	@echo "  make serve            - start local server for development."
	@echo "  make deploy           - deploy the service via serverless"
	@echo "  make token            - generate a firebase id token in local environment for testing"

info:
	@[ ! -z "$(NODE)" ] && echo node version: `$(NODE) --version` "$(NODE)"
	@[ ! -z "$(PKM)" ] && echo $(shell basename $(PKM)) version: `$(PKM) --version` "$(PKM)"
	@[ ! -z "$(JQ)" ] && echo jq version: `$(JQ) --version` "$(JQ)"

	@echo
	@echo "Name: $(APP_NAME)"
	@echo "Stage: $(APP_STAGE)"
	@echo "Current version: $(CURRENT_VERSION)"

deps:
	@$(PKM) install

lint:
	@npx eslint ./src/**/*.ts
	@npx tsc --noEmit
	@echo "Lint check completed."

serve:
	@echo "Starting $(APP_STAGE)@$(CURRENT_VERSION) server on port $(PORT) ..."
	@APP_NAME=$(APP_NAME) APP_VERSION=$(CURRENT_VERSION) APP_STAGE=$(APP_STAGE) PORT=$(PORT) LOG_LEVEL=$(LOG_LEVEL) GOOGLE_APPLICATION_CREDENTIALS=$(GOOGLE_APPLICATION_CREDENTIALS) $(PKM) run debug

deploy:
	@cp .ormconfig/$(APP_STAGE).json .ormconfig/default.json
	@cp .firebase/$(APP_STAGE).json .firebase/default.json
	@AWS_ACCESS_KEY_ID=$(AWS_ACCESS_KEY_ID) AWS_SECRET_ACCESS_KEY=$(AWS_SECRET_ACCESS_KEY) npx serverless deploy --config $(SERVERLESS_CONFIG_FILE)

token:
	@echo "Creating a custom firebase id token on local environment ..."
	@echo ""
	@APP_NAME=$(APP_NAME) APP_STAGE=local USER_ID=$(USER_ID) GOOGLE_APPLICATION_CREDENTIALS=$(GOOGLE_APPLICATION_CREDENTIALS) npx ts-node src/externals/generateFirebaseToken.ts
