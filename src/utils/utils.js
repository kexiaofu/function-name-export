// handle FunctionDeclaration
const handleFunctionDeclaration = function(node) {
  console.log(node);
  try {
    let name = '',
      locNode = node.loc,
      startLine = locNode.start.line;
    const id = node.id;
    console.log(startLine, id)
    if (id) {
      name = id.name;
    }
    return [name, startLine];
  } catch {
    console.log('handleFunctionDeclaration catch error');
    return ['', -1];
  }
}

// handle ExpressionStatement
const expressionStatementLeftNode = function(path) {
  const leftNode = path.get('expression').get('left');
  const locNode = path.get('loc');
  if (!locNode.node) {
    return [null, -1];
  }
  const startLine = locNode.node ? locNode.node.start.line : -1;
  let leftName = '';
  if (leftNode.node) {
    const objectNode = leftNode.get('object').node;
    const propertyNode = leftNode.get('property').node;
    if (objectNode && propertyNode) {
      leftName = `${objectNode.name || objectNode.type === 'ThisExpression' ? 'this' : ''}.${propertyNode.name}`
    }
  } else {
    // TODO 需要处理 a = function() {} 这种情况
    // console.log(Object.keys(path.node), path.node.expression)
  }
  return [leftName, startLine];
}

// class inside function
const handleClassFunction = function(path) {
  if (path.parent &&
    path.parent.arguments &&
    isArray(path.parent.arguments)
  ) {
    try {
      const _arguments = path.parent.arguments;
      const target = _arguments.filter(item => item.type === 'StringLiteral');
      const name = target.length > 0 ? target[0].value : '';
      const line = path.node.loc.start.line;
      return [name, line]
    } catch {
      console.log(node);
      console.log('handleClassFunction can not get line');
      return ['', -1]
    }
  }
  return ['', -1]
}

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
  return str ? isHadKeyWord(str, 'function') : false;
}

const isIncludeKey = function(object, key) {
  return Object.keys(object).indexOf(key) > -1;
}

const isIncludeBody = function (object) {
  return isIncludeKey(object, 'body');
}

module.exports = {
  handleFunctionDeclaration,
  expressionStatementLeftNode,
  handleClassFunction,
  isArray,
  getLine,
  getName,
  isHadKeyWord,
  isHadFunctionString,
  isIncludeBody
}