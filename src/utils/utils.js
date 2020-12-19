const isArray = function(target) {
  return Object.prototype.toString.call(target) === '[object Array]';
}

const getLine = function(node) {
  try {
    return node.loc.start.line;
  } catch {
    console.log('getLine catch error');
    return '';
  }
}

const getName = function(node) {
  try {
    return node.name
  } catch {
    console.log('getName catch error');
    return '';
  }
}

const isHadKeyWord = function(str, key) {
  return str.toLocaleLowerCase().indexOf(key) > -1;
}

const isHadFunctionString = function(str) {
  return str ? isHadKeyWord(str, 'functionexpression') : false;
}

module.exports = {
  isArray,
  getLine,
  getName,
  isHadKeyWord,
  isHadFunctionString
}