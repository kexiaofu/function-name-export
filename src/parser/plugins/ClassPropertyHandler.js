const {
  getLine,
  getName
} = require('../../utils/utils');
const eventEmitter = require('../../utils/event');
const {
  HANDLE_FUNCTION
} = require('../../utils/eventHandleEnum');

function ClassPropertyHandler(path) {
  try {
    const result = {
      type: 'ClassProperty',
      name: getName(path.node.key),
      line: getLine(path.node)
    };
    console.log(result);
    eventEmitter.emit(HANDLE_FUNCTION, result);
    return result;

  } catch {
    console.log('ClassPropertyHandler catch error');
  }
}

module.exports = ClassPropertyHandler;