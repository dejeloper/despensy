import { Category } from './category';

export type Product = {
    id: number;
    name: string;
    description: string | null;
    image: string | null;
    category_id: number;
    category?: Category;
    enabled: boolean;
    // Derivados de la última compra (ChecklistItem), no columnas propias del producto
    last_price?: number;
    last_place_name?: string;
    last_place_bg_color?: string;
    last_place_text_color?: string;
    last_unit_name?: string;
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
