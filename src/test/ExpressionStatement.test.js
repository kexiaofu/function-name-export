const getFunctionAggregation = require('../parser/parse');

const code = `
a.b = function hello() {};

(function (arg) {})(arg);

(function innerFn(arg) {})(arg);
`;

const codeResult = [
  {
    type: 'ExpressionStatement',
    name: 'hello',
    line: 2,
    status: false
  },
  {
    type: 'ExpressionStatement',
    name: 'innerFn',
    line: 6,
    status: false
  }
];

test('test export function in expression', () => {
  let result = [];

  result = getFunctionAggregation(code);

  expect(result).toEqual(codeResult);
})