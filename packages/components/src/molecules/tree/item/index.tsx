import classNames from "classnames";
import { Spinner, Text } from "../../../atoms";
import { BaseIcon } from "../../../atoms/baseIcon";
import React from "react";
import { useTheme } from "../../../theme";
import { useStyle } from "./style";
import { ItemProps, TreeBasicType } from "../types";

const Item = <T extends TreeBasicType<T>>(
  {
    title,
    onClick,
    arrowDirection,
    level,
    isActive,
    fontSize = 16,
    isLoading,
    data,
  }: ItemProps<T>,
  ref: React.Ref<HTMLDivElement>,
) => {
  const { tree: { activeItem } = {} } = useTheme();
  const classes = useStyle();

  return (
    <div
      ref={ref}
      onClick={() => onClick?.()}
      style={{
        cursor: "pointer",
        backgroundColor: data?.renderBackgroundColor
          ? data.renderBackgroundColor({ data, level })
          : isActive
          ? activeItem
          : "#f0f0f0",
      }}
      className={classNames(
        classes["wrapper"],
        level && level > 1 && classes["dotLine"],
      )}
    >
      <div
        className={classes["statusLine"]}
        style={{
          backgroundColor: data.renderStatusColor
            ? data.renderStatusColor({ data, level })
            : "#ababab",
        }}
      />
      <div style={{ display: "flex", alignItems: "center", flex: 1 }}>
        <div className={classes["content"]}>
          {typeof data.renderItemContent === "function" ? (
            data.renderItemContent({ data, level })
          ) : (
            <div
              style={{
                marginInlineStart: 24,
                display: "flex",
                alignItems: "center",
                height: "100%",
              }}
            >
              {typeof data.renderTitle === "function" ? (
                data.renderTitle({ data, level })
              ) : (
                <Text theme="Regular" size={fontSize} color={"#575757"}>
                  {title}
                </Text>
              )}
            </div>
          )}
        </div>
        <div className={classes["spinnerWrapper"]}>
          {isLoading ? <Spinner size="small" spinerColor={"white"} /> : null}
          {!isLoading && arrowDirection !== undefined ? (
            <BaseIcon
              wrapperClassName={classNames(
                classes["arrowDown"],
                arrowDirection === "up" && classes["arrowUp"],
              )}
              name={"Amount-Boxes_Decrease"}
              size={{ height: 6, width: 12 }}
              wrapperStyle={{ marginInlineStart: "auto" }}
              color={"#575757"}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
};

// Cast the output
const RefWrapper = React.forwardRef(Item) as <T extends TreeBasicType<T>>(
  p: ItemProps<T> & { ref?: React.Ref<HTMLDivElement> },
) => React.ReactElement;

export { RefWrapper as Item };
