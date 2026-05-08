export interface StoresType {
  id: number;
  name: string;
  companyId: number;
}

export interface ResultStoreType {
  total: number;
  page: number;
  perPage: number;
  offset: number;
  preview: boolean;
  next: boolean;
  stores: StoresType[];
}
