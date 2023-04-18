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
    deleted_at?: Date;
    created_at?: Date;
    updated_at?: Date;
    from: LocationDTO;
    destination: LocationDTO;
    time_ago: string;
};

type PaginatedUnsafeResource<T> = {
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
};

type Paginated<T> = {
    current_page: number;
    data: T[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: LinksSummaryDTO;
    meta: LinkMetaDTO;
    next_page_url: string;
    path: string;
    per_page: number;
    prev_page_url?: any;
    to: number;
    total: number;
};

type LinkDTO = {
    url?: string;
    label: string;
    active: boolean;
};

type LinksSummaryDTO = {
    first: string;
    last: string;
    prev?: string;
    next?: string;
};

type LinkMetaDTO = {
    current_page: number;
    from: number;
    last_page: number;
    links: LinkDTO[];
    path: string;
    per_page: number;
    to: number;
    total: number;
};

interface UserDTO {
    id: number;
    name: string;
    email: string;
    email_verified_at?: Date;
    avatar: string;
    created_at: Date;
    created_at_diff: string;
}

interface FeedbackDTO {
    id: number;
    name: string;
    email: string;
    message: string;
    created_at: Date;
    updated_at?: Date;
    deleted_at?: Date;
    created_at_diff: string;
}

type Errors = Record<string, string>;

type Auth = {
    user: UserDTO;
};

type Flash = {
    message?: string;
    error?: string;
    success?: string;
};

type CommonPageProps = {
    auth: Auth;
    errors: Errors;
    flash: Flash;
};
