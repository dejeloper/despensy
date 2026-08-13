export type UnitEquivalence = {
    id: number;
    unit_id: number;
    unit_name?: string;
    parent_unit_id: number;
    parent_unit_name?: string;
    factor: number;
};

export type ProductContainer = {
    id: number;
    product_id: number;
    product_name?: string;
    place_id: number | null;
    place_name?: string | null;
    container_unit_id: number;
    container_unit_name?: string;
    content_quantity: number;
    content_unit_id: number;
    content_unit_name?: string;
};

export type EquivalenceOption = {
    id: number;
    name: string;
    short_name?: string;
};
