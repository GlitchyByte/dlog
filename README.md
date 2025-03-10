# GLog (Babel plugin)

![Version](https://img.shields.io/badge/Version-0.1.0-blue)

Babel plugin that enhances glog (an included console logger replacement) 
by automatically injecting source filenames (relative to project root) 
and line numbers into log statements. Silently removes all logging in 
production environments.

#### Goals
* Print original (not transpiled) source filename and line number.
* Usable in React and React Native development.
* Completely remove logging in production.

## API

```ts
glog.log("message")   // Prints to console.log
glog.error("message") // Prints to console.error
```

## How to use

### Add the package to your project

    npm install --save-dev @glitchybyte/babel-plugin-glog

### Add the plugin to `babel.config.js`

```js
{
  presets: [...],
  plugins: [
    ...,
    "@glitchybyte/babel-plugin-glog"
  ]
}
```

### Use it in your code

```ts
// path/to/my-code.ts
import { glog } from "@glitchybyte/babel-plugin-glog/glog"

glog.log("Some message!")
// @path/to/my-code.ts:4 Some message!
```
