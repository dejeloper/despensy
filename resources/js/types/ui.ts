import {ReactNode} from 'react';

export type Column<T> = {
	key: keyof T | string;
	label: string;
	render?: (item: T) => ReactNode;
	className?: string;
};

export type Action<T> = {
	label: string;
	icon: ReactNode;
	variant?: 'default' | 'ghost' | 'destructive';
	onClick: (item: T) => void;
};

export type DataTableProps<T> = {
	data: T[];
	columns: Column<T>[];
	actions?: Action<T>[];
	emptyMessage?: string;
};

export type DataCardsProps<T> = DataTableProps<T>;