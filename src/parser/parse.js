const {parse} = require('@babel/parser');
const {default: traverse} = require("@babel/traverse");
const eventEmitter = require('../utils/event');
const { HANDLE_FUNCTION, FUNCTION_CALL } = require('../utils/eventHandleEnum');
const { isArray } = require('../utils/utils');
const handler = require('./plugins/handler');

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
  let functionNameCallResult = [];

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
  // traverse遍历时，节点对应的方法不能更改 path （不能自主循环调用对应的方法处理），否则会中断traverse对AST的遍历
  traverse(AST, {
    enter(path) {
      // get function info
      handler(path);
    }
  })

  // sort by line asc
  result.sort((a, b) => a.line - b.line);

  // get function name in functionCallResult
  functionNameCallResult = functionCallResult.map(item => item.name);

  // If the state is true then it's being called
  // otherwise it is never called
  result = result.map(item => {
    item.status = false;
    if (functionNameCallResult.indexOf(item.name) > -1) {
      item.status = true;
      // gather the callee info
      item.calledAggregation = functionCallResult.filter(f => f.name === item.name);
    }
    return item;
  })

  // console.log(result);
  // console.log(functionCallResult);
  return result;
}

module.exports = getFunctionAggregation;