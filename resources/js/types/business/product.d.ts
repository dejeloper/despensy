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
    // Estado en la checklist activa, presente solo en la vista Despensa
    active_checklist_item_id?: number;
    active_quantity_planned?: number;
    active_unit_id_planned?: number;
    active_quantity_at_home?: number;
    active_unit_id_at_home?: number;
    active_was_bought?: boolean | null;
    active_quantity_bought?: number;
    active_unit_id_bought?: number;
    active_place_id?: number;
    active_unit_price?: number;
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
