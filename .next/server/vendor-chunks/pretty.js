"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/pretty";
exports.ids = ["vendor-chunks/pretty"];
exports.modules = {

/***/ "(rsc)/./node_modules/pretty/index.js":
/*!**************************************!*\
  !*** ./node_modules/pretty/index.js ***!
  \**************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("/*!\n * pretty <https://github.com/jonschlinkert/pretty>\n *\n * Copyright (c) 2013-2015, 2017, Jon Schlinkert.\n * Released under the MIT License.\n */\n\n\n\nvar beautify = __webpack_require__(/*! js-beautify */ \"(rsc)/./node_modules/js-beautify/js/index.js\");\nvar condense = __webpack_require__(/*! condense-newlines */ \"(rsc)/./node_modules/condense-newlines/index.js\");\nvar extend = __webpack_require__(/*! extend-shallow */ \"(rsc)/./node_modules/extend-shallow/index.js\");\nvar defaults = {\n  unformatted: ['code', 'pre', 'em', 'strong', 'span'],\n  indent_inner_html: true,\n  indent_char: ' ',\n  indent_size: 2,\n  sep: '\\n'\n};\n\nmodule.exports = function pretty(str, options) {\n  var opts = extend({}, defaults, options);\n  str = beautify.html(str, opts);\n\n  if (opts.ocd === true) {\n    if (opts.newlines) opts.sep = opts.newlines;\n    return ocd(str, opts);\n  }\n\n  return str;\n};\n\nfunction ocd(str, options) {\n  // Normalize and condense all newlines\n  return condense(str, options)\n    // Remove empty whitespace the top of a file.\n    .replace(/^\\s+/g, '')\n    // Remove extra whitespace from eof\n    .replace(/\\s+$/g, '\\n')\n\n    // Add a space above each comment\n    .replace(/(\\s*<!--)/g, '\\n$1')\n    // Bring closing comments up to the same line as closing tag.\n    .replace(/>(\\s*)(?=<!--\\s*\\/)/g, '> ');\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvcHJldHR5L2luZGV4LmpzIiwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFYTs7QUFFYixlQUFlLG1CQUFPLENBQUMsaUVBQWE7QUFDcEMsZUFBZSxtQkFBTyxDQUFDLDBFQUFtQjtBQUMxQyxhQUFhLG1CQUFPLENBQUMsb0VBQWdCO0FBQ3JDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0Esc0JBQXNCO0FBQ3RCOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZXMiOlsiRDpcXENvZGVzXFxoYWNrYXRob25cXG5vZGVfbW9kdWxlc1xccHJldHR5XFxpbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKiFcbiAqIHByZXR0eSA8aHR0cHM6Ly9naXRodWIuY29tL2pvbnNjaGxpbmtlcnQvcHJldHR5PlxuICpcbiAqIENvcHlyaWdodCAoYykgMjAxMy0yMDE1LCAyMDE3LCBKb24gU2NobGlua2VydC5cbiAqIFJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbnZhciBiZWF1dGlmeSA9IHJlcXVpcmUoJ2pzLWJlYXV0aWZ5Jyk7XG52YXIgY29uZGVuc2UgPSByZXF1aXJlKCdjb25kZW5zZS1uZXdsaW5lcycpO1xudmFyIGV4dGVuZCA9IHJlcXVpcmUoJ2V4dGVuZC1zaGFsbG93Jyk7XG52YXIgZGVmYXVsdHMgPSB7XG4gIHVuZm9ybWF0dGVkOiBbJ2NvZGUnLCAncHJlJywgJ2VtJywgJ3N0cm9uZycsICdzcGFuJ10sXG4gIGluZGVudF9pbm5lcl9odG1sOiB0cnVlLFxuICBpbmRlbnRfY2hhcjogJyAnLFxuICBpbmRlbnRfc2l6ZTogMixcbiAgc2VwOiAnXFxuJ1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBwcmV0dHkoc3RyLCBvcHRpb25zKSB7XG4gIHZhciBvcHRzID0gZXh0ZW5kKHt9LCBkZWZhdWx0cywgb3B0aW9ucyk7XG4gIHN0ciA9IGJlYXV0aWZ5Lmh0bWwoc3RyLCBvcHRzKTtcblxuICBpZiAob3B0cy5vY2QgPT09IHRydWUpIHtcbiAgICBpZiAob3B0cy5uZXdsaW5lcykgb3B0cy5zZXAgPSBvcHRzLm5ld2xpbmVzO1xuICAgIHJldHVybiBvY2Qoc3RyLCBvcHRzKTtcbiAgfVxuXG4gIHJldHVybiBzdHI7XG59O1xuXG5mdW5jdGlvbiBvY2Qoc3RyLCBvcHRpb25zKSB7XG4gIC8vIE5vcm1hbGl6ZSBhbmQgY29uZGVuc2UgYWxsIG5ld2xpbmVzXG4gIHJldHVybiBjb25kZW5zZShzdHIsIG9wdGlvbnMpXG4gICAgLy8gUmVtb3ZlIGVtcHR5IHdoaXRlc3BhY2UgdGhlIHRvcCBvZiBhIGZpbGUuXG4gICAgLnJlcGxhY2UoL15cXHMrL2csICcnKVxuICAgIC8vIFJlbW92ZSBleHRyYSB3aGl0ZXNwYWNlIGZyb20gZW9mXG4gICAgLnJlcGxhY2UoL1xccyskL2csICdcXG4nKVxuXG4gICAgLy8gQWRkIGEgc3BhY2UgYWJvdmUgZWFjaCBjb21tZW50XG4gICAgLnJlcGxhY2UoLyhcXHMqPCEtLSkvZywgJ1xcbiQxJylcbiAgICAvLyBCcmluZyBjbG9zaW5nIGNvbW1lbnRzIHVwIHRvIHRoZSBzYW1lIGxpbmUgYXMgY2xvc2luZyB0YWcuXG4gICAgLnJlcGxhY2UoLz4oXFxzKikoPz08IS0tXFxzKlxcLykvZywgJz4gJyk7XG59XG4iXSwibmFtZXMiOltdLCJpZ25vcmVMaXN0IjpbMF0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/pretty/index.js\n");

/***/ })

};
;