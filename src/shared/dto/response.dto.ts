export class ResponseDto<T> {
    message: string;
    response: T;
    meta?: PaginationMetaData;
}

class PaginationMetaData {
    current_page: number;
    total_pages: number;
    per_page: number;
    total_items: number;
}