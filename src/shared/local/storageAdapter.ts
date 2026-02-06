export type ListOptions = {
  limit?: number;
  offset?: number;
};

export interface StorageAdapter<T, CreateInput> {
  list: (options?: ListOptions) => Promise<T[]>;
  add: (input: CreateInput) => Promise<T>;
  delete: (id: string, ctx?: any) => Promise<void>;
}

