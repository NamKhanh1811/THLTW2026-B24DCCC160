import { useState, useEffect, useMemo } from 'react';

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  quantity: number;
}

export interface OrderProduct {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  products: OrderProduct[];
  totalAmount: number;
  status: string;
  createdAt: string;
}

export interface Dashboard {
  totalProducts: number;
  totalOrders: number;
  totalStockValue: number;
  revenue: number;
}

export interface StoreModelType {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  dashboard: Dashboard;
}

const PRODUCT_KEY = 'products';
const ORDER_KEY = 'orders';

const initialProducts: Product[] = [
  { id: 1, name: 'Laptop Dell XPS 13', category: 'Laptop', price: 25000000, quantity: 15 },
  { id: 2, name: 'iPhone 15 Pro Max', category: 'Điện thoại', price: 30000000, quantity: 8 },
  { id: 3, name: 'Samsung Galaxy S24', category: 'Điện thoại', price: 22000000, quantity: 20 },
  { id: 4, name: 'iPad Air M2', category: 'Máy tính bảng', price: 18000000, quantity: 5 },
  { id: 5, name: 'MacBook Air M3', category: 'Laptop', price: 28000000, quantity: 12 },
  { id: 6, name: 'AirPods Pro 2', category: 'Phụ kiện', price: 6000000, quantity: 0 },
  { id: 7, name: 'Samsung Galaxy Tab S9', category: 'Máy tính bảng', price: 15000000, quantity: 7 },
  { id: 8, name: 'Logitech MX Master 3', category: 'Phụ kiện', price: 2500000, quantity: 25 },
];

const initialOrders: Order[] = [
  {
    id: 'DH001',
    customerName: 'Nguyễn Văn A',
    phone: '0912345678',
    address: '123 Nguyễn Huệ, Q1, TP.HCM',
    products: [
      { productId: 1, productName: 'Laptop Dell XPS 13', quantity: 1, price: 25000000 }
    ],
    totalAmount: 25000000,
    status: 'Chờ xử lý',
    createdAt: '2024-01-15'
  }
];

export default function useStore(): StoreModelType {
  const [products, setProducts] = useState<Product[]>(
    JSON.parse(localStorage.getItem(PRODUCT_KEY) || 'null') || initialProducts
  );

  const [orders, setOrders] = useState<Order[]>(
    JSON.parse(localStorage.getItem(ORDER_KEY) || 'null') || initialOrders
  );

  useEffect(() => {
    localStorage.setItem(PRODUCT_KEY, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(ORDER_KEY, JSON.stringify(orders));
  }, [orders]);

  const dashboard = useMemo<Dashboard>(() => {
    const totalStockValue = products.reduce(
      (sum: number, p: Product) => sum + p.price * p.quantity,
      0
    );

    const revenue = orders
      .filter((o: Order) => o.status === 'Hoàn thành')
      .reduce((sum: number, o: Order) => sum + o.totalAmount, 0);

    return {
      totalProducts: products.length,
      totalOrders: orders.length,
      totalStockValue,
      revenue,
    };
  }, [products, orders]);

  return { products, setProducts, orders, setOrders, dashboard };
}