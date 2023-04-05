type MetaDTO = Record<string, string>;

type LocationDTO = {
    id?: number;
    name: string;
    lng: number;
    lat: number;
    landmark?: string;
    address?: string;
    meta?: MetaDTO;
    user_id?: string;
    deleted_at?: string;
    created_at?: string;
    updated_at?: string;
};

type JourneyDTO = {
    uuid: string;
    expected_start_time: string;
    expected_end_time?: string;
    start_time?: string;
    end_time?: string;
    meta?: MetaDTO;
    user_id?: string;
    deleted_at?: string;
    created_at?: string;
    updated_at?: string;
    from: LocationDTO;
    destination: LocationDTO;
    time_ago: string;
};

interface Paginated<T> {
    current_page: number;
    data: T[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: LinkDTO[];
    next_page_url: string;
    path: string;
    per_page: number;
    prev_page_url?: any;
    to: number;
    total: number;
}

interface LinkDTO {
    url?: string;
    label: string;
    active: boolean;
}
