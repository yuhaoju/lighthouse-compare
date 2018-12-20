# lighthouse-compare

**Note: This is the pre-alpha version.**

## Installation
```
$ npm install lighthouse-compare lighthouse --save
```

## Usage
1. Use lighthouse-compare in your test script
```JavaScript
// test.js
const cp = require('child_process');
const compare = require('lighthouse-compare');

// build and start to serve locally
cp.execSync('yarn build', { stdio: 'inherit' });
const proc = cp.spawn('yarn', ['serve']);

// run lighthouse analysing
compare.run({ url: 'http://localhost:5001' });
```

2. Run script in CI
A `.travis.yml` example:
```
# need following config for running chrome
sudo: required
dist: trusty

# other config

# run your test script
script: node ./test.js

# add chrome addon to run lighthouse
addons:
  chrome: stable
```

3. You should be able to see the report link in the CI logs.
![image](https://user-images.githubusercontent.com/4938243/50292010-03222980-04ab-11e9-9bc4-7c0228101a74.png)

4. Click into the link and you can see the report.
![image](https://user-images.githubusercontent.com/4938243/50293506-bb9d9c80-04ae-11e9-9d0b-7d762eae94f8.png)

## TODO

- Wrap the service with Github App
- Cli tool
