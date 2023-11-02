define(["require", "exports", "react-jss", "../../../../theme"], function (require, exports, react_jss_1, theme_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.useStyle = void 0;
    const useStyle = (0, react_jss_1.createUseStyles)({
        month: {
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 10,
        },
        nextMonth: {
            // transform: "rotateZ(90deg)",
            position: "absolute",
            right: 0,
            // left: 14,
            cursor: "pointer",
            top: 20,
        },
        prevMonth: {
            // transform: "rotateZ(-90deg)",
            position: "absolute",
            // right: 14,
            left: 0,
            top: 20,
            cursor: "pointer",
        },
    }, { theming: theme_1.theming, name: "datepicker-header" });
    exports.useStyle = useStyle;
});
//# sourceMappingURL=style.js.map