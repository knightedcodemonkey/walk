import { walk as _walk, type SyncHandler } from 'estree-walker'
import type { Program, Node } from 'oxc-parser'
import type { Program as ESTreeProgram, Node as ESTreeNode } from 'estree'

type WalkerCallback = (
  this: ThisParameterType<SyncHandler>,
  node: Node,
  parent: Node | null,
  key: Parameters<SyncHandler>['2'],
  index: Parameters<SyncHandler>['3'],
) => void
type WalkOptions = {
  enter?: WalkerCallback
  leave?: WalkerCallback
}

const walk = (ast: Program | Node, opts: WalkOptions) => {
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

export { walk }
