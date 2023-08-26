export interface IApiPaginatedRequestDTO {
  params: IRequestParam[];
  page_number: number;
  page_size?: number;
}

interface IRequestParam {
  key: string;
  value: unknown;
  search_operation: TSearchOperation;
}

export type TSearchOperation =
  | 'GREATER_THAN'
  | 'LESS_THAN'
  | 'GREATER_THAN_EQUAL'
  | 'LESS_THAN_EQUAL'
  | 'NOT_EQUAL'
  | 'EQUAL'
  | 'MATCH'
  | 'MATCH_END'
  | 'BETWEEN'
  | 'IN'
  | 'BETWEEN_DATE'
  | 'BETWEEN_DATETIME';
