import {Category} from "./category";
import {Place} from "./place";
import {Unit} from "./unit";

export type Product = {
	id?: number;
	name?: string;
	description?: string;
	image?: string;
	category_id?: number;
	category?: Category | null;
	place_id?: number;
	place?: Place | null;
	unit_id?: number;
	unit?: Unit | null;
	enabled?: boolean;
	price?: number;
	stock?: number;
}

export type PaginatedProduct = {
	data: Product[];
	current_page: number;
	last_page: number;
	per_page: number;
	total: number;
	links: {url: string | null; label: string; active: boolean}[];
};