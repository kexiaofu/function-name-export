const {transform} = require('@babel/core');

// var fn = function() {};
// var fn = () => {};
function fromVariableDeclarator() {
  return {
      visitor: {
        VariableDeclarator(path) {
          let name = '', parentName = path.node.id.name, firstFn = true, isFun = false;
          const startLine = path.node.loc.start.line;
          path.traverse({
            FunctionExpression(path) {
              isFun = true;
              if (firstFn && path.get('id').node) {
                console.log(path.get('id').node.name)
                name = path.get('id').node.name;
              }
              if (firstFn) {
                firstFn = false;
              }
            }
          })
          if (isFun) {
            let node = {
              type: 'VariableDeclarator',
              name: name ? name : parentName,
              line: startLine
            }
            result.push(node);
          }
          
        }
      }
  }
}

// function hello() {}
// function() {} is error
function fromFunctionDeclaration() {
  return {
    visitor: {
      FunctionDeclaration(path) {
        let name = '', startLine = path.get('loc').node.start.line;
        const id = path.get('id');
        if (id) {
          name = id.get('name').node;
        }
        if (name) {
          result.push({
            type: 'FunctionDeclaration',
            name,
            line: startLine
          })
        }
      }
    }
  }
}

// a.b = function hello() {};
// ;(function (arg) {})(arg)
// 如果 (function (arg) {})(arg) 前无分割，则识别不出来
function fromExpressionStatement() {
  return {
    visitor: {
      ExpressionStatement(path) {
        const leftNode = path.get('expression').get('left');
        const startLine = path.get('loc').node.start.line;
        let leftName = '', firstFn = true;

        if (leftNode.node) {
          const objectNode = leftNode.get('object').node;
          const propertyNode = leftNode.get('property').node;
          if (objectNode && propertyNode) {
            leftName = `${objectNode.name}.${propertyNode.name}`
          }
        }
        path.traverse({
          FunctionExpression(path) {
            if (firstFn) {
              firstFn = false;
              const id = path.get('id').node;
              let name = leftName;
              if (id) {
                name = id.name;
              } 
              result.push({
                type: 'ExpressionStatement',
                name,
                line: startLine
              })
            }
          }
        })
      }
    }
  }
}

// TODO .catch .then
function fromCallExpression() {}

let result = [];
// 
function getFunctionName(code) {
  result = [];
  transform(code, {
    plugins: [
      [fromVariableDeclarator],
      [fromFunctionDeclaration],
      [fromExpressionStatement]
    ]
  })
  console.log(result);
}

getFunctionName(`
a.b = function hello() {};
a.c = function() {}
(function h1(arg) {})(arg);
var processPoDetail = exports.processPoDetail = function (req, poDetail) {
    var result = processPoBasic(req, poDetail);
    var comps = poDetail.comps || [];
    var tradeLimit = poDetail.tradeLimit || {};
    var adjustInfo = poDetail.adjustInfo || {};

    var onSale = (result.poStatus === '1');
    result.canBuy = onSale ? tradeLimit.canBuy : false;
    result.canRedeem = onSale ? tradeLimit.canRedeem : false;
    result.cannotBuyReason = tradeLimit.cannotBuyReason;
    result.cannotRedeemReason = tradeLimit.cannotRedeemReason;
    result.personalHighestBuyAmount = utils.toFixed(tradeLimit.personalHighestBuyAmount, 2);
    result.personalLowestBuyAmount = utils.toFixed(tradeLimit.personalLowestBuyAmount, 2);
    result.composition = [];
    result.adjustInfo = {
      adjustmentId: adjustInfo.adjustmentId,
      comment: adjustInfo.adjustmentId == 116289 ? COMMENT_116289 : adjustInfo.comment,
      adjustedOn: utils.formatDate(adjustInfo.adjustedOn),
      details: adjustInfo.details
    };
  }
`)

module.exports = getFunctionName;



