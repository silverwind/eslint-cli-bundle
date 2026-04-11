SOURCE_FILES := node_modules
DIST_FILES := dist/eslint.js
VENDOR_FORMATTERS := vendor/formatters/stylish.js vendor/formatters/html.js vendor/formatters/json.js vendor/formatters/json-with-metadata.js

node_modules: pnpm-lock.yaml
	pnpm install
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
	pnpm exec tsgo

.PHONY: lint-fix
lint-fix: node_modules
	pnpm exec tsgo

.PHONY: test
test: $(DIST_FILES)
	node dist/eslint.js
	node test.js

.PHONY: build
build: node_modules $(DIST_FILES)

$(DIST_FILES): $(SOURCE_FILES) pnpm-lock.yaml package.json tsdown.config.ts
	pnpm exec tsdown
	chmod +x $(DIST_FILES)
	cp $$(find node_modules/.pnpm/jiti@*/node_modules/jiti/dist/babel.cjs) dist/babel.cjs
	cp node_modules/eslint/lib/types/config-api.d.ts dist/config.d.ts
	cp node_modules/eslint/lib/types/index.d.ts dist/api.d.ts

.PHONY: update
update: node_modules
	pnpm exec updates -cu
	rm -rf node_modules pnpm-lock.yaml
	pnpm install
	@touch node_modules

.PHONY: publish
publish: node_modules
	pnpm publish --no-git-checks

.PHONY: patch
patch: node_modules lint test
	pnpm exec versions -R patch package.json
	git push -u --tags origin master

.PHONY: minor
minor: node_modules lint test
	pnpm exec versions -R minor package.json
	git push -u --tags origin master

.PHONY: major
major: node_modules lint test
	pnpm exec versions -R major package.json
	git push -u --tags origin master
