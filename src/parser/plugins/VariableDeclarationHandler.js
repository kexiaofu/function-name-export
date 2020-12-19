const {
  getLine,
  getName,
  isHadFunctionString
} = require('../../utils/utils');
const eventEmitter = require('../../utils/event');
const {
  HANDLE_FUNCTION
} = require('../../utils/eventHandleEnum');

function VariableDeclarationHandler(path, repeat = false) {
  const node = path.node || path;
  // console.log(node, '----->VariableDeclarationHandler')
  try {
    let result = [];
    const initNode = node.init;
    initType = initNode.type;
    let name = '';
    if (initType && isHadFunctionString(initType)) {
      if (initNode.id) {
        name = getName(initNode.id);
      } else {
        name = getName(node.id);
      }

      result.push({
        type: 'VariableDeclaration',
        name,
        line: getLine(node.id)
      })

      eventEmitter.emit(HANDLE_FUNCTION, result);

      // console.log(result);
    }
  } catch (error) {
    console.log('VariableDeclarationHandler catch error:');
    console.log(error)
  }
}

module.exports = VariableDeclarationHandler;
