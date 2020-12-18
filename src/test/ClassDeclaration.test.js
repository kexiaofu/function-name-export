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
    line: 2,
    status: false
  },
  {
    type: 'ClassProperty',
    name: 'testB',
    line: 3,
    status: false
  },
  {
    type: 'ClassProperty',
    name: 'testC',
    line: 5,
    status: false
  },
  {
    type: 'ClassProperty',
    name: 'testD',
    line: 7,
    status: false
  },
  {
    type: 'ClassMethod',
    name: 'testE',
    line: 9,
    status: false
  }
];

test('test export function in class', () => {
  let result = [];

  result = getFunctionAggregation(code)

  expect(result).toEqual(codeResult);
})