export interface Thumbs {
  [index: number]: string;
}

export interface MediumWallPaginationItem {
  tinyThumbnail: string | null;
  id: number;
  aspectRatio: string | null;
  hash: string;
  thumbs: Thumbs;
}

export interface MediumWallPagination {
  items: MediumWallPaginationItem[];
  pageCount: number;
  pageNumber: number;
  pageSize: number;
}
