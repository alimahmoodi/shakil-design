import classNames from "classnames";
import { ReactNode, useEffect, useState } from "react";
import { Text } from "../../atoms/text";
import { useHorizontalScroll } from "@shakil-design/utils/src";
import { InternalTabPane } from "./internalTabPane";
import { useStyles } from "./style";
import { useTheme } from "../../theme";
export interface TabItem {
  id: string;
  content: React.ReactNode;
  renderTitle?:
    | React.ReactNode
    | (({ id, isActive }: { id: string; isActive: boolean }) => ReactNode);
  closeable?: boolean;
}
export interface TabsProps {
  activeTab?: string;
  onChange?: (id: string) => void;
  onClose?: (id: string) => void;
  className?: string;
  TabsTitle?: string | React.ReactNode;
  noContent?: React.ReactNode;
  items: TabItem[];
}

const Tabs = ({
  activeTab: activeTabProp,
  onChange,
  onClose,
  className,
  TabsTitle,
  noContent,
  items,
}: TabsProps) => {
  const classes = useStyles();
  const { tab: { textColor } = {} } = useTheme();
  const [activeTabState, setActiveTabState] = useState<string | null>(null);
  const [openedTabs, setOpenedTabs] = useState<string[]>([]);
  const tabListRef = useHorizontalScroll();

  const handleOnChange = (id: string) => {
    onChange?.(id);
    if (activeTabProp) return;
    setActiveTabState(id);
  };

  const handleOnClose = (id: string) => {
    onClose?.(id);
  };

  let _activeTab: string | null = null;
  if (activeTabProp) {
    _activeTab = activeTabProp;
  } else {
    _activeTab = activeTabState;
  }

  useEffect(() => {
    if (activeTabProp) return;
    if (items?.length > 0) {
      setActiveTabState(items[0].id);
      setOpenedTabs(() => {
        return [items[0].id];
      });
    }
  }, [activeTabProp, items]);

  useEffect(() => {
    if (activeTabProp) {
      setOpenedTabs((prev) => {
        const alreadyExist = prev.find((item) => item === activeTabProp);
        if (alreadyExist) return prev;
        return [...prev, activeTabProp];
      });
    }
  }, [activeTabProp]);

  return (
    <div className={classNames(classes["tabs"], className)}>
      <div className={classes["tabs-nav-wrap"]}>
        {TabsTitle ? (
          <>
            {typeof TabsTitle === "string" ? (
              <div className={classes["tabsTitle"]}>
                <Text theme="Regular" size={20} color={textColor}>
                  {TabsTitle}
                </Text>
              </div>
            ) : typeof TabsTitle === "object" ? (
              TabsTitle
            ) : null}
          </>
        ) : null}

        <div ref={tabListRef} className={classes["tabs-nav-list"]}>
          {items?.map(({ id, renderTitle, closeable }) => {
            const isActive = id === _activeTab;
            return (
              <InternalTabPane
                renderTitle={renderTitle}
                isActive={isActive}
                onClick={handleOnChange}
                key={id}
                id={id}
                onClose={handleOnClose}
                closeable={Boolean(closeable)}
              />
            );
          })}
        </div>
      </div>

      <div className={classes["tabs-content-holder"]}>
        {noContent ? (
          <div className={classes["no-content"]}>{noContent}</div>
        ) : (
          openedTabs.map((_id) => {
            const tab = items?.find(({ id }) => id === _id);
            return (
              <div
                className={classNames(
                  classes["tab-content"],
                  tab?.id === _activeTab
                    ? `${classes["tab-content"]}--active`
                    : `${classes["tab-content"]}--not-active`,
                )}
                key={_id}
              >
                {tab?.content}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export { Tabs };
