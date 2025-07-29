export interface Book {
    id: number | string;
    title: string;
    author: string;
    year: number;
    genre: string;
    coverUrl: string;
    external?: boolean;
}
