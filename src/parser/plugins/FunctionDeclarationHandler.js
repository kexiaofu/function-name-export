const {
  getLine,
  getName
} = require('../../utils/utils');
const eventEmitter = require('../../utils/event');
const { HANDLE_FUNCTION } = require('../../utils/eventHandleEnum');

function FunctionDeclarationHandler (path) {
  const node = path.node || path;
  try {
    const result = {
      type: 'FunctionDeclaration',
      name: getName(node.id),
      line: getLine(node.id)
    };
    // console.log(result);
    eventEmitter.emit(HANDLE_FUNCTION, result);
  } catch (error) {
    console.log('FunctionDeclarationHandler catch error:');
    console.log(error);
  }
}

module.exports = FunctionDeclarationHandler;
