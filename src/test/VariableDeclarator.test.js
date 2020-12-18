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
    line: 2,
    status: false
  },
  {
    type: 'VariableDeclaration',
    name: 'inner',
    line: 3,
    status: false
  },
  {
    type: 'VariableDeclaration',
    name: 'arrowFn',
    line: 5,
    status: false
  },
  {
    type: 'VariableDeclaration',
    name: 'fnArrow',
    line: 8,
    status: false
  },
  {
    type: 'VariableDeclaration',
    name: 'arrowInner',
    line: 9,
    status: false
  },
  {
    type: 'VariableDeclaration',
    name: 'arrowFnA',
    line: 11,
    status: false
  }
];

test('test export function by VariableDeclarator', () => {
  let result = [];

  result = getFunctionAggregation(code);

  expect(result).toEqual(codeResult);
})