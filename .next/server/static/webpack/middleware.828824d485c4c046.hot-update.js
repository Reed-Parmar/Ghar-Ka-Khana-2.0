"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
self["webpackHotUpdate_N_E"]("middleware",{

/***/ "(middleware)/./middleware.ts":
/*!***********************!*\
  !*** ./middleware.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   config: () => (/* binding */ config),\n/* harmony export */   middleware: () => (/* binding */ middleware)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(middleware)/./node_modules/next/dist/esm/api/server.js\");\n\n// No-op middleware: we removed NextAuth. Let the backend handle auth.\n// If you need route protection, implement it client-side or switch to\n// HttpOnly cookie auth and validate here.\nasync function middleware(_req) {\n    return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.next();\n}\nconst config = {\n    matcher: [\n        \"/((?!_next/static|_next/image|favicon.ico|public/).*)\"\n    ]\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKG1pZGRsZXdhcmUpLy4vbWlkZGxld2FyZS50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7QUFBd0Q7QUFFeEQsc0VBQXNFO0FBQ3RFLHNFQUFzRTtBQUN0RSwwQ0FBMEM7QUFDbkMsZUFBZUMsV0FBV0MsSUFBaUI7SUFDaEQsT0FBT0YscURBQVlBLENBQUNHLElBQUk7QUFDMUI7QUFFTyxNQUFNQyxTQUFTO0lBQ3BCQyxTQUFTO1FBQUM7S0FBd0Q7QUFDcEUsRUFBRSIsInNvdXJjZXMiOlsid2VicGFjazovL19OX0UvLi9taWRkbGV3YXJlLnRzPzQyMmQiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmV4dFJlcXVlc3QsIE5leHRSZXNwb25zZSB9IGZyb20gJ25leHQvc2VydmVyJztcblxuLy8gTm8tb3AgbWlkZGxld2FyZTogd2UgcmVtb3ZlZCBOZXh0QXV0aC4gTGV0IHRoZSBiYWNrZW5kIGhhbmRsZSBhdXRoLlxuLy8gSWYgeW91IG5lZWQgcm91dGUgcHJvdGVjdGlvbiwgaW1wbGVtZW50IGl0IGNsaWVudC1zaWRlIG9yIHN3aXRjaCB0b1xuLy8gSHR0cE9ubHkgY29va2llIGF1dGggYW5kIHZhbGlkYXRlIGhlcmUuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gbWlkZGxld2FyZShfcmVxOiBOZXh0UmVxdWVzdCkge1xuICByZXR1cm4gTmV4dFJlc3BvbnNlLm5leHQoKTtcbn1cblxuZXhwb3J0IGNvbnN0IGNvbmZpZyA9IHtcbiAgbWF0Y2hlcjogWycvKCg/IV9uZXh0L3N0YXRpY3xfbmV4dC9pbWFnZXxmYXZpY29uLmljb3xwdWJsaWMvKS4qKSddLFxufTsiXSwibmFtZXMiOlsiTmV4dFJlc3BvbnNlIiwibWlkZGxld2FyZSIsIl9yZXEiLCJuZXh0IiwiY29uZmlnIiwibWF0Y2hlciJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(middleware)/./middleware.ts\n");

/***/ })

});