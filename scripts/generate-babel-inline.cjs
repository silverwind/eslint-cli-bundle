#!/usr/bin/env node
const fs = require('fs');

// Read the babel.cjs file content
const babelCode = fs.readFileSync('node_modules/jiti/dist/babel.cjs', 'utf8');

// Wrap it in a function that evaluates and caches the transform
const wrapper = `// Inline babel.cjs content
// This module wraps the babel transform in a lazy-loading function
let _babelTransform;

function loadBabelTransform() {
  if (!_babelTransform) {
    const exports = {};
    const module = { exports };
    // Execute the babel.cjs code to populate module.exports
    (function(exports, module) {
${babelCode}
    })(exports, module);
    _babelTransform = module.exports;
  }
  return _babelTransform;
}

// Export the loader function, not the result
module.exports = loadBabelTransform;
`;

// Ensure vendor directory exists
fs.mkdirSync('vendor', { recursive: true });

// Write the wrapper file
fs.writeFileSync('vendor/babel-inline.cjs', wrapper);
console.log('Generated vendor/babel-inline.cjs');
