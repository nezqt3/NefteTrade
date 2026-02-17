import { api } from '@shared/api/axios';
import { Ad, AdFilters, CreateAdDto, LoadingMethod, ProductType } from '@entities/ad/model/types';

export interface AdsResponse {
  ads: Ad[];
  total: number;
  page: number;
  limit: number;
}

interface BackendListingsResponse {
  success: boolean;
  listings: BackendListing[];
  total?: number;
  meta?: {
    limit: number;
    offset: number;
  };
}

interface BackendListingResponse {
  success: boolean;
  listing: BackendListing;
}

interface BackendListing {
  id: number | string;
  owner_id?: number;
  ownerId?: string;
  load_address?: string;
  loadAddress?: string;
  unload_address?: string;
  unloadAddress?: string;
  product_type?: string;
  productType?: string;
  quantity?: number;
  loading_method?: string;
  loadingMethod?: string;
  pump_required?: boolean | number;
  pumpRequired?: boolean | number;
  price?: number;
  status?: string;
  created_at?: string;
  createdAt?: string;
}

function splitAddress(value?: string) {
  const text = value ?? '';
  const parts = text.split(',');
  if (parts.length >= 2) {
    return { city: parts[0].trim(), address: parts.slice(1).join(',').trim() };
  }
  return { city: text.trim(), address: text.trim() };
}

function mapProductType(value?: string): ProductType {
  switch (value) {
    case 'gasoline_92':
      return ProductType.GASOLINE_92;
    case 'gasoline_95':
      return ProductType.GASOLINE_95;
    case 'gasoline_98':
      return ProductType.GASOLINE_98;
    case 'gasoline':
      return ProductType.GASOLINE_95;
    case 'diesel':
      return ProductType.DIESEL;
    case 'kerosene':
      return ProductType.KEROSENE;
    case 'fuel_oil':
    case 'mazut':
      return ProductType.FUEL_OIL;
    case 'gas_oil':
    case 'oil':
      return ProductType.GAS_OIL;
    default:
      return ProductType.DIESEL;
  }
}

function mapListingToAd(listing: BackendListing): Ad {
  const loadAddress = listing.load_address ?? listing.loadAddress;
  const unloadAddress = listing.unload_address ?? listing.unloadAddress;
  const loadingMethodRaw = listing.loading_method ?? listing.loadingMethod;
  const pumpRaw = listing.pump_required ?? listing.pumpRequired;
  const createdAt = listing.created_at ?? listing.createdAt ?? new Date().toISOString();

  const statusRaw = listing.status ?? 'active';
  const statusMap: Record<string, Ad['status']> = {
    draft: 'inactive',
    active: 'active',
    completed: 'completed',
    blocked: 'cancelled',
  };
  const mappedStatus = statusMap[statusRaw] ?? 'active';

  return {
    id: String(listing.id),
    userId: String(listing.owner_id ?? listing.ownerId ?? ''),
    user: {
      name: 'Заказчик',
      rating: 0,
    },
    loadingAddress: splitAddress(loadAddress),
    unloadingAddress: splitAddress(unloadAddress),
    productType: mapProductType(listing.product_type ?? listing.productType),
    quantity: listing.quantity ?? 0,
    loadingMethod:
      loadingMethodRaw === 'bottom' ? LoadingMethod.BOTTOM : LoadingMethod.TOP,
    needsPump: pumpRaw === true || pumpRaw === 1 || String(pumpRaw) === '1',
    price: listing.price ?? 0,
    priceType: 'total',
    description: undefined,
    status: mappedStatus,
    createdAt,
    updatedAt: createdAt,
    viewsCount: 0,
    contactViewsCount: 0,
  };
}

function mapAdToBackend(data: Partial<CreateAdDto>) {
  const payload: Record<string, unknown> = {};
  if (data.loadingAddress) {
    payload.loadAddress = `${data.loadingAddress.city}, ${data.loadingAddress.address}`;
  }
  if (data.unloadingAddress) {
    payload.unloadAddress = `${data.unloadingAddress.city}, ${data.unloadingAddress.address}`;
  }
  if (data.productType) payload.productType = data.productType;
  if (data.quantity !== undefined) payload.quantity = data.quantity;
  if (data.loadingMethod) payload.loadingMethod = data.loadingMethod;
  if (data.needsPump !== undefined) payload.pumpRequired = data.needsPump;
  if (data.price !== undefined) payload.price = data.price;
  payload.status = 'active';
  return payload;
}

export const adsApi = {
  getAds: async (
    filters: AdFilters = {},
    page = 1,
    limit = 20
  ): Promise<AdsResponse> => {
    const response = await api.get<BackendListingsResponse>('/ads', {
      params: {
        page,
        limit,
        productType: filters.productType,
        minPrice: filters.priceMin,
        maxPrice: filters.priceMax,
        quantityMin: filters.quantityMin,
        quantityMax: filters.quantityMax,
        loadingMethod: filters.loadingMethod,
        needsPump:
          filters.needsPump === undefined ? undefined : String(filters.needsPump),
        fromCity: filters.fromCity,
        toCity: filters.toCity,
      },
    });

    const ads = response.data.listings.map(mapListingToAd);
    return {
      ads,
      total: response.data.total ?? ads.length,
      page,
      limit,
    };
  },

  getAdById: async (id: string): Promise<Ad> => {
    const response = await api.get<BackendListingResponse>(`/ads/${id}`);
    return mapListingToAd(response.data.listing);
  },

  createAd: async (data: CreateAdDto): Promise<Ad> => {
    await api.post('/ads', mapAdToBackend(data));
    const now = new Date().toISOString();
    return {
      id: 'temp',
      userId: localStorage.getItem('userId') || '',
      user: {
        name: 'Заказчик',
        rating: 0,
      },
      loadingAddress: data.loadingAddress,
      unloadingAddress: data.unloadingAddress,
      productType: data.productType,
      quantity: data.quantity,
      loadingMethod: data.loadingMethod,
      needsPump: data.needsPump,
      price: data.price,
      priceType: data.priceType,
      description: data.description,
      status: 'active',
      createdAt: now,
      updatedAt: now,
      viewsCount: 0,
      contactViewsCount: 0,
    };
  },

  updateAd: async (id: string, data: Partial<CreateAdDto>): Promise<Ad> => {
    await api.patch(`/ads/${id}`, mapAdToBackend(data));
    const now = new Date().toISOString();
    return {
      id,
      userId: localStorage.getItem('userId') || '',
      user: {
        name: 'Заказчик',
        rating: 0,
      },
      loadingAddress: data.loadingAddress || { city: '', address: '' },
      unloadingAddress: data.unloadingAddress || { city: '', address: '' },
      productType: data.productType || ProductType.DIESEL,
      quantity: data.quantity || 0,
      loadingMethod: data.loadingMethod || LoadingMethod.TOP,
      needsPump: data.needsPump ?? false,
      price: data.price || 0,
      priceType: data.priceType || 'total',
      description: data.description,
      status: 'active',
      createdAt: now,
      updatedAt: now,
      viewsCount: 0,
      contactViewsCount: 0,
    };
  },

  deleteAd: async (id: string): Promise<void> => {
    await api.delete(`/ads/${id}`);
  },

  getMyAds: async (): Promise<Ad[]> => {
    const response = await api.get<BackendListingsResponse>('/ads/my');
    return response.data.listings.map(mapListingToAd);
  },
};
