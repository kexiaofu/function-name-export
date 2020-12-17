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
    line: 2
  },
  {
    type: 'ClassDeclaration',
    name: 'HelloWorldComponent',
    line: 6
  },
  {
    type: 'ClassProperty',
    name: 'handleEvent',
    line: 8
  },
  {
    type: 'ClassProperty',
    name: 'handleOther',
    line: 10
  },
  {
    type: 'ClassMethod',
    name: 'somethingFn',
    line: 12
  },
  {
    type: 'ClassMethod',
    name: 'render',
    line: 14
  },
  {
    type: 'VariableDeclaration',
    name: 'withNameFn',
    line: 19
  },
  {
    type: 'VariableDeclaration',
    name: 'fn',
    line: 21
  },
  {
    type: 'VariableDeclaration',
    name: 'fnArrow',
    line: 23
  },
  {
    type: 'ExpressionStatement',
    name: 'a.b',
    line: 27
  },
  {
    type: 'ExpressionStatement',
    name: 'withNameFnForA',
    line: 29
  },
  {
    type: 'FunctionDeclaration',
    name: 'test',
    line: 31
  },
  {
    type: 'FunctionDeclaration',
    name: 'inner',
    line: 32
  }
];

test('test getFunctionAggregation function', () => {
  let result = [];

  result = getFunctionAggregation(code);

  expect(result).toEqual(codeResult);
})