import React from "react";
import {
  Button,
  Card,
  Form,
  Input,
  InputNumber,
  Select,
  Typography,
  message,
} from "antd";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import {
  CreateAdDto,
  LoadingMethod,
  ProductType,
} from "@entities/ad/model/types";
import { adsApi } from "@features/ads/api/adsApi";
import { useAuthStore } from "@app/store/authStore";
import { UserRole } from "@entities/user/model/types";

const { Title } = Typography;
const { Option } = Select;

export const CreateAdPage: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  const createMutation = useMutation({
    mutationFn: (data: CreateAdDto) => adsApi.createAd(data),
    onSuccess: () => {
      message.success("Объявление создано");
      navigate("/my-ads");
    },
    onError: (error: any) => {
      message.error(error?.response?.data?.message || "Ошибка создания");
    },
  });

  const handleSubmit = (values: any) => {
    const payload: CreateAdDto = {
      loadingAddress: {
        city: values.loadingCity,
        address: values.loadingAddress,
      },
      unloadingAddress: {
        city: values.unloadingCity,
        address: values.unloadingAddress,
      },
      productType: values.productType,
      quantity: values.quantity,
      loadingMethod: values.loadingMethod,
      needsPump: values.needsPump,
      price: values.price,
      priceType: values.priceType,
      description: values.description,
    };
    createMutation.mutate(payload);
  };

  if (!user || user.role !== UserRole.CONTRACTOR) {
    return (
      <div style={{ padding: "50px", textAlign: "center" }}>
        <Title level={3}>Создание объявлений доступно подрядчикам</Title>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 24px" }}>
      <Title level={2} style={{ marginBottom: 24 }}>
        Создать объявление
      </Title>
      <Card style={{ borderRadius: 12 }}>
        <Form layout="vertical" onFinish={handleSubmit} initialValues={{ priceType: "total", loadingMethod: LoadingMethod.TOP, needsPump: false }}>
          <Form.Item
            label="Город погрузки"
            name="loadingCity"
            rules={[{ required: true, message: "Укажите город погрузки" }]}
          >
            <Input placeholder="Москва" />
          </Form.Item>

          <Form.Item
            label="Адрес погрузки"
            name="loadingAddress"
            rules={[{ required: true, message: "Укажите адрес погрузки" }]}
          >
            <Input placeholder="ул. Пример, 1" />
          </Form.Item>

          <Form.Item
            label="Город разгрузки"
            name="unloadingCity"
            rules={[{ required: true, message: "Укажите город разгрузки" }]}
          >
            <Input placeholder="Санкт-Петербург" />
          </Form.Item>

          <Form.Item
            label="Адрес разгрузки"
            name="unloadingAddress"
            rules={[{ required: true, message: "Укажите адрес разгрузки" }]}
          >
            <Input placeholder="пр-т Пример, 2" />
          </Form.Item>

          <Form.Item
            label="Тип продукта"
            name="productType"
            rules={[{ required: true, message: "Выберите тип продукта" }]}
          >
            <Select placeholder="Выберите">
              <Option value={ProductType.GASOLINE_92}>АИ-92</Option>
              <Option value={ProductType.GASOLINE_95}>АИ-95</Option>
              <Option value={ProductType.GASOLINE_98}>АИ-98</Option>
              <Option value={ProductType.DIESEL}>Дизель</Option>
              <Option value={ProductType.FUEL_OIL}>Мазут</Option>
              <Option value={ProductType.KEROSENE}>Керосин</Option>
              <Option value={ProductType.GAS_OIL}>Газойль</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Количество (тонн)"
            name="quantity"
            rules={[{ required: true, message: "Укажите количество" }]}
          >
            <InputNumber min={1} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            label="Способ налива"
            name="loadingMethod"
            rules={[{ required: true, message: "Выберите способ налива" }]}
          >
            <Select>
              <Option value={LoadingMethod.TOP}>Верхний</Option>
              <Option value={LoadingMethod.BOTTOM}>Нижний</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Наличие насоса"
            name="needsPump"
            rules={[{ required: true, message: "Укажите наличие насоса" }]}
          >
            <Select>
              <Option value={true}>Требуется</Option>
              <Option value={false}>Не требуется</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Цена"
            name="price"
            rules={[{ required: true, message: "Укажите цену" }]}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            label="Тип цены"
            name="priceType"
            rules={[{ required: true, message: "Укажите тип цены" }]}
          >
            <Select>
              <Option value="per_ton">За тонну</Option>
              <Option value="total">Всего</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Описание" name="description">
            <Input.TextArea rows={4} placeholder="Дополнительные условия" />
          </Form.Item>

          <Button type="primary" htmlType="submit" loading={createMutation.isPending}>
            Создать
          </Button>
        </Form>
      </Card>
    </div>
  );
};
