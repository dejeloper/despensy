export type Unit = {
	id: number;
	name: string;
	short_name: string;
	enabled?: boolean;
}

export type PaginatedUnits = {
	data: Unit[];
	current_page: number;
	last_page: number;
	per_page: number;
	total: number;
	links: {url: string | null; label: string; active: boolean}[];
}