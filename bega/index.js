const fs = require('fs');
const path = require('path');
function loadModulesRecursively(dir) {
 const exportedModules = {};

 function traverseDirectory(currentPath) {
  const files = fs.readdirSync(currentPath);

  for (const file of files) {
   const filePath = path.join(currentPath, file);
   const fileStats = fs.statSync(filePath);

   if (fileStats.isDirectory()) {
    traverseDirectory(filePath);
   } else if (fileStats.isFile() && path.extname(file) === '.js') {
    const moduleName = path.basename(file, '.js');
    try {
     const moduleExports = require(filePath);
     if (typeof moduleExports === 'object' && moduleExports !== null) {
      Object.entries(moduleExports).forEach(([key, value]) => {
       exportedModules[key] = value;
      });
     } else {
      exportedModules[moduleName] = moduleExports;
     }
    } catch (error) {
     console.error(`Failed to load module ${file}:`, error);
    }
   }
  }
 }

 traverseDirectory(dir);

 for (const key of Object.keys(exportedModules)) {
  Object.defineProperty(exportedModules, key, {
   enumerable: false,
   configurable: false,
   writable: false
  });
 }

 return exportedModules;
}

const libPath = path.join(__dirname);
module.exports = loadModulesRecursively(libPath);
