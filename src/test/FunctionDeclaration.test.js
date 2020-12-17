const { transform } = require('@babel/core');
const eventEmitter = require('../utils/event');
const { HANDLE_FUNCTION } = require('../utils/eventHandleEnum');
const FunctionDeclarationPlugin = require('../visitors/FunctionDeclaration');

const code = `
function testFn() {}
`;

const codeResult = [
  {
    type: 'FunctionDeclaration',
    subType: '',
    parentName: '',
    name: 'testFn',
    line: 2
  }
];

test('test export function in FunctionDeclaration', () => {
  let result = [];

  eventEmitter.on(HANDLE_FUNCTION, (e) => {
    result.push(e);
  })

  transform(code, {
    plugins: [
      [FunctionDeclarationPlugin]
    ]
  })

  expect(result).toEqual(codeResult);
})