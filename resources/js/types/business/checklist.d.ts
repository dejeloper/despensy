import {Product} from './product';

export interface Checklist {
	id: number;
	user_id: number;
	status: 'ACTIVE' | 'COMPLETED';
	created_at: string;
	updated_at: string;
	details?: ChecklistDetail[];
}

export interface ChecklistDetail {
	id: number;
	checklist_id: number;
	product_id: number;
	reported_stock: number | null;
	quantity_planned: number | null;
	quantity_bought: number | null;
	price_paid: number | null;
	place_id: number | null;
	is_processed: boolean;
	created_at: string;
	updated_at: string;
	product?: Product;
}

export interface PaginatedChecklist {
	data: Checklist[];
	links: {
		url: string | null;
		label: string;
		active: boolean;
	}[];
}
