/// <reference types="react" />
import { RowsProps } from "../rowContainer";
import { VirtualItem } from "@tanstack/react-virtual";
interface RowProps<T> extends React.HTMLAttributes<HTMLTableRowElement>, Pick<RowsProps<T>, "rowKey" | "rowData"> {
    children?: React.ReactNode;
    isExpanded?: boolean;
    isChecked: boolean;
    isSelected: boolean;
    isOnCheckedRowsAvailable: boolean;
    rowIndex: number;
    virtualItem: VirtualItem;
}
declare const Row: <T extends Record<string, unknown>>({ isChecked, isOnCheckedRowsAvailable, isSelected, rowKey, rowIndex, rowData, virtualItem, ...rest }: RowProps<T>) => import("react/jsx-dev-runtime").JSX.Element;
export { Row };
