import { Status } from "./DiversType";

export interface LogType {
  id: number;
  timestamp: string;
  level: Status;
  message: string;
  route: string;
  user: string | null;
  meta: Record<string, string | number | boolean | null> | null;
}

export interface LogResultType {
  total: number;
  page: number;
  perPage: number;
  offset: number;
  logs: LogType[];
}

export interface DebouncedFilterLogType {
  page: string;
  perPage: string;
  route: string;
  level: string;
  user: string;
  message: string;
  createdAt: string;
}

export interface LogHookType{
    columnsData: string[]
    logs: LogResultType;
    isLoading: boolean;
    isFiltering: boolean;
    totalPages: number;
    currentPage: number;
    page: string;
    setPage: React.Dispatch<React.SetStateAction<string>>;
    perPage: string;
    setPerPage: React.Dispatch<React.SetStateAction<string>>;
    route: string;
    setRoute: React.Dispatch<React.SetStateAction<string>>;
    level: string;
    setLevel: React.Dispatch<React.SetStateAction<string>>;
    user: string;
    setUser: React.Dispatch<React.SetStateAction<string>>;
    message: string;
    setMessage: React.Dispatch<React.SetStateAction<string>>;
    createdAt: string;
    setCreatedAt: React.Dispatch<React.SetStateAction<string>>;
}
