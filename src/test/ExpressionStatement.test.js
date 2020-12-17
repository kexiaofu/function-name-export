const { transform } = require('@babel/core');
const eventEmitter = require('../utils/event');
const { HANDLE_FUNCTION } = require('../utils/eventHandleEnum');
const ExpressionStatementPlugin = require('../visitors/ExpressionStatement');

const code = `
a.b = function hello() {};

(function (arg) {})(arg);

(function innerFn(arg) {})(arg);
`;

const codeResult = [
  {
    type: 'ExpressionStatement',
    subType: 'FunctionExpression',
    parentName: '',
    name: 'hello',
    line: 2
  },
  {
    type: 'ExpressionStatement',
    subType: 'FunctionExpression',
    parentName: '',
    name: 'innerFn',
    line: 6
  }
];

test('test export function in expression', () => {
  let result = [];

  eventEmitter.on(HANDLE_FUNCTION, (e) => {
    result.push(e);
  })

  transform(code, {
    plugins: [
      [ExpressionStatementPlugin]
    ]
  })

  expect(result).toEqual(codeResult);
})