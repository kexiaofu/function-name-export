const {parse} = require('@babel/parser');
const {default: traverse} = require("@babel/traverse");
const eventEmitter = require('../utils/event');
const { HANDLE_FUNCTION, FUNCTION_CALL } = require('../utils/eventHandleEnum');
const { isArray } = require('../utils/utils');
const handler = require('./plugins/handler');
const isFunctionHadBeenCalled = require('./plugins/isFunctionHadBeenCalled');

function getFunctionAggregation(code) {

  // parse code to AST
  const AST = parse(code, {
    sourceType: 'module',
    plugins: [
      "jsx",
      "typescript",
      "classProperties"
    ]
  });

  let result = [];
  let functionCallResult = [];

  // get the result what traverse AST handle
  eventEmitter.on(HANDLE_FUNCTION, (msg) => {
    if (isArray(msg)) {
      result.push(...msg);
    } else {
      result.push(msg);
    }
  });

  // get the message(which function had been called then return the name)
  eventEmitter.on(FUNCTION_CALL, (msg) => {
    functionCallResult.push(msg);
  })

  // traverse AST to get function expression
  traverse(AST, {
    enter(path) {
      // get function info
      handler(path, false);
      // check function had been called or not
      isFunctionHadBeenCalled(path);
    }
  })

  // sort by line asc
  result.sort((a, b) => a.line - b.line);

  // If the state is true then it's being called
  // otherwise it is never called
  result = result.map(item => {
    item.status = true;
    if (functionCallResult.indexOf(item.name) === -1) {
      item.status = false;
    }
    return item;
  })

  console.log(result);
  return result;
}

module.exports = getFunctionAggregation;