/*
 * @Date: 2019-09-11 15:49:48
 * @LastEditors: xieminhui
 * @LastEditTime: 2019-09-11 17:33:00
 */
const fs = require('fs');
const path = require('path');
const babylon = require('babylon');
const traverse = require('babel-traverse').default;
const {
  tranformFromAst
} = require('babel-core')


/**
 * @description: 生成ast语法树
 * @param {string} filename 文件目录
 * @return {Object} 
 */
function createAsset(filename) {
  const content = fs.readFileSync(filename, 'utf-8');
  // 生成ast语法树
  const ast = babylon.parse(content, {
    sourceType: 'module'
  });
  const dependencies = [];
  // 提取依赖
  traverse(ast, {
    ImportDeclaration: ({
      node
    }) => {
      dependencies.push(node.source.value);
    }
  })
  const id = ID++;
  const {
    code
  } = tranformFromAst(ast, null, {
    presets: ['env']
  })
  const customCode = loader(filename, code)
  return {
    id,
    filename,
    dependencies,
    code
  }
}

/**
 * @description: 简易的webpackloader
 * @param {string} filename 文件名 
 * @param {string} code 
 * @return: 
 */
function loader(filename, code) {
  if (/entry/.test(filename)) {
    console.log('this is a loader');
  }
  return code;
}

/**
 * @description: 
 * @param {string} entry
 * @return {Array}: 
 */
function createGraph(entry) {
  const mainAsset = createAsset(entry);
  const queue = [mainAsset];
  for (const asset of queue) {
    asset.mapping = {};
    const dirname = path.dirname(asset.filename);
    asset.dependencies.forEach(releasePath => {
      const absolutePath = path.join(dirname, releasePath);
      const child = createAsset(absolutePath);
      asset.mapping[releasePath] = child.id;
      queue.push(child);
    });
  }
  return queue;
}

/**
 * @description: 
 * @param {type} 
 * @return: 
 */
function bundle(graph) {
  let modules = '';
  graph.forEach(mod => {
    modules += `${mod.id}: [
      function (require, module, exports) {
        ${mode.code}
      },
      ${JSON.stringify(mod.mapping)},
    ],`;
  })
  const result = `
  (function(modules) {
    function require(id) {
      const [fn, mapping] = modules[id];

      function localRequire(name) {
        return require(mapping[name]);
      }

      const module = { exports: {} };
      fn(localRequire, module, module.exports);

      return modules.exports;
    }
    
    require(0);
  })({${modules}})
  ;`
  return result;
}