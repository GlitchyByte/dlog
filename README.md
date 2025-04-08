# dlog

![version](https://img.shields.io/badge/version-2.1.0-dodgerblue)

## Dev console logger library (with Babel plugin, Vite compatible)

Console logging library and Babel/Vite plugin that enhances logs by 
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

```bash
npm install --save-dev @glitchybyte/dlog
```

### In Babel (e.g., Expo and React Native development)

Add plugin to `babel.config.js`

```js
{
  presets: [...],
  plugins: [
    ...,
    "@glitchybyte/dlog/babel"
  ]
}
```

### In Vite (e.g., React development)

Add plugin to `vite.config.ts`

```ts
import dlog from "@glitchybyte/dlog/babel"

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [dlog]
      }
    })
  ]
})
```

### Use it in your code

```ts
// path/to/my-code.ts
import { dlog } from "@glitchybyte/dlog"

dlog.log("Some message!")
// @path/to/my-code.ts:4 Some message!
```
