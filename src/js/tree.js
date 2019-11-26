/*
 * @Date: 2019-09-16 14:59:51
 * @LastEditors: xieminhui
 * @LastEditTime: 2019-09-16 14:59:51
 */
var tree = {
  value: 1,
  left: {
    value: 2,
    left: {
      value: 4
    }
  },
  right: {
    value: 3,
    left: {
      value: 5,
      left: {
        value: 7
      },
      right: {
        value: 8
      }
    },
    right: {
      value: 6
    }
  }
}

var levelOrderTraversal = function (node) {
  if (!node) {
    throw new Error('Empty Tree')
  }

  var que = []
  que.push(node)
  while (que.length !== 0) {
    node = que.shift()
    console.log(node.value)
    if (node.left) que.push(node.left)
    if (node.right) que.push(node.right)
  }
}