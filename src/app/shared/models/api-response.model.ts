export interface ApiResponse<T> {
    message: string;
    status: boolean;
    data: T;
}
export interface EmptyApiResponse {
    message: string;
    status: boolean;
}