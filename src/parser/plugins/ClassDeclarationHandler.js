const {
  getLine,
  getName
} = require('../../utils/utils');
const eventEmitter = require('../../utils/event');
const {
  HANDLE_FUNCTION
} = require('../../utils/eventHandleEnum');

function ClassDeclarationHandler(path) {
  try {
    const result = {
      type: 'ClassDeclaration',
      name: getName(path.node.id),
      line: getLine(path.node.id)
    };
    console.log(result);
    eventEmitter.emit(HANDLE_FUNCTION, result);
    return result;

  } catch {
    console.log('ClassDeclarationHandler catch error');
  }
}

module.exports = ClassDeclarationHandler;