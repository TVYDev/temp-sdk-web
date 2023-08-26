interface ICommonApiResponseDTO {
  code: string;
  title?: string;
  message: string;
  trace_id: string;
}

export interface IApiResponseDTO<T> extends ICommonApiResponseDTO {
  data: T;
}

export interface IApiPaginatedResponseDTO<T> extends ICommonApiResponseDTO {
  data: {
    content: T[];
    page: {
      page_number: number;
      page_size: number;
      total_elements: number;
      total_pages: number;
    };
  };
}
