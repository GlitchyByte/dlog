// Copyright 2025 GlitchyByte
// SPDX-License-Identifier: Apache-2.0

module.exports = function({ types: t }) {
  return {
    name: "glog",
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
          const fs = require("fs")
          const p = require("path")
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
          state._sourcePath = "@" + filepath.slice(rootPath.length + 1)
        }
      },
      CallExpression(path, state) {
        // Find glog.log("message") and transform it to something like glog.log("@path/to/file:12", "message")
        if (!t.isMemberExpression(path.node.callee)) {
          return
        }
        const object = path.node.callee.object
        const property = path.node.callee.property
        if (
          !t.isIdentifier(object, { name: "glog" }) ||
          !(t.isIdentifier(property, { name: "log" }) || t.isIdentifier(property, { name: "error" }))
        ) {
          return
        }
        if (state._isProduction) {
          // In production, remove the whole statement.
          let currentPath = path
          while (currentPath.type !== "ExpressionStatement") {
            currentPath = currentPath.parentPath
          }
          currentPath.remove()
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
