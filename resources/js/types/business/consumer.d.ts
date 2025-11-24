export interface Consumer {
    id: number;
    name: string;
    type: string;
    created_at: string;
    updated_at: string;
}

export interface PaginatedConsumer {
    data: Consumer[];
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
}
