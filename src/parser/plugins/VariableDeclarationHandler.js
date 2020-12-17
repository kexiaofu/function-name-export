const {
  getLine,
  getName,
  isHadFunctionString
} = require('../../utils/utils');
const eventEmitter = require('../../utils/event');
const {
  HANDLE_FUNCTION
} = require('../../utils/eventHandleEnum');

module.exports = VariableDeclarationHandler;

function VariableDeclarationHandler(path, repeat = false) {
  const node = path.node || path;
  try {
    let result = [];

    if (node.declarations && !repeat) {
      while (node.declarations.length > 0) {
        const item = node.declarations.shift();
        VariableDeclarationHandler(item, true);
      }
    } else {
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

        const BlockStatementBody = initNode.body.body || [];
        
        const handler = require('./handler');

        // 这里会导致块级作用域内的方法先返回
        // 因为这里先运行再返回 result
        BlockStatementBody.forEach(item => {
          handler(item);
        })

      }

      eventEmitter.emit(HANDLE_FUNCTION, result);

      // console.log(result);
      return result;
    }
    
    return null;
  } catch (e) {
    console.log('VariableDeclarationHandler catch error', e)
    return null;
  }
}
