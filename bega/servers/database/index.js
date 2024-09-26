const fs = require('fs').promises;
const path = require('path');

async function loadModulesRecursively(dir) {
 const exportedModules = {};

 async function traverseDirectory(currentPath) {
  let files;
  try {
   files = await fs.readdir(currentPath);
  } catch (err) {
   console.error(`Failed to read directory ${currentPath}:`, err);
   return;
  }

  await Promise.all(
   files.map(async file => {
    const filePath = path.join(currentPath, file);
    let fileStats;

    try {
     fileStats = await fs.stat(filePath);
    } catch (err) {
     console.error(`Failed to get stats for ${filePath}:`, err);
     return;
    }

    if (fileStats.isDirectory()) {
     await traverseDirectory(filePath);
    } else if (fileStats.isFile() && path.extname(file) === '.js') {
     const moduleName = path.basename(file, '.js');

     Object.defineProperty(exportedModules, moduleName, {
      get: () => {
       try {
        const moduleExports = require(filePath);
        return memoizeExports(moduleExports);
       } catch (error) {
        console.error(`Failed to load module ${file}:`, error);
        return null;
       }
      },
      enumerable: true,
      configurable: false
     });
    }
   })
  );
 }

 function memoizeExports(exports) {
  if (typeof exports === 'object' && exports !== null) {
   return new Proxy(exports, {
    get: (target, prop) => {
     if (prop in target) {
      return target[prop];
     }
     throw new Error(`Property ${prop} does not exist in the module.`);
    },
    set: () => {
     throw new Error('Cannot modify exported Modules.');
    },
    deleteProperty: () => {
     throw new Error('Cannot delete properties from exported Modules.');
    }
   });
  }
  return exports;
 }

 await traverseDirectory(dir);
 return Object.freeze(exportedModules);
}

module.exports = loadModulesRecursively(__dirname);
