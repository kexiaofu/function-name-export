const { transform } = require('@babel/core');
const eventEmitter = require('../utils/event');
const { HANDLE_FUNCTION } = require('../utils/eventHandleEnum');
const ClassDeclarationPlugin = require('../visitors/ClassDeclaration');

const code = `
  class A extends B {
    testB = () => {}

    testC = function() {}

    testD = function testFn() {}

    testE() {}
  }
`;

const codeResult = [
  {
    type: 'ClassDeclaration',
    subType: '',
    parentName: 'A',
    name: 'A',
    line: 2
  },
  {
    type: 'ClassDeclaration',
    subType: 'ArrowFunctionExpression',
    parentName: 'A',
    name: 'testB',
    line: 3
  },
  {
    type: 'ClassDeclaration',
    subType: 'FunctionExpression',
    parentName: 'A',
    name: 'testC',
    line: 5
  },
  {
    type: 'ClassDeclaration',
    subType: 'FunctionExpression',
    parentName: 'A',
    name: 'testD',
    line: 7
  },
  {
    type: 'ClassDeclaration',
    subType: 'ClassMethod',
    parentName: 'A',
    name: 'testE',
    line: 9
  }
];

test('test export function in class', () => {
  let result = [];

  eventEmitter.on(HANDLE_FUNCTION, (e) => {
    result.push(e);
  })

  transform(code, {
    plugins: [
      ['@babel/plugin-proposal-class-properties'],
      [ClassDeclarationPlugin]
    ]
  })

  expect(result).toEqual(codeResult);
})