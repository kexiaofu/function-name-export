// handle FunctionDeclaration
function handleFunctionDeclaration(path) {
  try {
    let name = '',
      locNode = path.get('loc'),
      startLine = locNode.node ? locNode.node.start.line : -1;
    const id = path.get('id');
    if (id) {
      name = id.get('name').node;
    }
    return [name, startLine];
  } catch {
    console.log('handleFunctionDeclaration catch error');
    return ['', -1];
  }
}

// handle ExpressionStatement
function expressionStatementLeftNode(path) {
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
function handleClassFunction(path) {
  if (path.parent &&
    path.parent.arguments &&
    isArray(path.parent.arguments)
  ) {
    try {
      const arguments = path.parent.arguments;
      const target = arguments.filter(item => item.type === 'StringLiteral');
      const name = target.length > 0 ? target[0].value : '';
      const line = path.node.loc.start.line;
      return [name, line]
    } catch {
      console.log('handleClassFunction can not get line');
      return ['', -1]
    }
  }
  return ['', -1]
}

function isArray(target) {
  return Object.prototype.toString.call(target) === '[object Array]';
}

module.exports = {
  handleFunctionDeclaration,
  expressionStatementLeftNode,
  handleClassFunction,
  isArray
}