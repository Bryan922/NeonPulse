export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  features: string[];
}

export interface CartItem {
  productId: string;
  quantity: number;
  customization?: {
    text: string;
    font: string;
    color: string;
    letterCount: number;
  };
}

export interface User {
  id: string;
  email: string;
  role: 'user' | 'admin';
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  createdAt: string;
  shippingDetails: ShippingDetails;
  assignedTo?: {
    adminId: string;
    adminEmail: string;
    assignedAt: string;
  };
}

export interface ShippingDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  addressComplement: string;
  city: string;
  postalCode: string;
  country: string;
}