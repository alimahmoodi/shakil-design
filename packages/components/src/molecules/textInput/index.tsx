import classNames from "classnames";
import * as React from "react";
import { composeRef } from "reactjs-view-core";
import { useStyles } from "./style";
import TextInputState from "./TextInputState";
import { TextInputProps } from "./types";
import { useFonts } from "../../atoms/text/style";
import { BaseIcon, Spinner, Text } from "../../atoms";
import { useState } from "react";
import { theming } from "../../theme";
const { useTheme } = theming;

/**
 * Determines whether a 'selection' prop differs from a node's existing
 * selection state.
 */
const isSelectionStale = (
  node: { selectionEnd: any; selectionStart: any },
  selection: { start: any; end?: any },
) => {
  const { selectionEnd, selectionStart } = node;
  const { start, end } = selection;
  return start !== selectionStart || end !== selectionEnd;
};

/**
 * Certain input types do no support 'selectSelectionRange' and will throw an
 * error.
 */
const setSelection = (node: any, selection: { start: any; end?: any }) => {
  if (isSelectionStale(node, selection)) {
    const { start, end } = selection;
    try {
      node.setSelectionRange(start, end || start);
    } catch (e) {}
  }
};

// If an Input Method Editor is processing key input, the 'keyCode' is 229.
// https://www.w3.org/TR/uievents/#determine-keydown-keyup-keyCode
function isEventComposing(nativeEvent: any) {
  return nativeEvent.isComposing || nativeEvent.keyCode === 229;
}

type TextInputSupportedProps =
  | React.TextareaHTMLAttributes<HTMLTextAreaElement>
  | React.InputHTMLAttributes<HTMLInputElement>;

type SupportedProps = Omit<TextInputSupportedProps, "value"> & {
  value?: string | number | null;
};

