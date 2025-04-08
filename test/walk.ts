import { describe, it } from 'node:test'
import assert from 'node:assert/strict'

import { walk, ancestorWalk } from '../src/walk.js'

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

  it('walks the AST with ancestors', async () => {
    const code = 'const a = 1;'
    const ast = parseSync('file.ts', code)
    const ancestors: string[][] = []
    const leaveAncestors: string[][] = []

    await ancestorWalk(ast.program, {
      enter(node, ancestor) {
        ancestors.push(ancestor.map(n => n.type))
      },
      leave(node, ancestor) {
        leaveAncestors.push(ancestor.map(n => n.type))
      },
    })

    assert.deepEqual(ancestors, [
      ['Program'],
      ['Program', 'VariableDeclaration'],
      ['Program', 'VariableDeclaration', 'VariableDeclarator'],
      ['Program', 'VariableDeclaration', 'VariableDeclarator', 'Identifier'],
      ['Program', 'VariableDeclaration', 'VariableDeclarator', 'Literal'],
    ])
    assert.deepEqual(leaveAncestors, [
      ['Program', 'VariableDeclaration', 'VariableDeclarator', 'Identifier'],
      ['Program', 'VariableDeclaration', 'VariableDeclarator', 'Literal'],
      ['Program', 'VariableDeclaration', 'VariableDeclarator'],
      ['Program', 'VariableDeclaration'],
      ['Program'],
    ])
  })
})
