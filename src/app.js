const {transform} = require('@babel/core');
const eventEmitter = require('./utils/event');
const { HANDLE_FUNCTION } = require('./utils/eventHandleEnum');

const fromFunctionDeclaration = require('./visitors/FunctionDeclaration');
const fromVariableDeclarator = require('./visitors/VariableDeclarator');
const fromExpressionStatement = require('./visitors/ExpressionStatement');
const fromClassDeclaration = require('./visitors/ClassDeclaration');

let result = [];

function getFunctionName(code, options) {
  result = [];
  eventEmitter.on(HANDLE_FUNCTION, (e) => {
    result.push(e);
  })
  let { isJsx = false, isTs = false, filename } = options;
  
  // 设置 filename 默认值 
  if ((isJsx || isTs) && !filename) {
    filename = 'function-name-export.ts';
  }
  transform(code, {
    presets: [
      isTs ? [
        "@babel/preset-typescript", 
        {
          allowDeclareFields: true
        }
      ] : undefined,
      isJsx ? ["@babel/preset-react"] : undefined
    ].filter(Boolean),
    filename,
    plugins: [
      ['@babel/plugin-proposal-class-properties'],
      [fromVariableDeclarator],
      [fromFunctionDeclaration],
      [fromExpressionStatement],
      [fromClassDeclaration]
    ]
  })

  // 删除重复元素
  let resultClone = result.slice().map((item, index) => {
    item.index = index;
    return item;
  });
  while(resultClone.length) {
    const item = resultClone.pop();
    const items = resultClone.filter(r => r.name === item.name && r.line === item.line);
    items.map(i => result.splice(i.index, 1));
  }
  result = result.map(item => {
    delete item.index;
    return item;
  })
  console.log(result);
  return result;
}

module.exports = getFunctionName;
