/*
 * @Date: 2019-09-11 15:49:48
 * @LastEditors: xieminhui
 * @LastEditTime: 2019-11-13 15:41:34
 */
const fs = require('fs');
const path = require('path');
const babylon = require('babylon');
const traverse = require('babel-traverse').default;
const {
  transformFromAst
} = require('babel-core')

let ID = 0;

/**
 * @description: 生成ast语法树
 * @param {string} filename 文件目录
 * @return {Object} 
 */
function createAsset(filename) {
  const content = fs.readFileSync(filename, 'utf-8');
  // loader
  const customCode = loader(filename, content)

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
  } = transformFromAst(ast, null, {
    presets: ['env']
  })
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
        ${mod.code}
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

      return module.exports;
    }
    
    require(0);
  })({${modules}})
  ;`
  return result;
}

debugger;
const graph = createGraph('./src/js/index.js');
const result = bundle(graph);