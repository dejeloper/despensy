import {ReactNode} from 'react';

export type Column<T> = {
	key: keyof T | string;
	label: string;
	render?: (item: T) => ReactNode;
	className?: string;
};

export type Action<T> = {
	title: string;
	label?: string;
	icon: ReactNode;
	variant?: 'default' | 'ghost' | 'destructive';
	onClick: (item: T) => void;
	className?: string;
	style?: React.CSSProperties;
};

export type DataTableProps<T> = {
	data: T[];
	columns: Column<T>[];
	actions?: Action<T>[];
	emptyMessage?: string;
	isLoading?: boolean;
};

export type DataCardsProps<T> = DataTableProps<T>;