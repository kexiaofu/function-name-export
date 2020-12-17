const {
  getLine,
  getName
} = require('../../utils/utils');
const eventEmitter = require('../../utils/event');
const { HANDLE_FUNCTION } = require('../../utils/eventHandleEnum');

function FunctionDeclarationHandler (path) {
  try {
    const result = {
      type: 'FunctionDeclaration',
      name: getName(path.node.id),
      line: getLine(path.node.id)
    };
    // console.log(result);
    eventEmitter.emit(HANDLE_FUNCTION, result);
    return result;
  } catch {
    console.log('FunctionDeclarationHandler catch error')
    return null;
  }
}

module.exports = FunctionDeclarationHandler;