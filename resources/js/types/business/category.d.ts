export type Category = {
	id?: number;
	name: string;
	icon: string;
	bg_color?: string | null;
	text_color?: string | null;
	enabled?: boolean;
};

export type PaginatedCategories = {
	data: Category[];
	current_page: number;
	last_page: number;
	per_page: number;
	total: number;
	links: {url: string | null; label: string; active: boolean}[];
};
