// Re-export the babel transform from jiti
const path = require("path");
module.exports = require(path.resolve(__dirname, "../node_modules/jiti/dist/babel.cjs"));
