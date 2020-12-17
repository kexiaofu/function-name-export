const getFunctionAggregation = require('../parser/parse');

const code = `
function testFn() {
  function inner() {
    function hello() {}
  }
}
`;

const codeResult = [
  {
    type: 'FunctionDeclaration',
    name: 'testFn',
    line: 2
  },
  {
    type: 'FunctionDeclaration',
    name: 'inner',
    line: 3
  },
  {
    type: 'FunctionDeclaration',
    name: 'hello',
    line: 4
  }
];

test('test export function in FunctionDeclaration', () => {
  let result = [];

  result = getFunctionAggregation(code);

  expect(result).toEqual(codeResult);
})