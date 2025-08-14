export type PaginationMeta = {
  totalRecords: number;
  itemsPerPage: number;
  currentPage: number;
  nextPage: number | null;
  prevPage: number | null;
  totalPages: number;
};

export type PaginationResponse<T> = {
  data: Array<T>;
  metaInfo: PaginationMeta;
};
