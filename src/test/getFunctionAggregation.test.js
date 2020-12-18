const getFunctionAggregation = require('../parser/parse');

const code = `
function HelloWorld() {
  return <div>hello world</div>
}

class HelloWorldComponent extends Component {

  handleEvent = function() {};

  handleOther = () => {};

  somethingFn() {};

  render() {
    return <div onClick={handleEvent}>hello HelloWorldComponent</div>
  }
}

const outFn = function withNameFn() {}

const fn = function() {};

const fnArrow = () => {};

let a = {};

a.b = () => {};

a.c = function withNameFnForA() {};

function test() {
  function inner() {}
}
`;

const codeResult = [
  {
    type: 'FunctionDeclaration',
    name: 'HelloWorld',
    line: 2,
    status: false
  },
  {
    type: 'ClassDeclaration',
    name: 'HelloWorldComponent',
    line: 6,
    status: false
  },
  {
    type: 'ClassProperty',
    name: 'handleEvent',
    line: 8,
    status: false
  },
  {
    type: 'ClassProperty',
    name: 'handleOther',
    line: 10,
    status: false
  },
  {
    type: 'ClassMethod',
    name: 'somethingFn',
    line: 12,
    status: false
  },
  {
    type: 'ClassMethod',
    name: 'render',
    line: 14,
    status: false
  },
  {
    type: 'VariableDeclaration',
    name: 'withNameFn',
    line: 19,
    status: false
  },
  {
    type: 'VariableDeclaration',
    name: 'fn',
    line: 21,
    status: false
  },
  {
    type: 'VariableDeclaration',
    name: 'fnArrow',
    line: 23,
    status: false
  },
  {
    type: 'ExpressionStatement',
    name: 'a.b',
    line: 27,
    status: false
  },
  {
    type: 'ExpressionStatement',
    name: 'withNameFnForA',
    line: 29,
    status: false
  },
  {
    type: 'FunctionDeclaration',
    name: 'test',
    line: 31,
    status: false
  },
  {
    type: 'FunctionDeclaration',
    name: 'inner',
    line: 32,
    status: false
  }
];

test('test getFunctionAggregation function', () => {
  let result = [];

  result = getFunctionAggregation(code);

  expect(result).toEqual(codeResult);
})