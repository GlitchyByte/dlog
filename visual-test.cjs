// Copyright 2025 GlitchyByte
// SPDX-License-Identifier: Apache-2.0

const { dlog } = require("./dist/dlog")

dlog.log("one line")
dlog.log("one", "two", 3)
dlog.log(4, "five")
dlog.log(["this"])

const obj = {
  foo: "bar",
  bar: "baz"
}
dlog.log(42.8, obj, 8, "ppp")
