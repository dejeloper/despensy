export type Place = {
	id?: number;
	name: string;
	short_name?: string;
	address?: string | null;
	bg_color?: string | null;
	text_color?: string | null;
	note?: string | null;
	enabled?: boolean;
};

export type PaginatedPlaces = {
	data: Place[];
	current_page: number;
	last_page: number;
	per_page: number;
	total: number;
	links: {url: string | null; label: string; active: boolean}[];
};
