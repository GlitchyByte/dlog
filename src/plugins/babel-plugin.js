// Copyright 2025 GlitchyByte
// SPDX-License-Identifier: Apache-2.0

const fs = require("fs-extra")
const p = require("path")

module.exports = function({ types: t }) {
  const void0Expression = t.unaryExpression("void", t.numericLiteral(0)) // void 0
  return {
    name: "dlog-babel-plugin",
    visitor: {
      Program: {
        enter(path, state) {
          state._isProduction = process.env.NODE_ENV === "production"
          if (state._isProduction) {
            // We are in production. We don't need to extract any information.
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
        // We are looking for `dlog.` calls.
        const object = path.node.callee.object
        if (!t.isIdentifier(object, { name: "dlog" })) {
          return
        }
        if (state._isProduction) {
          // In production, we replace it with `void 0`.
          path.replaceWith(void0Expression)
          return
        }
        // Add source line argument to the dlog call.
        const line = path.node.loc?.start?.line
        const sourceLine = state._sourcePath && line ?
          t.stringLiteral(`${state._sourcePath}:${line}`) :
          t.nullLiteral()
        if (path.node.arguments.length === 0) {
          // No args. Should not be possible, but let's handle it anyway.
          path.node.arguments.unshift(sourceLine)
        } else {
          // It is possible for this to execute several times,
          // so we make sure the 1st argument is not what we are about to add.
          const firstArg = path.node.arguments[0]
          if (
            ((sourceLine.type === "NullLiteral") && (firstArg.type !== "NullLiteral")) ||
            ((sourceLine.type === "StringLiteral") && (
              (firstArg.type !== "StringLiteral") || ((firstArg.type === "StringLiteral") && (firstArg.value !== sourceLine.value)))
            )
          ) {
            // We are good. Let's add source line.
            path.node.arguments.unshift(sourceLine)
          }
        }
      }
    }
  }
}
