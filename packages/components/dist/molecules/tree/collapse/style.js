define(["require", "exports", "react-jss", "../../../theme"], function (require, exports, react_jss_1, theme_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.useStyles = void 0;
    exports.useStyles = (0, react_jss_1.createUseStyles)((theme) => {
        var _a;
        return {
            dots: {
                position: "absolute",
                top: 0,
                left: 11,
                width: 0,
                borderLeft: `2px dotted ${(_a = theme.tree) === null || _a === void 0 ? void 0 : _a.dotLine}`,
            },
            "animation-wrapper": {
                position: "relative",
                overflow: "hidden",
                height: 0,
            },
        };
    }, { theming: theme_1.theming, name: "tree-collapse" });
});
//# sourceMappingURL=style.js.map