const {parse} = require('@babel/parser');
const {default: traverse} = require("@babel/traverse");
const eventEmitter = require('../utils/event');
const { HANDLE_FUNCTION } = require('../utils/eventHandleEnum');
const { isArray } = require('../utils/utils');
const handler = require('./plugins/handler');

function getFunctionAggregation(code) {

  // parse code to AST
  const AST = parse(code, {
    sourceType: 'module',
    plugins: [
      "jsx",
      "classProperties"
    ]
  });

  let result = [];

  // get the result what traverse AST handle
  eventEmitter.on(HANDLE_FUNCTION, (msg) => {
    if (isArray(msg)) {
      result.push(...msg);
    } else {
      result.push(msg);
    }
  })

  // traverse AST to get function expression
  traverse(AST, {
    enter(path) {
      handler(path, false);
    }
  })

  // sort by line asc
  result.sort((a, b) => a.line - b.line)

  console.log(result);
  return result;
}

getFunctionAggregation(`
var fn = function() {
  var inner = function() {};

  const arrowFn = () => {};
};

var fnArrow = () => {
  var arrowInner = function() {};

  let arrowFnA = function() {};
};
`)

module.exports = getFunctionAggregation;