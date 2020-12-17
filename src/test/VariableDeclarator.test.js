const { transform } = require('@babel/core');
const eventEmitter = require('../utils/event');
const { HANDLE_FUNCTION } = require('../utils/eventHandleEnum');
const VariableDeclaratorPlugin = require('../visitors/VariableDeclarator');

const code = `
var fn = function() {};

var fnArrow = () => {};
`;

const codeResult = [
  {
    type: 'VariableDeclarator',
    subType: '',
    name: 'fn',
    parentName: '',
    line: 2
  },
  {
    type: 'VariableDeclarator',
    subType: 'ArrowFunctionExpression',
    name: 'fnArrow',
    parentName: '',
    line: 4
  }
];

test('test export function by VariableDeclarator', () => {
  let result = [];

  eventEmitter.on(HANDLE_FUNCTION, (e) => {
    result.push(e);
  })

  transform(code, {
    plugins: [
      [VariableDeclaratorPlugin]
    ]
  })

  expect(result).toEqual(codeResult);
})