const TextInput = React.forwardRef<HTMLElement, TextInputProps>(
  (
    {
      autoCapitalize = "sentences",
      autoComplete,
      autoCompleteType,
      autoCorrect = true,
      blurOnSubmit,
      clearTextOnFocus,
      editable = true,
      keyboardType = "default",
      multiline = false,
      numberOfLines = 1,
      onBlur,
      onChange,
      onChangeText,
      onContentSizeChange,
      onFocus,
      onKeyPress,
      onSelectionChange,
      onSubmitEditing,
      returnKeyType,
      secureTextEntry = false,
      selection,
      selectTextOnFocus,
      spellCheck,
      className,
      testID,
      disabled,
      theme,
      AddonAfter,
      addonBefore,
      addonAfterClassName,
      addonBeforeClassName,
      addonAfterStyle,
      addonBeforeStyle,
      value,
      onClear,
      wrapperStyle,
      allowClear,
      wrapperClassName,
      errorMessage,
      errorMessageClassName,
      hasError,
      clearIconColor,
      isLoading,
      ...rest
    },
    forwardedRef,
  ) => {
    const classes = useStyles();
    const Colors = useTheme();
    let type: React.InputHTMLAttributes<HTMLInputElement>["type"];
    let inputMode: React.HTMLAttributes<HTMLInputElement>["inputMode"];

    switch (keyboardType) {
      case "email-address":
        type = "email";
        break;
      case "number-pad":
      case "numeric":
        inputMode = "numeric";
        type = "number";
        break;
      case "decimal-pad":
        inputMode = "decimal";
        break;
      case "phone-pad":
        type = "tel";
        break;
      case "search":
      case "web-search":
        type = "search";
        break;
      case "url":
        type = "url";
        break;
      default:
        type = "text";
    }

    if (secureTextEntry) {
      type = "password";
    }

    const dimensions = React.useRef({ height: 0, width: 0 });
    const hostRef = React.useRef(null);

    const handleContentSizeChange = React.useCallback(
      (hostNode: EventTarget & (HTMLInputElement | HTMLTextAreaElement)) => {
        if (multiline && onContentSizeChange && hostNode != null) {
          const newHeight = hostNode.scrollHeight;
          const newWidth = hostNode.scrollWidth;
          if (
            newHeight !== dimensions.current.height ||
            newWidth !== dimensions.current.width
          ) {
            dimensions.current.height = newHeight;
            dimensions.current.width = newWidth;
            onContentSizeChange({
              nativeEvent: {
                contentSize: {
                  height: dimensions.current.height,
                  width: dimensions.current.width,
                },
              },
            });
          }
        }
      },
      [multiline, onContentSizeChange],
    );

    const imperativeRef = React.useMemo(
      () => (hostNode: any) => {
        // TextInput needs to add more methods to the hostNode in addition to those
        // added by `usePlatformMethods`. This is temporarily until an API like
        // `TextInput.clear(hostRef)` is added to React Native.
        if (hostNode != null) {
          hostNode.clear = function () {
            if (hostNode != null) {
              hostNode.value = "";
            }
          };
          hostNode.isFocused = function () {
            return (
              hostNode != null &&
              TextInputState.currentlyFocusedField() === hostNode
            );
          };
          handleContentSizeChange(hostNode);
        }
      },
      [handleContentSizeChange],
    );

    function handleBlur(e: React.FocusEvent<HTMLInputElement>) {
      TextInputState._currentlyFocusedNode = null;
      if (onBlur) {
        //@ts-ignore
        e.nativeEvent.text = e.target.value;
        onBlur(e);
      }
    }

    function handleChange(
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) {
      const hostNode = e.target;
      const text = hostNode.value;
      //@ts-ignore
      e.nativeEvent.text = text;
      handleContentSizeChange(hostNode);
      if (onChange) {
        onChange(e);
      }
      if (onChangeText) {
        onChangeText(text);
      }
    }

    function handleFocus(e: React.FocusEvent<HTMLInputElement>) {
      const hostNode = e.target;
      if (onFocus) {
        //@ts-ignore
        e.nativeEvent.text = hostNode.value;
        onFocus(e);
      }
      if (hostNode != null) {
        TextInputState._currentlyFocusedNode = hostNode;
        if (clearTextOnFocus) {
          hostNode.value = "";
        }
        if (selectTextOnFocus) {
          // Safari requires selection to occur in a setTimeout
          setTimeout(() => {
            hostNode.select();
          }, 0);
        }
      }
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
      const hostNode = e.target;
      // Prevent key events bubbling (see #612)
      e.stopPropagation();

      const isBlurOnSubmitDefault = !multiline;
      const shouldBlurOnSubmit =
        blurOnSubmit == null ? isBlurOnSubmitDefault : blurOnSubmit;

      const nativeEvent = e.nativeEvent;
      const isComposing = isEventComposing(nativeEvent);

      if (onKeyPress) {
        onKeyPress(e);
      }

      if (
        e.key === "Enter" &&
        !e.shiftKey &&
        // Do not call submit if composition is occuring.
        !isComposing &&
        !e.isDefaultPrevented()
      ) {
        if ((blurOnSubmit || !multiline) && onSubmitEditing) {
          // prevent "Enter" from inserting a newline or submitting a form
          e.preventDefault();
          //@ts-ignore
          nativeEvent.text = e.target.value;
          onSubmitEditing(e);
        }
        if (shouldBlurOnSubmit && hostNode != null) {
          //@ts-ignore
          hostNode.blur();
        }
      }
    }

    const handleSelectionChange = (
      e: React.SyntheticEvent<HTMLInputElement, Event>,
    ) => {
      if (onSelectionChange) {
        try {
          const _e = e as Omit<
            React.SyntheticEvent<HTMLInputElement, Event>,
            "nativeEvent" | "target"
          > & {
            nativeEvent: Event & {
              selection: { start: number; end: number };
              text: string;
            };
            target: EventTarget & {
              selectionStart: number;
              selectionEnd: number;
              value: string;
            };
          };
          const node = _e.target as EventTarget & {
            selectionStart: number;
            selectionEnd: number;
            value: string;
          };

          const { selectionStart, selectionEnd } = node;

          const nativeEvent = _e.nativeEvent as Event & {
            selection: { start: number; end: number };
            text: string;
          };

          nativeEvent.selection = {
            start: selectionStart,
            end: selectionEnd,
          };

          nativeEvent.text = node.value;
          onSelectionChange(_e);
        } catch (_e) {}
      }
    };

    React.useEffect(() => {
      const node = hostRef.current;
      if (node && selection) {
        setSelection(node, selection);
      }
      if (document.activeElement === node) {
        TextInputState._currentlyFocusedNode = node;
      }
    }, [hostRef, selection]);

    const supportedProps: SupportedProps = rest;

    supportedProps.value;

    supportedProps.autoCapitalize = autoCapitalize;
    supportedProps.autoComplete = autoComplete || autoCompleteType || "on";
    supportedProps.autoCorrect = autoCorrect ? "on" : "off";

    (supportedProps as any).enterKeyHint = returnKeyType;
    supportedProps.onBlur = handleBlur;
    supportedProps.onChange = handleChange;
    supportedProps.onFocus = handleFocus;
    supportedProps.onKeyDown = handleKeyDown;
    supportedProps.onSelect = handleSelectionChange;
    supportedProps.readOnly = !editable;
    // @ts-ignore
    supportedProps.rows = multiline ? numberOfLines : undefined;
    supportedProps.spellCheck = spellCheck != null ? spellCheck : autoCorrect;
    (supportedProps as React.InputHTMLAttributes<HTMLInputElement>).type = (
      multiline ? undefined : type
    ) as string;
    supportedProps.inputMode = inputMode;

    const setRef = composeRef(hostRef, imperativeRef, forwardedRef);

    const themes = useFonts();
    const _value = value === null || value === undefined ? "" : value;
    const clearIcon = allowClear ? (
      <BaseIcon
        wrapperClassName={classes["clear-icon"]}
        onClick={onClear}
        name="Every-Boxes-_-Cross-Icon"
        size={{ height: 12, width: 12 }}
        color={clearIconColor}
      />
    ) : null;

    const addOnAfterIcon = isLoading ? (
      <Spinner size="small" />
    ) : _value && allowClear && !disabled ? (
      clearIcon
    ) : AddonAfter ? (
      AddonAfter
    ) : null;

    return multiline ? (
      <textarea
        className={classNames(
          classes["text-area"],
          disabled && classes.disabled,
          (hasError || errorMessage) && classes["input-with-error"],
          themes[theme || "Regular"],
          className,
        )}
        ref={setRef}
        value={_value}
        {...(supportedProps as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
      />
    ) : (
      <div
        className={classNames(
          classes["inputWrapper"],
          wrapperClassName && wrapperClassName,
        )}
        style={wrapperStyle}
      >
        <input
          {...(supportedProps as React.InputHTMLAttributes<HTMLInputElement>)}
          value={_value}
          className={classNames(
            classes["textInput"],
            (hasError || errorMessage) && classes["input-with-error"],
            addOnAfterIcon && `${classes["textInput"]}--input-with-addon-after`,
            addonBefore && `${classes["textInput"]}--input-with-addon-before`,
            (disabled || isLoading) && classes.disabled,
            themes[theme || "Regular"],
            className,
          )}
          ref={setRef}
          type={rest.type}
          disabled={disabled || isLoading}
          //@ts-ignore
          data-testid={supportedProps["data-testid"] || testID}
          style={{
            ...supportedProps.style,
          }}
        />
        {errorMessage ? (
          <Text
            className={classNames(
              classes["error-message"],
              errorMessageClassName,
            )}
            color={Colors.textInput?.errorMessage}
            size={13}
          >
            {errorMessage}
          </Text>
        ) : null}
        {addonBefore ? (
          <div
            className={classNames(
              classes["addonBefore"],
              addonBeforeClassName && addonBeforeClassName,
            )}
            style={addonBeforeStyle}
          >
            {addonBefore}
          </div>
        ) : null}

        {addOnAfterIcon ? (
          <div
            className={classNames(
              classes["addonAfter"],
              addonAfterClassName && addonAfterClassName,
            )}
          >
            {addOnAfterIcon}
          </div>
        ) : null}
      </div>
    );
  },
);

TextInput.displayName = "TextInput";

export type { TextInputProps };
export { TextInput };
