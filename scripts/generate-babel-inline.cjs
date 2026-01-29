#!/usr/bin/env node
const fs = require('fs');

const babelCode = fs.readFileSync('node_modules/jiti/dist/babel.cjs', 'utf8');
const wrapper = `// Inline babel.cjs content
let _babelTransform;
function getBabelTransform() {
  if (!_babelTransform) {
    const exports = {};
    const module = { exports };
    (function(exports, module) {
${babelCode}
    })(exports, module);
    _babelTransform = module.exports;
  }
  return _babelTransform;
}
module.exports = getBabelTransform();
`;

fs.writeFileSync('vendor/babel-inline.cjs', wrapper);
console.log('Generated vendor/babel-inline.cjs');
