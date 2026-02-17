import React, { useState } from 'react';
import { message } from 'antd';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, CircleDollarSign, FileText, Fuel, MapPin } from 'lucide-react';
import { useAuthStore } from '@app/store/authStore';
import { UserRole } from '@entities/user/model/types';
import { CreateAdDto, LoadingMethod, ProductType } from '@entities/ad/model/types';
import { adsApi } from '@features/ads/api/adsApi';
import { switchPage } from '@shared/lib/switchPage';
import './CreateAdPage.css';

interface FormState {
  loadingCity: string;
  loadingAddress: string;
  unloadingCity: string;
  unloadingAddress: string;
  productType: ProductType;
  quantity: string;
  price: string;
  priceType: 'per_ton' | 'total';
  loadingMethod: LoadingMethod;
  needsPump: 'true' | 'false';
  description: string;
}

const initialFormState: FormState = {
  loadingCity: '',
  loadingAddress: '',
  unloadingCity: '',
  unloadingAddress: '',
  productType: ProductType.GASOLINE_95,
  quantity: '',
  price: '',
  priceType: 'per_ton',
  loadingMethod: LoadingMethod.TOP,
  needsPump: 'false',
  description: '',
};

export const CreateAdPage: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [formState, setFormState] = useState<FormState>(initialFormState);
  const [isSuccess, setIsSuccess] = useState(false);

  const createMutation = useMutation({
    mutationFn: (data: CreateAdDto) => adsApi.createAd(data),
    onSuccess: () => {
      setIsSuccess(true);
      message.success('Объявление успешно создано');
    },
    onError: () => {
      message.error('Ошибка создания объявления');
    },
  });

  if (!user || user.role !== UserRole.CONTRACTOR) {
    return (
      <main className="tg-create tg-page tg-page-animate">
        <div className="tg-container">
          <section className="tg-create__restricted tg-card">
            <h1>Создание объявлений доступно только подрядчикам</h1>
            <button className="tg-btn tg-btn--primary" onClick={() => switchPage(navigate, '/ads')} type="button">
              К объявлениям
            </button>
          </section>
        </div>
      </main>
    );
  }

  const updateField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setFormState((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const quantity = Number(formState.quantity);
    const price = Number(formState.price);

    if (!formState.loadingCity || !formState.unloadingCity || !formState.loadingAddress || !formState.unloadingAddress) {
      message.error('Заполните маршрут полностью');
      return;
    }

    if (!Number.isFinite(quantity) || quantity <= 0) {
      message.error('Укажите корректное количество');
      return;
    }

    if (!Number.isFinite(price) || price <= 0) {
      message.error('Укажите корректную цену');
      return;
    }

    const payload: CreateAdDto = {
      loadingAddress: {
        city: formState.loadingCity,
        address: formState.loadingAddress,
      },
      unloadingAddress: {
        city: formState.unloadingCity,
        address: formState.unloadingAddress,
      },
      productType: formState.productType,
      quantity,
      loadingMethod: formState.loadingMethod,
      needsPump: formState.needsPump === 'true',
      price,
      priceType: formState.priceType,
      description: formState.description || undefined,
    };

    createMutation.mutate(payload);
  };

  return (
    <main className="tg-create tg-page tg-page-animate">
      <div className="tg-container">
        {!isSuccess ? (
          <section className="tg-create__form-card tg-card">
            <div className="tg-create__stripe" aria-hidden="true" />
            <header className="tg-create__header">
              <h1 className="tg-gradient-text">Создать объявление</h1>
              <p>Заполните информацию о маршруте, продукте и условиях перевозки.</p>
            </header>

            <form className="tg-create__form" onSubmit={handleSubmit}>
              <div className="tg-create__section">
                <h2 className="tg-create__section-title">
                  <MapPin size={22} strokeWidth={2.3} />
                  Маршрут
                </h2>
                <div className="tg-create__grid tg-create__grid--route">
                  <label className="tg-field">
                    <span className="tg-field__label">Город погрузки</span>
                    <input className="tg-input" value={formState.loadingCity} onChange={(e) => updateField('loadingCity', e.target.value)} />
                  </label>
                  <label className="tg-field">
                    <span className="tg-field__label">Адрес погрузки</span>
                    <input className="tg-input" value={formState.loadingAddress} onChange={(e) => updateField('loadingAddress', e.target.value)} />
                  </label>
                  <label className="tg-field">
                    <span className="tg-field__label">Город разгрузки</span>
                    <input className="tg-input" value={formState.unloadingCity} onChange={(e) => updateField('unloadingCity', e.target.value)} />
                  </label>
                  <label className="tg-field">
                    <span className="tg-field__label">Адрес разгрузки</span>
                    <input className="tg-input" value={formState.unloadingAddress} onChange={(e) => updateField('unloadingAddress', e.target.value)} />
                  </label>
                </div>
              </div>

              <div className="tg-create__section">
                <h2 className="tg-create__section-title">
                  <Fuel size={22} strokeWidth={2.3} />
                  Продукт
                </h2>
                <div className="tg-create__grid">
                  <label className="tg-field">
                    <span className="tg-field__label">Тип продукта</span>
                    <select
                      className="tg-select"
                      value={formState.productType}
                      onChange={(e) => updateField('productType', e.target.value as ProductType)}
                    >
                      <option value={ProductType.GASOLINE_92}>АИ-92</option>
                      <option value={ProductType.GASOLINE_95}>АИ-95</option>
                      <option value={ProductType.GASOLINE_98}>АИ-98</option>
                      <option value={ProductType.DIESEL}>Дизель</option>
                      <option value={ProductType.FUEL_OIL}>Мазут</option>
                      <option value={ProductType.KEROSENE}>Керосин</option>
                    </select>
                  </label>
                  <label className="tg-field">
                    <span className="tg-field__label">Количество (тонн)</span>
                    <input
                      className="tg-input"
                      type="number"
                      min="0"
                      value={formState.quantity}
                      onChange={(e) => updateField('quantity', e.target.value)}
                    />
                  </label>
                </div>
              </div>

              <div className="tg-create__section">
                <h2 className="tg-create__section-title">
                  <CircleDollarSign size={22} strokeWidth={2.3} />
                  Условия
                </h2>
                <div className="tg-create__grid">
                  <label className="tg-field">
                    <span className="tg-field__label">Цена (₽)</span>
                    <input
                      className="tg-input"
                      type="number"
                      min="0"
                      value={formState.price}
                      onChange={(e) => updateField('price', e.target.value)}
                    />
                  </label>
                  <label className="tg-field">
                    <span className="tg-field__label">Цена за</span>
                    <select
                      className="tg-select"
                      value={formState.priceType}
                      onChange={(e) => updateField('priceType', e.target.value as 'per_ton' | 'total')}
                    >
                      <option value="per_ton">За тонну</option>
                      <option value="total">За всё</option>
                    </select>
                  </label>
                  <label className="tg-field">
                    <span className="tg-field__label">Способ налива</span>
                    <select
                      className="tg-select"
                      value={formState.loadingMethod}
                      onChange={(e) => updateField('loadingMethod', e.target.value as LoadingMethod)}
                    >
                      <option value={LoadingMethod.TOP}>Верхний</option>
                      <option value={LoadingMethod.BOTTOM}>Нижний</option>
                    </select>
                  </label>
                  <label className="tg-field">
                    <span className="tg-field__label">Наличие насоса</span>
                    <select className="tg-select" value={formState.needsPump} onChange={(e) => updateField('needsPump', e.target.value as 'true' | 'false')}>
                      <option value="false">Не требуется</option>
                      <option value="true">Требуется</option>
                    </select>
                  </label>
                </div>
              </div>

              <div className="tg-create__section">
                <h2 className="tg-create__section-title">
                  <FileText size={22} strokeWidth={2.3} />
                  Дополнительно
                </h2>
                <label className="tg-field">
                  <span className="tg-field__label">Комментарий</span>
                  <textarea
                    className="tg-textarea"
                    value={formState.description}
                    onChange={(e) => updateField('description', e.target.value)}
                    placeholder="Укажите дополнительные условия"
                  />
                </label>
              </div>

              <button className="tg-btn tg-btn--primary" type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? 'Создание...' : 'Создать объявление'}
              </button>
            </form>
          </section>
        ) : (
          <section className="tg-create__success tg-card">
            <div className="tg-create__check" aria-hidden="true">
              <CheckCircle2 className="tg-create__check-icon" size={34} strokeWidth={2.5} />
            </div>
            <h2>Объявление успешно создано!</h2>
            <p>Теперь вы можете сразу перейти к списку объявлений и открыть переписку с заказчиками.</p>
            <button className="tg-btn tg-btn--success" onClick={() => switchPage(navigate, '/ads')} type="button">
              Перейти к объявлениям
            </button>
          </section>
        )}
      </div>
    </main>
  );
};
