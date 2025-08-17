export interface Category {
	id: number;
	name: string;
	icon: string;
	bg_color: string;
	text_color: string;
	enabled: boolean;
	created_at?: string;
	updated_at?: string;
}

export type PaginatedCategories = {
	data: Category[];
	current_page: number;
	last_page: number;
	per_page: number;
	total: number;
	links: {url: string | null; label: string; active: boolean}[];
};