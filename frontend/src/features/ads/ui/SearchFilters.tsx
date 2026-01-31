import React, { useState } from 'react';
import { Card, Form, Input, Select, InputNumber, Button, Space, Collapse } from 'antd';
import { SearchOutlined, FilterOutlined } from '@ant-design/icons';
import { AdFilters, ProductType, LoadingMethod } from '@entities/ad/model/types';

const { Option } = Select;
const { Panel } = Collapse;

interface SearchFiltersProps {
  onSearch: (filters: AdFilters) => void;
  loading?: boolean;
}

export const SearchFilters: React.FC<SearchFiltersProps> = ({ onSearch, loading }) => {
  const [form] = Form.useForm();
  const [expanded, setExpanded] = useState(false);

  const handleSearch = (values: AdFilters) => {
    // Remove empty values
    const cleanFilters = Object.fromEntries(
      Object.entries(values).filter(([_, v]) => v != null && v !== '')
    );
    onSearch(cleanFilters as AdFilters);
  };

  const handleReset = () => {
    form.resetFields();
    onSearch({});
  };

  return (
    <Card
      style={{
        borderRadius: '12px',
        marginBottom: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      }}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSearch}
        initialValues={{}}
      >
        {/* Main search fields */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <Form.Item name="fromCity" label="Город погрузки">
            <Input placeholder="Москва" />
          </Form.Item>

          <Form.Item name="toCity" label="Город разгрузки">
            <Input placeholder="Санкт-Петербург" />
          </Form.Item>

          <Form.Item name="productType" label="Тип продукта">
            <Select placeholder="Выберите" allowClear>
              <Option value={ProductType.GASOLINE_92}>АИ-92</Option>
              <Option value={ProductType.GASOLINE_95}>АИ-95</Option>
              <Option value={ProductType.GASOLINE_98}>АИ-98</Option>
              <Option value={ProductType.DIESEL}>Дизель</Option>
              <Option value={ProductType.FUEL_OIL}>Мазут</Option>
              <Option value={ProductType.KEROSENE}>Керосин</Option>
              <Option value={ProductType.GAS_OIL}>Газойль</Option>
            </Select>
          </Form.Item>
        </div>

        {/* Advanced filters */}
        <Collapse
          ghost
          activeKey={expanded ? ['1'] : []}
          onChange={() => setExpanded(!expanded)}
          style={{ marginTop: '16px' }}
        >
          <Panel
            header={
              <Space>
                <FilterOutlined />
                <span>Дополнительные фильтры</span>
              </Space>
            }
            key="1"
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginTop: '16px' }}>
              <Form.Item name="priceMin" label="Цена от">
                <InputNumber
                  placeholder="0"
                  style={{ width: '100%' }}
                  min={0}
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
                />
              </Form.Item>

              <Form.Item name="priceMax" label="Цена до">
                <InputNumber
                  placeholder="1000000"
                  style={{ width: '100%' }}
                  min={0}
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
                />
              </Form.Item>

              <Form.Item name="quantityMin" label="Количество от (тонн)">
                <InputNumber placeholder="0" style={{ width: '100%' }} min={0} />
              </Form.Item>

              <Form.Item name="quantityMax" label="Количество до (тонн)">
                <InputNumber placeholder="100" style={{ width: '100%' }} min={0} />
              </Form.Item>

              <Form.Item name="loadingMethod" label="Способ налива">
                <Select placeholder="Выберите" allowClear>
                  <Option value={LoadingMethod.TOP}>Верхний</Option>
                  <Option value={LoadingMethod.BOTTOM}>Нижний</Option>
                </Select>
              </Form.Item>

              <Form.Item name="needsPump" label="Наличие насоса">
                <Select placeholder="Выберите" allowClear>
                  <Option value={true}>Требуется</Option>
                  <Option value={false}>Не требуется</Option>
                </Select>
              </Form.Item>
            </div>
          </Panel>
        </Collapse>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
          <Button
            type="primary"
            htmlType="submit"
            icon={<SearchOutlined />}
            size="large"
            loading={loading}
            style={{ flex: 1 }}
          >
            Найти
          </Button>
          <Button onClick={handleReset} size="large">
            Сбросить
          </Button>
        </div>
      </Form>
    </Card>
  );
};
