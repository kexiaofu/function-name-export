const {transform} = require('@babel/core');
const eventEmitter = require('./utils/event');
const { HANDLE_FUNCTION } = require('./utils/eventHandleEnum');

const {
  FunctionDeclarationPlugin,
  FunctionDeclarationHandler
} = require('./visitors/FunctionDeclaration');
const VariableDeclaratorPlugin = require('./visitors/VariableDeclarator');
const ExpressionStatementPlugin = require('./visitors/ExpressionStatement');
const ClassDeclarationPlugin = require('./visitors/ClassDeclaration');

let result = [];

function getFunctionName(code, options={}) {
  result = [];
  eventEmitter.on(HANDLE_FUNCTION, (e) => {
    result.push(e);
  })
  let defaultOptions = {
    isJsx: false,
    isTs: false,
    filename: ''
  };
  let {
    isJsx = false, isTs = false, filename
  } = {
    ...defaultOptions,
    ...options
  };
  
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
      ] : undefined
    ].filter(Boolean),
    filename,
    plugins: [
      ['@babel/plugin-proposal-class-properties'],
      ['@babel/plugin-syntax-jsx'],
      [VariableDeclaratorPlugin],
      [FunctionDeclarationPlugin],
      [ExpressionStatementPlugin],
      [ClassDeclarationPlugin]
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

// getFunctionName(`
// function HelloWorld() {
//   return (<div>hello world</div>);
// };

// class HelloWorldComponent extends Component {

//   handleEvent = function() {};

//   handleOther = () => {};

//   somethingFn() {};

//   render() {
//     return <div onClick={handleEvent}>hello HelloWorldComponent</div>
//   }
// }

// const outFn = function withNameFn() {}

// const fn = function() {};

// const fnArrow = () => {};

// let a = {};

// a.b = () => {};

// a.c = function withNameFnForA() {};

// function test() {
//   function inner() {}
// }
// `, {isJsx: true, isTs: true})
eventEmitter.on(HANDLE_FUNCTION, (e) => {
  console.log(e);
})
const c = require("@babel/parser").parse(`
  function testParser() {
    function innerParser() {}
  }
  function HelloWorld() {
    return (<div>hello world</div>);
  }
`, {
  // parse in strict mode and allow module declarations
  sourceType: "module",

  plugins: [
    // enable jsx and flow syntax
    "jsx",
    "flow",
    [FunctionDeclarationPlugin],
  ]
});

const d = transform(`
  function test() {
    function inner() {}
  }
`, {
  // parse in strict mode and allow module declarations
  sourceType: "module",

  plugins: [
    [FunctionDeclarationPlugin],
  ]
});

console.log(FunctionDeclarationHandler(c));


module.exports = getFunctionName;
