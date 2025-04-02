# [`@knighted/walk`](https://www.npmjs.com/package/@knighted/walk)

![CI](https://github.com/knightedcodemonkey/walk/actions/workflows/ci.yml/badge.svg)
[![codecov](https://codecov.io/gh/knightedcodemonkey/walk/graph/badge.svg?token=aha6ghyLD8)](https://codecov.io/gh/knightedcodemonkey/walk)
[![NPM version](https://img.shields.io/npm/v/@knighted/walk.svg)](https://www.npmjs.com/package/@knighted/walk)

Walk an [`oxc-parser`](https://www.npmjs.com/package/oxc-parser) AST with nodes typed correctly.

Same API as [`estree-walker`](https://www.npmjs.com/package/estree-walker), other than needing to `await` the walk.

```ts
import { parseSync } from 'oxc-parser'
import { walk } from '@knighted/walk'

const ast = parseSync('file.ts', code)

/**
 * This package exposes an ESM and CJS build, hence the need for `await`.
 * @see https://github.com/Rich-Harris/estree-walker/issues/26#issuecomment-2773408164
 */
await walk(ast.program, {
  enter(node) {
    // node is correctly typed
  },
})
```
