# dlog

![version](https://img.shields.io/badge/version-1.0.0-dodgerblue)

## Dev console logger library and Babel plugin

Console logging library and Babel plugin that enhances logs by 
automatically injecting source filenames (relative to project root) 
and line numbers into log statements. Removes all logging in 
production environments.

#### Goals
* Print original (not transpiled) source filename and line number.
* Usable in React and React Native development.
* Completely remove logging in production.

## API

```ts
dlog.log("message")   // Prints to console.log
dlog.error("message") // Prints to console.error
```

## How to use

### Add package to your project

    npm install --save-dev @glitchybyte/dlog

### Add plugin to `babel.config.js`

```js
{
  presets: [...],
  plugins: [
    ...,
    "@glitchybyte/dlog/plugin"
  ]
}
```

### Use it in your code

```ts
// path/to/my-code.ts
import { dlog } from "@glitchybyte/dlog"

dlog.log("Some message!")
// @path/to/my-code.ts:4 Some message!
```
