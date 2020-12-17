const { transform } = require('@babel/core');
const eventEmitter = require('../utils/event');
const { HANDLE_FUNCTION } = require('../utils/eventHandleEnum');
const getFunctionName = require('../app');

const code = `
function HelloWorld() {
  return <div>hello world</div>
}

class HelloWorldComponent extends Component {

  handleEvent = function() {};

  handleOther = () => {};

  somethingFn() {};

  render() {
    return <div onClick={handleEvent}>hello HelloWorldComponent</div>
  }
}

const outFn = function withNameFn() {}

const fn = function() {};

const fnArrow = () => {};

let a = {};

a.b = () => {};

a.c = function withNameFnForA() {};

function test() {
  function inner() {}
}
`;

const codeResult = [];

test('test getFunctionName function', () => {
  let result = [];

  result = getFunctionName(code);

  expect(result).toEqual(codeResult);
})