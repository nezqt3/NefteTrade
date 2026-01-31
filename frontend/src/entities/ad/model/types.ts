export enum ProductType {
  GASOLINE_92 = 'gasoline_92',
  GASOLINE_95 = 'gasoline_95',
  GASOLINE_98 = 'gasoline_98',
  DIESEL = 'diesel',
  FUEL_OIL = 'fuel_oil',
  KEROSENE = 'kerosene',
  GAS_OIL = 'gas_oil',
}

export enum LoadingMethod {
  TOP = 'top',
  BOTTOM = 'bottom',
}

export interface Address {
  city: string;
  address: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface Ad {
  id: string;
  userId: string;
  user?: {
    name: string;
    rating: number;
    phone?: string;
  };
  loadingAddress: Address;
  unloadingAddress: Address;
  productType: ProductType;
  quantity: number; // in tons
  loadingMethod: LoadingMethod;
  needsPump: boolean;
  price: number; // per ton or total
  priceType: 'per_ton' | 'total';
  description?: string;
  status: 'active' | 'inactive' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  viewsCount: number;
  contactViewsCount: number;
}

export interface AdFilters {
  fromCity?: string;
  toCity?: string;
  productType?: ProductType;
  priceMin?: number;
  priceMax?: number;
  quantityMin?: number;
  quantityMax?: number;
  loadingMethod?: LoadingMethod;
  needsPump?: boolean;
}

export interface CreateAdDto {
  loadingAddress: Address;
  unloadingAddress: Address;
  productType: ProductType;
  quantity: number;
  loadingMethod: LoadingMethod;
  needsPump: boolean;
  price: number;
  priceType: 'per_ton' | 'total';
  description?: string;
}
