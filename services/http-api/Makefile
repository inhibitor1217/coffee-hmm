NODE=$(shell which node 2> /dev/null)
NPM=$(shell which npm 2> /dev/null)
YARN=$(shell which yarn 2> /dev/null)
JQ=$(shell which jq 2> /dev/null)

APP_NAME=${shell jq ".name" package.json}
CURRENT_VERSION:=$(shell jq ".version" package.json)
PKM?=$(if $(YARN),$(YARN),$(shell which npm))

SERVERLESS_CONFIG_FILE=serverless.yml

APP_STAGE=local
PORT=7008
LOG_LEVEL=verbose

ORMCONFIG_FILE=ormconfig.json

help: info
	@echo
	@echo "List of commands:"
	@echo
	@echo "  make info             - display node, npm and yarn versions."
	@echo "  make deps             - install all dependencies."
	@echo "  make lint             - run lint."
	@echo "  make serve            - start local server for development."
	@echo "  make test             - test local server."
	@echo "  make deploy           - deploy the service via serverless"

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
	@APP_NAME=$(APP_NAME) APP_VERSION=$(CURRENT_VERSION) APP_STAGE=$(APP_STAGE) PORT=$(PORT) LOG_LEVEL=$(LOG_LEVEL) ORMCONFIG_FILE=$(ORMCONFIG_FILE) $(PKM) run debug

test:
	@APP_NAME=$(APP_NAME) APP_VERSION=$(CURRENT_VERSION) APP_STAGE=$(APP_STAGE) PORT=$(PORT) LOG_LEVEL=$(LOG_LEVEL) JEST_WORKERS=4 TEST_SERVER_BASE_PORT=7200 $(PKM) test

deploy:
	@cp .ormconfig/$(APP_STAGE).json .ormconfig/default.json
	@AWS_ACCESS_KEY_ID=$(AWS_ACCESS_KEY_ID) AWS_SECRET_ACCESS_KEY=$(AWS_SECRET_ACCESS_KEY) npx serverless deploy --config $(SERVERLESS_CONFIG_FILE)
