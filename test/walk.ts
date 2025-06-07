import { describe, it } from 'node:test'
import assert from 'node:assert/strict'

import { walk, ancestorWalk, asyncAncestorWalk, asyncWalk } from '../src/walk.js'

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

  it('supports async walk', async () => {
    const code = 'const a = 1;'
    const ast = parseSync('file.ts', code)
    const nodesEntered: string[] = []
    const nodesLeft: string[] = []

    await asyncWalk(ast.program, {
      async enter(node) {
        nodesEntered.push(node.type)
      },
      async leave(node) {
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

  it('outer ancestors are visible to inner walkers', async () => {
    const code = `
      const Bar = function Bar(props) {
        const Inner = () => <span>stuff</span>
        return <><Inner /></>
      }
    `
    const ast = parseSync('file.tsx', code)
    const nodesLeft: string[] = []

    await asyncAncestorWalk(ast.program, {
      async enter(node, ancestors) {
        if (node.type === 'FunctionExpression') {
          if (node.body) {
            await walk(node.body, {
              enter(innerNode) {
                if (innerNode.type === 'JSXElement') {
                  assert.ok(ancestors.length > 0)
                  assert.ok(
                    ancestors.find(ancestor => ancestor.type === 'FunctionExpression'),
                  )
                }
              },
            })
          }
        }
      },
      async leave(node, ancestors) {
        nodesLeft.push(node.type)
      },
    })

    assert.deepEqual(nodesLeft, [
      'Identifier',
      'Identifier',
      'Identifier',
      'Identifier',
      'JSXIdentifier',
      'JSXOpeningElement',
      'JSXText',
      'JSXIdentifier',
      'JSXClosingElement',
      'JSXElement',
      'ArrowFunctionExpression',
      'VariableDeclarator',
      'VariableDeclaration',
      'JSXOpeningFragment',
      'JSXIdentifier',
      'JSXOpeningElement',
      'JSXElement',
      'JSXClosingFragment',
      'JSXFragment',
      'ReturnStatement',
      'BlockStatement',
      'FunctionExpression',
      'VariableDeclarator',
      'VariableDeclaration',
      'Program',
    ])
  })
})
