
export interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  quantity: number;
  lotNumber: string;
  entryDate: string;
  positionId: string;
  imageUrl?: string;
}

export interface CatalogItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  imageUrl?: string;
}

export interface PalletPosition {
  id: string;
  aisle: string;
  level: number;
  slot: number;
  isOccupied: boolean;
  productId?: string;
}

export enum ViewMode {
  DASHBOARD = 'DASHBOARD',
  INVENTORY = 'INVENTORY',
  RECEIVE = 'RECEIVE',
  DISPATCH = 'DISPATCH',
  MAP = 'MAP',
  CATALOG = 'CATALOG',
  CONFIG_LOCATIONS = 'CONFIG_LOCATIONS',
  REPORTS = 'REPORTS'
}

export interface Stats {
  totalPositions: number;
  occupiedPositions: number;
  totalProducts: number;
  recentEntries: Product[];
}
