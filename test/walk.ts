import { describe, it } from 'node:test'
import assert from 'node:assert/strict'

import { walk } from '../src/walk.js'

import { parseSync } from 'oxc-parser'

describe('walk', () => {
  it('walks the AST', async () => {
    const code = 'const a = 1;'
    const ast = parseSync('file.ts', code)
    const nodesEntered: string[] = []
    const nodesLeft: string[] = []

    await walk(ast.program, {
      enter(node) {
        nodesEntered.push(node.type)
      },
      leave(node) {
        nodesLeft.push(node.type)
      },
    })

    assert.deepEqual(nodesEntered, [
      'Program',
      'VariableDeclaration',
      'VariableDeclarator',
      'Identifier',
      'Literal',
    ])
    assert.deepEqual(nodesLeft, [
      'Identifier',
      'Literal',
      'VariableDeclarator',
      'VariableDeclaration',
      'Program',
    ])
  })
})
