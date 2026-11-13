export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  display_order: number;
}

export interface SellerProfile {
  id: string;
  business_name: string;
  slug: string;
  description: string;
  story: string;
  business_category: string;
  logo_url: string;
  banner_url?: string;
  phone_number: string;
  address_line: string;
  locality: string;
  city: string;
  state: string;
  pin_code: string;
  is_approved: boolean;
  is_active: boolean;
  pickup_available: boolean;
  min_order_value: number;
  default_delivery_charge: number;
  free_delivery_threshold?: number | null;
  estimated_delivery_time: string;
  deliveryAreas?: SellerDeliveryArea[];
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  is_primary: boolean;
  display_order: number;
}

export interface Product {
  id: string;
  seller_id: string;
  category_id: string;
  name: string;
  description: string;
  price: number;
  mrp?: number;
  stock_quantity: number;
  min_order_quantity: number;
  ingredients_or_materials?: string;
  preparation_time?: string;
  is_active: boolean;
  is_popular?: boolean;
  is_freshly_made?: boolean;
  created_at: string;
  images?: ProductImage[];
  seller?: Partial<SellerProfile>;
  category?: Partial<Category>;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface SellerDeliveryArea {
  id: string;
  seller_id: string;
  pin_code: string;
  locality_name?: string;
  city: string;
  delivery_charge?: number;
  is_active: boolean;
}

export type SuborderStatus =
  | 'Order Placed'
  | 'Accepted'
  | 'Preparing'
  | 'Ready for Dispatch'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled';

export interface OrderItem {
  id: string;
  product_name: string;
  unit_price: number;
  quantity: number;
  total_price: number;
}

export interface OrderStatusHistoryEntry {
  id: string;
  status: SuborderStatus;
  notes?: string;
  created_by_role: string;
  created_at: string;
}

export interface SellerSuborder {
  id: string;
  suborder_reference: string;
  items_subtotal: number;
  delivery_charge: number;
  suborder_total: number;
  status: SuborderStatus;
  rejection_reason?: string;
  estimated_delivery_date?: string;
  created_at?: string;
  updated_at?: string;
  seller?: Partial<SellerProfile>;
  items?: OrderItem[];
  status_history?: OrderStatusHistoryEntry[];
  parentOrderSummary?: {
    customer_name: string;
    customer_phone: string;
    customer_email?: string;
    delivery_address: string;
    delivery_instructions?: string;
    payment_method: string;
    payment_status: string;
  };
}

export interface Order {
  id: string;
  order_reference: string;
  customer_name: string;
  customer_phone: string;
  delivery_address_line: string;
  delivery_locality: string;
  delivery_city: string;
  delivery_pin_code: string;
  total_items_amount: number;
  total_delivery_amount: number;
  grand_total: number;
  payment_method: string;
  payment_status: string;
  created_at: string;
  suborders?: SellerSuborder[];
}
