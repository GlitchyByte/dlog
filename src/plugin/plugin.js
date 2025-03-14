// Copyright 2025 GlitchyByte
// SPDX-License-Identifier: Apache-2.0

const fs = require("fs")
const p = require("path")

module.exports = function({ types: t }) {
  const void0Expression = t.unaryExpression("void", t.numericLiteral(0)) // void 0
  return {
    name: "dlog",
    visitor: {
      Program: {
        enter(path, state) {
          state._isProduction = process.env.NODE_ENV === "production"
          if (state._isProduction) {
            // In production, we exit fast as we are removing the whole statement.
            return
          }
          const filepath = state.file?.opts?.filename
          if (!filepath) {
            state._sourcePath = null
            return
          }
          // Find project root by traversing backwards to the directory with package.json.
          let currentPath = filepath
          let rootPath = ""
          while (currentPath !== "/") {
            if (fs.existsSync(p.join(currentPath, "package.json"))) {
              rootPath = currentPath
              break
            }
            currentPath = p.dirname(currentPath)
          }
          // Only record the relative path from project root.
          state._sourcePath = "@" + filepath.substring(rootPath.length + 1)
        }
      },
      ImportDeclaration(path, state) {
        // Find `import { dlog } from "@glitchybyte/dlog"` and remove it completely.
        if (!state._isProduction) {
          return
        }
        const source = path.node.source
        if (!source || !t.isStringLiteral(source)) {
          return
        }
        if (source.value === "@glitchybyte/dlog") {
          // Remove the whole import declaration.
          path.remove()
        }
      },
      CallExpression(path, state) {
        // Find `dlog.log("message")` and transform it to something like `dlog.log("@path/to/file:12", "message"`)
        if (!t.isMemberExpression(path.node.callee)) {
          return
        }
        const object = path.node.callee.object
        const property = path.node.callee.property
        if (
          !t.isIdentifier(object, { name: "dlog" }) ||
          !(t.isIdentifier(property, { name: "log" }) || t.isIdentifier(property, { name: "error" }))
        ) {
          return
        }
        if (state._isProduction) {
          // In production, we replace it with `void 0`.
          path.replaceWith(void0Expression)
          return
        }
        // Add source line argument to the glog call.
        const line = path.node.loc?.start?.line
        const sourceLine = state._sourcePath && line ?
          t.stringLiteral(`${state._sourcePath}:${line}`) :
          t.nullLiteral()
        path.node.arguments.unshift(sourceLine)
      }
    }
  }
}
