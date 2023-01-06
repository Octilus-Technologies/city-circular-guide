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
};
