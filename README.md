# lighthouse-compare

## Installation
```
$ npm install lighthouse-compare lighthouse --save
```

## Usage
```JavaScript
const cp = require('child_process');
const compare = require('lighthouse-compare');

// build and serve
cp.execSync('yarn build', { stdio: 'inherit' });
const proc = cp.spawn('yarn', ['serve']);

// run local compare
compare.run({ url: 'http://localhost:5001' });
```