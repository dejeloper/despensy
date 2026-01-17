import { Category } from './category';
import { Place } from './place';
import { Unit } from './unit';

export type Product = {
    id: number;
    name: string;
    description: string | null;
    image: string | null;
    category_id: number;
    category?: Category;
    place_id?: number;
    place?: Place;
    unit_id?: number;
    unit?: Unit;
    enabled: boolean;
    price?: number;
    stock?: number;
    // Nuevos campos del último purchase
    last_price?: number;
    last_place_name?: string;
    last_place_id?: number;
    last_unit_name?: string;
    last_unit_id?: number;
    last_purchase_date?: string;
    created_at?: string;
    updated_at?: string;
};

export type PaginatedProduct = {
    data: Product[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
};
