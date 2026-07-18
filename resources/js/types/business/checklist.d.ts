import { Place } from './place';
import { Product } from './product';
import { State } from './state';
import { Unit } from './unit';

export type ChecklistItem = {
    id: number;
    product?: Product;
    quantity_planned: number | null;
    unit_planned?: Unit;
    was_bought: boolean;
    quantity_bought: number | null;
    unit_bought?: Unit;
    place?: Place;
    unit_price: number | null;
    total_price: number | null;
    purchase_date: string | null;
    created_at?: string;
};

export type Checklist = {
    id: number;
    name: string | null;
    state?: State;
    items?: ChecklistItem[];
    items_count?: number;
    user?: { id: number; name: string };
    created_at?: string;
    updated_at?: string;
};

export type PaginatedChecklist = {
    data: Checklist[];
    current_page: number;
    per_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
};
