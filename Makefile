SOURCE_FILES := node_modules src/api.js src/config.js src/types/config-helpers.ts src/types/core.ts src/types/estree.ts src/types/plugin-kit.ts
DIST_FILES := dist/eslint.js

node_modules: pnpm-lock.yaml
	pnpm install
	@touch node_modules

.PHONY: deps
deps: node_modules

.PHONY: lint
lint: node_modules build
	pnpm exec eslint-silverwind --color .
	pnpm exec tsgo

.PHONY: lint-fix
lint-fix: node_modules build
	pnpm exec eslint-silverwind --color . --fix
	pnpm exec tsgo

.PHONY: test
test: node_modules build
	node dist/eslint.js
	node test.js
	pnpm exec tsgo --ignoreConfig --noEmit --noResolve --skipLibCheck false --module nodenext --target esnext --strict dist/*.d.ts dist/types/*.d.ts

.PHONY: build
build: node_modules $(DIST_FILES)

$(DIST_FILES): $(SOURCE_FILES) pnpm-lock.yaml package.json tsconfig.json tsdown.config.ts
	pnpm exec tsdown
	cp $$(find node_modules/.pnpm/jiti@*/node_modules/jiti/dist/babel.cjs) dist/babel.cjs
	sed -E 's#from "(@eslint/)?([a-z-]+)"#from "./types/\2.js"#' node_modules/eslint/lib/types/config-api.d.ts > dist/config.d.ts
	sed -E 's#from "(@eslint/)?([a-z-]+)"#from "./types/\2.js"#' node_modules/eslint/lib/types/index.d.ts > dist/api.d.ts

.PHONY: publish
publish: node_modules
	pnpm publish --no-git-checks

.PHONY: update
update: update-js update-actions

.PHONY: update-js
update-js: node_modules
	pnpm exec updates -u -f package.json
	rm -rf node_modules pnpm-lock.yaml
	pnpm install
	@touch node_modules

.PHONY: update-actions
update-actions: node_modules
	pnpm exec updates -u -M actions

.PHONY: patch minor major
patch minor major: node_modules lint test
	pnpm exec versions -R $@ package.json
