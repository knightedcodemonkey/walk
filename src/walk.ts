import { type SyncHandler, type AsyncHandler } from 'estree-walker'
import type { Program, Node } from 'oxc-parser'
import type { Program as ESTreeProgram, Node as ESTreeNode } from 'estree'

type WalkerCallback = (
  this: ThisParameterType<SyncHandler>,
  node: Node,
  parent: Node | null,
  key: Parameters<SyncHandler>['2'],
  index: Parameters<SyncHandler>['3'],
) => void
type AsyncWalkerCallback = (
  this: ThisParameterType<AsyncHandler>,
  node: Node,
  parent: Node | null,
  key: Parameters<AsyncHandler>['2'],
  index: Parameters<AsyncHandler>['3'],
) => Promise<void>
type AncestorWalkerCallback = (
  this: ThisParameterType<SyncHandler>,
  node: Node,
  ancestors: Node[],
  key: Parameters<SyncHandler>['2'],
  index: Parameters<SyncHandler>['3'],
) => void
type AsyncAncestorWalkerCallback = (
  this: ThisParameterType<AsyncHandler>,
  node: Node,
  ancestors: Node[],
  key: Parameters<AsyncHandler>['2'],
  index: Parameters<AsyncHandler>['3'],
) => Promise<void>

type AsyncWalkOptions = {
  enter?: AsyncWalkerCallback
  leave?: AsyncWalkerCallback
}
type AsyncAncestorWalkOptions = {
  enter?: AsyncAncestorWalkerCallback
  leave?: AsyncAncestorWalkerCallback
}
type AncestorWalkOptions = {
  enter?: AncestorWalkerCallback
  leave?: AncestorWalkerCallback
}
type WalkOptions = {
  enter?: WalkerCallback
  leave?: WalkerCallback
}

const walk = async (ast: Program | Node, opts: WalkOptions) => {
  // `estree-walker` is an ESM-only module, so need to use dynamic import to support dual builds.
  const { walk: _walk } = await import('estree-walker')

  return _walk(ast as ESTreeProgram | ESTreeNode, {
    enter(node, parent, prop, index) {
      if (opts.enter) {
        opts.enter.call(this, node as Node, parent as Node | null, prop, index)
      }
    },
    leave(node, parent, prop, index) {
      if (opts.leave) {
        opts.leave.call(this, node as Node, parent as Node | null, prop, index)
      }
    },
  })
}
const ancestorWalk = async (ast: Program | Node, opts: AncestorWalkOptions) => {
  const { walk: _walk } = await import('estree-walker')
  const ancestors: Node[] = []
  let isNew = false

  return _walk(ast as ESTreeProgram | ESTreeNode, {
    enter(node, parent, prop, index) {
      isNew = node !== ancestors[ancestors.length - 1]

      if (isNew) {
        ancestors.push(node as Node)
      }

      if (opts.enter) {
        opts.enter.call(this, node as Node, ancestors, prop, index)
      }
    },
    leave(node, parent, prop, index) {
      if (opts.leave) {
        opts.leave.call(this, node as Node, ancestors, prop, index)
      }

      if (isNew) {
        ancestors.pop()
      }
    },
  })
}
const asyncWalk = async (ast: Program | Node, opts: AsyncWalkOptions) => {
  const { asyncWalk: _asyncWalk } = await import('estree-walker')
  return _asyncWalk(ast as ESTreeProgram | ESTreeNode, {
    async enter(node, parent, prop, index) {
      if (opts.enter) {
        await opts.enter.call(this, node as Node, parent as Node | null, prop, index)
      }
    },
    async leave(node, parent, prop, index) {
      if (opts.leave) {
        await opts.leave.call(this, node as Node, parent as Node | null, prop, index)
      }
    },
  })
}
const asyncAncestorWalk = async (ast: Program | Node, opts: AsyncAncestorWalkOptions) => {
  const { asyncWalk: _asyncWalk } = await import('estree-walker')
  const ancestors: Node[] = []
  let isNew = false

  return _asyncWalk(ast as ESTreeProgram | ESTreeNode, {
    async enter(node, parent, prop, index) {
      isNew = node !== ancestors[ancestors.length - 1]

      if (isNew) {
        ancestors.push(node as Node)
      }

      if (opts.enter) {
        await opts.enter.call(this, node as Node, ancestors, prop, index)
      }
    },
    async leave(node, parent, prop, index) {
      if (opts.leave) {
        await opts.leave.call(this, node as Node, ancestors, prop, index)
      }

      if (isNew) {
        ancestors.pop()
      }
    },
  })
}

export { walk, asyncWalk, ancestorWalk, asyncAncestorWalk }
