const { isArray } = require('../../utils/utils');
const handleFunction = require('./index');

function handler(path) {
  try {
    const node = path.node || path;
    const type = node.type;

    if (handleFunction[type]) {

      if (typeof handleFunction[type] === 'function') {

        handleFunction[type](path);

      } else if (isArray(handleFunction[type])) {

        handleFunction[type].forEach(fn => fn(path));

      }
      
    }
  } catch (error) {
    console.log('handler catch error:');
    console.log(error);
  }
}

module.exports = handler;
