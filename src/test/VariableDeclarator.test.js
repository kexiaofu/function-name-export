const getFunctionAggregation = require('../parser/parse');

const code = `
var fn = function() {
  var inner = function() {};

  const arrowFn = () => {};
};

var fnArrow = () => {
  var arrowInner = function() {};

  let arrowFnA = function() {};
};
`;

const codeResult = [
  {
    type: 'VariableDeclaration',
    name: 'fn',
    line: 2
  },
  {
    type: 'VariableDeclaration',
    name: 'inner',
    line: 3
  },
  {
    type: 'VariableDeclaration',
    name: 'arrowFn',
    line: 5
  },
  {
    type: 'VariableDeclaration',
    name: 'fnArrow',
    line: 8
  },
  {
    type: 'VariableDeclaration',
    name: 'arrowInner',
    line: 9
  },
  {
    type: 'VariableDeclaration',
    name: 'arrowFnA',
    line: 11
  }
];

test('test export function by VariableDeclarator', () => {
  let result = [];

  result = getFunctionAggregation(code);

  expect(result).toEqual(codeResult);
})