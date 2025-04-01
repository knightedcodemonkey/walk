# [`@knighted/walk`](https://www.npmjs.com/package/@knighted/walk)

![CI](https://github.com/knightedcodemonkey/walk/actions/workflows/ci.yml/badge.svg)
[![NPM version](https://img.shields.io/npm/v/@knighted/walk.svg)](https://www.npmjs.com/package/@knighted/walk)

Walk an [`oxc-parser`](https://www.npmjs.com/package/oxc-parser) AST with nodes typed correctly.

Same API as [`estree-walker`](https://www.npmjs.com/package/estree-walker).

```ts
import { parseSync } from 'oxc-parser'
import { walk } from '@knighted/walk'

const ast = parseSync('file.ts', code)

walk(ast, {
  enter(node) {
    // node is correctly typed
  },
})
```
