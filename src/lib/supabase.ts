import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create a dummy client if environment variables are missing
// This allows the app to load and display properly even without configuration
let supabase: SupabaseClient;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase environment variables are not configured. Database features will be disabled.');
  // Create a minimal dummy client that won't crash the app
  supabase = createClient('https://placeholder.supabase.co', 'placeholder-key');
} else {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

export { supabase };

// Export a function to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return !!(supabaseUrl && supabaseAnonKey);
};

// Database Types
export interface Product {
  id: string;
  name: string;
  description?: string;
  category?: string;
  image_url?: string;
  original_url?: string;
  specs?: Record<string, any>;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export interface Vendor {
  id: string;
  name: string;
  platform?: string;
  contact_person?: string;
  email?: string;
  phone?: string;
  address?: string;
  website?: string;
  rating?: number;
  notes?: string;
  tags?: string[];
  created_at: string;
  updated_at: string;
  user_id: string;
}

export interface PriceRecord {
  id: string;
  product_id: string;
  vendor_id?: string;
  price: number;
  original_price?: number;
  discount_rate?: number;
  stock_status?: string;
  sales_volume?: number;
  rating?: number;
  review_count?: number;
  product_url?: string;
  scraped_at: string;
  is_available: boolean;
  shipping_fee?: number;
  platform_specific_data?: Record<string, any>;
}

export interface Order {
  id: string;
  order_number: string;
  vendor_id?: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  total_amount: number;
  shipping_fee?: number;
  notes?: string;
  order_date: string;
  expected_delivery?: string;
  actual_delivery?: string;
  tracking_number?: string;
  payment_method?: string;
  payment_status?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id?: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  specs?: Record<string, any>;
  created_at: string;
}

export interface ComparisonTask {
  id: string;
  task_name?: string;
  search_type: 'url' | 'image' | 'keyword';
  search_input: string;
  platforms: string[];
  status: 'pending' | 'running' | 'completed' | 'failed';
  total_products: number;
  completed_products: number;
  failed_products: number;
  error_message?: string;
  result_summary?: Record<string, any>;
  created_at: string;
  started_at?: string;
  completed_at?: string;
  user_id: string;
}

export interface PriceAlert {
  id: string;
  product_id: string;
  user_id: string;
  target_price: number;
  current_price?: number;
  notification_methods: string[];
  is_active: boolean;
  triggered_at?: string;
  created_at: string;
  updated_at: string;
}
