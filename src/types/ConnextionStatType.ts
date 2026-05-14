export interface ConnexionStatType {
  total: number;
  limit: number;
  offset: number;
  connexions: ConnexionType[];
}

export type ConnexionType = {
  id: string;
  name: string;
  email: string;
  company: {
    nameCompany: string;
    idCompany: number;
  };
  dateOfConnexion: string;
};

export interface DebouncedFilterConnexionType {
  page: string;
  perPage: string;
  name: string;
  email: string;
  company: string;
  connectedAt: string;
}