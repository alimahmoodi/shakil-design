import { useEffect, useState } from "react";
import { SelectProps } from "../../types";
import { SingleSelectList } from "../list/singleSelectList";
import { Template } from "../selectTemplate";

export interface SingleSelectProps<T extends Record<string, any>>
  extends SelectProps<T> {
  value?: T[keyof T];
  onChange?: (item: T | null) => void;
  mode?: "single";
}

const SingleSelect = <T extends Record<string, any>>({
  valueExtractor = (item) => item.value,
  labelExtractor = (item) => item.label,
  data,
  value,
  onChange,
  onClear,
  ...props
}: SingleSelectProps<T>) => {
  const [internalValue, setInternalValue] = useState<T[keyof T] | undefined>(
    undefined,
  );

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const handleOnChange = (selectedItemValue: T[keyof T]) => {
    !value && setInternalValue(selectedItemValue);
    onChange?.(selectedItemValue);
  };

  const _value = data.find((item) => valueExtractor?.(item) === internalValue);
  const displayValue = _value ? labelExtractor?.(_value) : "";

  const handleOnClear = () => {
    onClear?.();
    onChange?.(null);
  };

  return (
    <Template
      {...props}
      displayValue={displayValue || ""}
      data={data}
      onClear={handleOnClear}
      renderOverlay={({ onClose }) => {
        return (
          <SingleSelectList
            data={data}
            labelExtractor={labelExtractor}
            valueExtractor={valueExtractor}
            internalValue={internalValue}
            onClick={(value) => {
              handleOnChange(value);
              onClose();
            }}
          />
        );
      }}
    />
  );
};

export { SingleSelect };
