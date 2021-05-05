NODE=$(shell which node 2> /dev/null)
NPM=$(shell which npm 2> /dev/null)
YARN=$(shell which yarn 2> /dev/null)
JQ=$(shell which jq 2> /dev/null)

APP_NAME=${shell jq ".name" package.json}
CURRENT_VERSION:=$(shell jq ".version" package.json)
PKM?=$(if $(YARN),$(YARN),$(shell which npm))

MODULES=app common jobs services/auth services/http-api
CI_DIR = $(shell pwd)
ROOT_DIR = $(shell dirname $(CI_DIR))

help: info
	@echo
	@echo "List of commands:"
	@echo
	@echo "  make info             - display node, npm and yarn versions."
	@echo "  make deps             - install all dependencies."
	@echo "  make report		   - generate type coverage reports."

info:
	@[ ! -z "$(NODE)" ] && echo node version: `$(NODE) --version` "$(NODE)"
	@[ ! -z "$(PKM)" ] && echo $(shell basename $(PKM)) version: `$(PKM) --version` "$(PKM)"
	@[ ! -z "$(JQ)" ] && echo jq version: `$(JQ) --version` "$(JQ)"

	@echo
	@echo "Name: $(APP_NAME)"
	@echo "Current version: $(CURRENT_VERSION)"

deps:
	@$(PKM) install

report:
	@for module in $(MODULES) ; do \
		cd $(ROOT_DIR)/$$module && \
		make deps && \
		cd $(CI_DIR) && \
		node src/type-coverage-codecov.js $$module ; \
	done
