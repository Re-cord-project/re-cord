export interface SearchResult {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
  tags: string[];
}

export interface SearchResponse {
  results: SearchResult[];
  total: number;
  page: number;
  pageSize: number;
}
