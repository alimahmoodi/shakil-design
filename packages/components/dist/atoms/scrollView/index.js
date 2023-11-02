"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScrollView = void 0;
var jsx_dev_runtime_1 = require("react/jsx-dev-runtime");
var _jsxFileName = "D:/project/shakil-design-release/packages/components/src/atoms/scrollView/index.tsx";
var react_1 = __importDefault(require("react"));
var style_1 = require("./style");
var classnames_1 = __importDefault(require("classnames"));
var ScrollView = react_1.default.forwardRef(function (_a, ref) {
    var children = _a.children, className = _a.className, style = _a.style;
    var classes = (0, style_1.useStyles)();
    return ((0, jsx_dev_runtime_1.jsxDEV)("div", __assign({ ref: ref, style: __assign({}, style), className: (0, classnames_1.default)(className, classes.container) }, { children: children }), void 0, false, { fileName: _jsxFileName, lineNumber: 14, columnNumber: 13 }, _this));
});
exports.ScrollView = ScrollView;
ScrollView.displayName = "ScrollView";
//# sourceMappingURL=index.js.map