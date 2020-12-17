const getFunctionAggregation = require('../parser/parse');

const code = `
  class A extends B {
    testB = () => {}

    testC = function() {}

    testD = function testFn() {}

    testE() {}
  }
`;

const codeResult = [{
    type: 'ClassDeclaration',
    name: 'A',
    line: 2
  },
  {
    type: 'ClassProperty',
    name: 'testB',
    line: 3
  },
  {
    type: 'ClassProperty',
    name: 'testC',
    line: 5
  },
  {
    type: 'ClassProperty',
    name: 'testD',
    line: 7
  },
  {
    type: 'ClassMethod',
    name: 'testE',
    line: 9
  }
];

test('test export function in class', () => {
  let result = [];

  result = getFunctionAggregation(code)

  expect(result).toEqual(codeResult);
})