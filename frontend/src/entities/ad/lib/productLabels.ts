import { ProductType } from '@entities/ad/model/types';

export const productTypeLabels: Record<ProductType, string> = {
  [ProductType.GASOLINE_92]: 'АИ-92',
  [ProductType.GASOLINE_95]: 'АИ-95',
  [ProductType.GASOLINE_98]: 'АИ-98',
  [ProductType.DIESEL]: 'Дизель',
  [ProductType.FUEL_OIL]: 'Мазут',
  [ProductType.KEROSENE]: 'Керосин',
  [ProductType.GAS_OIL]: 'Газойль',
};
