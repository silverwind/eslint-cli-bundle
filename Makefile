SOURCE_FILES := node_modules
DIST_FILES := dist/eslint.js

node_modules: package-lock.json
	npm install --no-save
	@touch node_modules

.PHONY: deps
deps: node_modules

.PHONY: lint
lint: node_modules
	npx eslint --color .
	npx tsc

.PHONY: lint-fix
lint-fix: node_modules
	npx eslint --color . --fix
	npx tsc

.PHONY: test
test: node_modules
	node dist/eslint.js

.PHONY: build
build: node_modules $(DIST_FILES)

$(DIST_FILES): $(SOURCE_FILES) package-lock.json package.json tsdown.config.ts
	npx tsdown
	chmod +x $(DIST_FILES)
	mkdir -p cli-engine/formatters shared
	for f in node_modules/eslint/lib/cli-engine/formatters/*.js; do \
		cp "$$f" "cli-engine/formatters/$$(basename $$f .js).cjs"; \
	done
	cp node_modules/eslint/lib/cli-engine/formatters/*.json cli-engine/formatters/
	for f in node_modules/eslint/lib/shared/*.js; do \
		cp "$$f" "shared/$$(basename $$f .js).cjs"; \
	done
	sed -i 's/`formatters`,`$${t}\.js/`formatters`,`$${t}.cjs/g' $(DIST_FILES)
	sed -i 's|require("../../shared/\([^"]*\)")|require("../../shared/\1.cjs")|g' cli-engine/formatters/*.cjs

.PHONY: publish
publish: node_modules
	git push -u --tags origin master
	npm publish

.PHONY: update
update: node_modules
	npx updates -cu
	rm -rf node_modules package-lock.json
	npm install
	@touch node_modules

.PHONY: path
patch: node_modules build
	npx versions patch package.json package-lock.json
	@$(MAKE) --no-print-directory build publish

.PHONY: minor
minor: node_modules build
	npx versions minor package.json package-lock.json
	@$(MAKE) --no-print-directory build publish

.PHONY: major
major: node_modules build
	npx versions major package.json package-lock.json
	@$(MAKE) --no-print-directory build publish
