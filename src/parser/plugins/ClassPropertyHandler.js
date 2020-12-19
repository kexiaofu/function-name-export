const {
  getLine,
  getName,
  isHadFunctionString
} = require('../../utils/utils');
const eventEmitter = require('../../utils/event');
const {
  HANDLE_FUNCTION
} = require('../../utils/eventHandleEnum');

function ClassPropertyHandler(path) {
  const node = path.node || path;
  try {
    // class A {
    //   hello = function() {}
    //   other = () => {}
    // }
    if (isHadFunctionString(node.value.type)) {
      const result = {
        type: 'ClassProperty',
        name: getName(path.node.key),
        line: getLine(path.node)
      };
      // console.log(result);
      eventEmitter.emit(HANDLE_FUNCTION, result);
    }
  } catch (error) {
    console.log('ClassPropertyHandler catch error:');
    console.log(error);
  }
}

module.exports = ClassPropertyHandler;
