import { createUseStyles } from "react-jss";
import { theming } from "../../theme";
export var useStyles = createUseStyles({
    arrowDown: {
        position: "absolute",
        insetInlineStart: 10,
        top: "50%",
        transform: "translateY(-50%)",
        cursor: "pointer",
    },
    arrowUp: {
        position: "absolute",
        insetInlineEnd: 10,
        top: "50%",
        transform: "translateY(-50%)",
        cursor: "pointer",
    },
    input: {
        "&::-webkit-outer-spin-button , &::-webkit-inner-spin-button": {
            appearance: "none",
        },
        "&[type=number]": {
            "-moz-appearance": "textfield",
        },
    },
}, { theming: theming, name: "number-input" });
//# sourceMappingURL=style.js.map