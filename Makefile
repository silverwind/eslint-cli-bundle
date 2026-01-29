SOURCE_FILES := node_modules
DIST_FILES := dist/eslint.js
VENDOR_FORMATTERS := vendor/formatters/stylish.js vendor/formatters/html.js vendor/formatters/json.js vendor/formatters/json-with-metadata.js

node_modules: package-lock.json
	npm install --no-save
	npx patch-package
	@touch node_modules

# Vendor formatters from node_modules
vendor/formatters/%.js: node_modules/eslint/lib/cli-engine/formatters/%.js
	@mkdir -p vendor/formatters
	@cp $< $@

.PHONY: vendor
vendor: node_modules $(VENDOR_FORMATTERS)
	@echo "\"use strict\";" > vendor/formatters/index.js
	@echo "module.exports = {" >> vendor/formatters/index.js
	@echo "	stylish: require(\"./stylish\")," >> vendor/formatters/index.js
	@echo "	html: require(\"./html\")," >> vendor/formatters/index.js
	@echo "	json: require(\"./json\")," >> vendor/formatters/index.js
	@echo "	\"json-with-metadata\": require(\"./json-with-metadata\")," >> vendor/formatters/index.js
	@echo "};" >> vendor/formatters/index.js

.PHONY: deps
deps: node_modules

.PHONY: lint
lint: node_modules
	npx tsc

.PHONY: lint-fix
lint-fix: node_modules
	npx tsc

.PHONY: test
test: $(DIST_FILES)
	node dist/eslint.js

.PHONY: build
build: node_modules $(DIST_FILES)

$(DIST_FILES): $(SOURCE_FILES) package-lock.json package.json tsdown.config.ts
	npx tsdown
	chmod +x $(DIST_FILES)
	cp node_modules/jiti/dist/babel.cjs dist/babel.cjs

.PHONY: update
update: node_modules
	npx updates -cu
	rm -rf node_modules package-lock.json
	npm install
	@touch node_modules

.PHONY: publish
publish: node_modules
	npm publish

.PHONY: patch
patch: node_modules lint test
	npx versions patch package.json package-lock.json
	git push -u --tags origin master

.PHONY: minor
minor: node_modules lint test
	npx versions minor package.json package-lock.json
	git push -u --tags origin master

.PHONY: major
major: node_modules lint test
	npx versions major package.json package-lock.json
	git push -u --tags origin master
