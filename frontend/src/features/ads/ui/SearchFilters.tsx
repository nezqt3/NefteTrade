import React, { useState } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { AdFilters, LoadingMethod, ProductType } from '@entities/ad/model/types';
import './SearchFilters.css';

interface SearchFiltersProps {
  onSearch: (filters: AdFilters) => void;
  loading?: boolean;
}

interface RawFilters {
  fromCity: string;
  toCity: string;
  productType: string;
  priceMin: string;
  priceMax: string;
  quantityMin: string;
  quantityMax: string;
  loadingMethod: string;
  needsPump: string;
}

const initialState: RawFilters = {
  fromCity: '',
  toCity: '',
  productType: '',
  priceMin: '',
  priceMax: '',
  quantityMin: '',
  quantityMax: '',
  loadingMethod: '',
  needsPump: '',
};

export const SearchFilters: React.FC<SearchFiltersProps> = ({ onSearch, loading }) => {
  const [expanded, setExpanded] = useState(false);
  const [values, setValues] = useState<RawFilters>(initialState);

  const onChange = (key: keyof RawFilters, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const parseNumber = (value: string): number | undefined => {
    if (!value.trim()) {
      return undefined;
    }
    const parsed = Number(value.replace(/\s/g, ''));
    return Number.isFinite(parsed) ? parsed : undefined;
  };

  const buildFilters = (): AdFilters => {
    const filters: AdFilters = {};

    if (values.fromCity.trim()) {
      filters.fromCity = values.fromCity.trim();
    }
    if (values.toCity.trim()) {
      filters.toCity = values.toCity.trim();
    }
    if (values.productType) {
      filters.productType = values.productType as ProductType;
    }

    const priceMin = parseNumber(values.priceMin);
    const priceMax = parseNumber(values.priceMax);
    const quantityMin = parseNumber(values.quantityMin);
    const quantityMax = parseNumber(values.quantityMax);

    if (priceMin !== undefined) {
      filters.priceMin = priceMin;
    }
    if (priceMax !== undefined) {
      filters.priceMax = priceMax;
    }
    if (quantityMin !== undefined) {
      filters.quantityMin = quantityMin;
    }
    if (quantityMax !== undefined) {
      filters.quantityMax = quantityMax;
    }
    if (values.loadingMethod) {
      filters.loadingMethod = values.loadingMethod as LoadingMethod;
    }
    if (values.needsPump) {
      filters.needsPump = values.needsPump === 'true';
    }

    return filters;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSearch(buildFilters());
  };

  const handleReset = () => {
    setValues(initialState);
    onSearch({});
  };

  return (
    <form className="tg-filters tg-card" onSubmit={handleSubmit} aria-label="Фильтры поиска объявлений">
      <div className="tg-filters__header">
        <h2>Поиск заказов</h2>
      </div>

      <div className="tg-filters__main-grid">
        <label className="tg-field">
          <span className="tg-field__label">Город погрузки</span>
          <input
            className="tg-input"
            placeholder="Москва"
            value={values.fromCity}
            onChange={(event) => onChange('fromCity', event.target.value)}
            aria-label="Город погрузки"
          />
        </label>

        <label className="tg-field">
          <span className="tg-field__label">Город разгрузки</span>
          <input
            className="tg-input"
            placeholder="Казань"
            value={values.toCity}
            onChange={(event) => onChange('toCity', event.target.value)}
            aria-label="Город разгрузки"
          />
        </label>

        <label className="tg-field">
          <span className="tg-field__label">Тип продукта</span>
          <select
            className="tg-select"
            value={values.productType}
            onChange={(event) => onChange('productType', event.target.value)}
            aria-label="Тип продукта"
          >
            <option value="">Выберите продукт</option>
            <option value={ProductType.GASOLINE_92}>АИ-92</option>
            <option value={ProductType.GASOLINE_95}>АИ-95</option>
            <option value={ProductType.GASOLINE_98}>АИ-98</option>
            <option value={ProductType.DIESEL}>Дизель</option>
            <option value={ProductType.FUEL_OIL}>Мазут</option>
            <option value={ProductType.KEROSENE}>Керосин</option>
          </select>
        </label>
      </div>

      <button
        className={`tg-filters__toggle ${expanded ? 'tg-filters__toggle--open' : ''}`}
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
      >
        Дополнительные фильтры
        <ChevronDown className="tg-filters__toggle-arrow" size={16} strokeWidth={2.3} />
      </button>

      <div className={`tg-filters__advanced ${expanded ? 'tg-filters__advanced--open' : ''}`}>
        <div className="tg-filters__advanced-grid">
          <label className="tg-field">
            <span className="tg-field__label">Цена от</span>
            <input
              className="tg-input"
              type="number"
              min="0"
              placeholder="10000"
              value={values.priceMin}
              onChange={(event) => onChange('priceMin', event.target.value)}
            />
          </label>

          <label className="tg-field">
            <span className="tg-field__label">Цена до</span>
            <input
              className="tg-input"
              type="number"
              min="0"
              placeholder="1000000"
              value={values.priceMax}
              onChange={(event) => onChange('priceMax', event.target.value)}
            />
          </label>

          <label className="tg-field">
            <span className="tg-field__label">Количество от (тонн)</span>
            <input
              className="tg-input"
              type="number"
              min="0"
              placeholder="10"
              value={values.quantityMin}
              onChange={(event) => onChange('quantityMin', event.target.value)}
            />
          </label>

          <label className="tg-field">
            <span className="tg-field__label">Количество до (тонн)</span>
            <input
              className="tg-input"
              type="number"
              min="0"
              placeholder="100"
              value={values.quantityMax}
              onChange={(event) => onChange('quantityMax', event.target.value)}
            />
          </label>

          <label className="tg-field">
            <span className="tg-field__label">Способ налива</span>
            <select
              className="tg-select"
              value={values.loadingMethod}
              onChange={(event) => onChange('loadingMethod', event.target.value)}
            >
              <option value="">Любой</option>
              <option value={LoadingMethod.TOP}>Верхний</option>
              <option value={LoadingMethod.BOTTOM}>Нижний</option>
            </select>
          </label>

          <label className="tg-field">
            <span className="tg-field__label">Наличие насоса</span>
            <select
              className="tg-select"
              value={values.needsPump}
              onChange={(event) => onChange('needsPump', event.target.value)}
            >
              <option value="">Любое</option>
              <option value="true">Требуется</option>
              <option value="false">Не требуется</option>
            </select>
          </label>
        </div>
      </div>

      <div className="tg-filters__actions">
        <button className="tg-btn tg-btn--primary" type="submit" disabled={loading}>
          {loading ? 'Загрузка...' : 'Найти'}
          <Search size={17} strokeWidth={2.3} aria-hidden="true" />
        </button>
        <button className="tg-btn tg-btn--outline" type="button" onClick={handleReset}>
          Сбросить
        </button>
      </div>
    </form>
  );
};
