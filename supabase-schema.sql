-- ========================================
-- Smart Price Comparison System
-- Database Schema for Supabase
-- ========================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ========================================
-- Users Table (handled by Supabase Auth)
-- ========================================

-- ========================================
-- Products Table
-- ========================================
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(500) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  image_url TEXT,
  original_url TEXT,
  specs JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

  CONSTRAINT products_name_not_empty CHECK (LENGTH(TRIM(name)) > 0)
);

CREATE INDEX idx_products_name ON products(name);
CREATE INDEX idx_products_user ON products(user_id);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_created ON products(created_at DESC);

-- ========================================
-- Vendors Table (廠商表)
-- ========================================
CREATE TABLE IF NOT EXISTS vendors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(200) NOT NULL,
  platform VARCHAR(100),
  contact_person VARCHAR(100),
  email VARCHAR(255),
  phone VARCHAR(50),
  address TEXT,
  website TEXT,
  rating DECIMAL(3, 2) CHECK (rating >= 0 AND rating <= 5),
  notes TEXT,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

  CONSTRAINT vendors_name_not_empty CHECK (LENGTH(TRIM(name)) > 0)
);

CREATE INDEX idx_vendors_platform ON vendors(platform);
CREATE INDEX idx_vendors_user ON vendors(user_id);
CREATE INDEX idx_vendors_rating ON vendors(rating DESC);
CREATE INDEX idx_vendors_name ON vendors(name);

-- ========================================
-- Price Records Table (價格記錄表)
-- ========================================
CREATE TABLE IF NOT EXISTS price_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  vendor_id UUID REFERENCES vendors(id) ON DELETE SET NULL,
  price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
  original_price DECIMAL(10, 2) CHECK (original_price >= 0),
  discount_rate DECIMAL(5, 2) CHECK (discount_rate >= 0 AND discount_rate <= 100),
  stock_status VARCHAR(50) DEFAULT 'available',
  sales_volume INTEGER DEFAULT 0 CHECK (sales_volume >= 0),
  rating DECIMAL(3, 2) CHECK (rating >= 0 AND rating <= 5),
  review_count INTEGER DEFAULT 0 CHECK (review_count >= 0),
  product_url TEXT,
  scraped_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_available BOOLEAN DEFAULT true,
  shipping_fee DECIMAL(10, 2) DEFAULT 0 CHECK (shipping_fee >= 0),
  platform_specific_data JSONB DEFAULT '{}'
);

CREATE INDEX idx_price_product ON price_records(product_id);
CREATE INDEX idx_price_vendor ON price_records(vendor_id);
CREATE INDEX idx_price_date ON price_records(scraped_at DESC);
CREATE INDEX idx_price_available ON price_records(is_available);
CREATE INDEX idx_price_price ON price_records(price ASC);

-- ========================================
-- Orders Table (訂單表)
-- ========================================
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number VARCHAR(100) UNIQUE NOT NULL,
  vendor_id UUID REFERENCES vendors(id) ON DELETE SET NULL,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled', 'refunded')),
  total_amount DECIMAL(10, 2) NOT NULL CHECK (total_amount >= 0),
  shipping_fee DECIMAL(10, 2) DEFAULT 0 CHECK (shipping_fee >= 0),
  notes TEXT,
  order_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expected_delivery DATE,
  actual_delivery DATE,
  tracking_number VARCHAR(200),
  payment_method VARCHAR(50),
  payment_status VARCHAR(50) DEFAULT 'pending',
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_vendor ON orders(vendor_id);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_date ON orders(order_date DESC);
CREATE INDEX idx_orders_number ON orders(order_number);

-- ========================================
-- Order Items Table (訂單明細表)
-- ========================================
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  product_name VARCHAR(500) NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price DECIMAL(10, 2) NOT NULL CHECK (unit_price >= 0),
  subtotal DECIMAL(10, 2) NOT NULL CHECK (subtotal >= 0),
  specs JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_product ON order_items(product_id);

-- ========================================
-- Comparison Tasks Table (比價任務表)
-- ========================================
CREATE TABLE IF NOT EXISTS comparison_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_name VARCHAR(200),
  search_type VARCHAR(50) CHECK (search_type IN ('url', 'image', 'keyword')),
  search_input TEXT,
  platforms TEXT[] DEFAULT '{}',
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed')),
  total_products INTEGER DEFAULT 0 CHECK (total_products >= 0),
  completed_products INTEGER DEFAULT 0 CHECK (completed_products >= 0),
  failed_products INTEGER DEFAULT 0 CHECK (failed_products >= 0),
  error_message TEXT,
  result_summary JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

CREATE INDEX idx_tasks_status ON comparison_tasks(status);
CREATE INDEX idx_tasks_user ON comparison_tasks(user_id);
CREATE INDEX idx_tasks_created ON comparison_tasks(created_at DESC);

-- ========================================
-- Task Products Table (任務商品關聯表)
-- ========================================
CREATE TABLE IF NOT EXISTS task_products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID REFERENCES comparison_tasks(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  search_query TEXT,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  results_count INTEGER DEFAULT 0,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_task_products_task ON task_products(task_id);
CREATE INDEX idx_task_products_product ON task_products(product_id);
CREATE INDEX idx_task_products_status ON task_products(status);

-- ========================================
-- Price Alerts Table (價格提醒表)
-- ========================================
CREATE TABLE IF NOT EXISTS price_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  target_price DECIMAL(10, 2) NOT NULL CHECK (target_price >= 0),
  current_price DECIMAL(10, 2),
  notification_methods TEXT[] DEFAULT '{email}',
  is_active BOOLEAN DEFAULT true,
  triggered_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_price_alerts_product ON price_alerts(product_id);
CREATE INDEX idx_price_alerts_user ON price_alerts(user_id);
CREATE INDEX idx_price_alerts_active ON price_alerts(is_active);

-- ========================================
-- Vendor Ratings Table (廠商評分歷史表)
-- ========================================
CREATE TABLE IF NOT EXISTS vendor_ratings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  rating DECIMAL(3, 2) NOT NULL CHECK (rating >= 0 AND rating <= 5),
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_vendor_ratings_vendor ON vendor_ratings(vendor_id);
CREATE INDEX idx_vendor_ratings_user ON vendor_ratings(user_id);
CREATE INDEX idx_vendor_ratings_created ON vendor_ratings(created_at DESC);

-- ========================================
-- Functions & Triggers
-- ========================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vendors_updated_at BEFORE UPDATE ON vendors
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_price_alerts_updated_at BEFORE UPDATE ON price_alerts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Calculate order subtotal automatically
CREATE OR REPLACE FUNCTION calculate_order_item_subtotal()
RETURNS TRIGGER AS $$
BEGIN
  NEW.subtotal = NEW.quantity * NEW.unit_price;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER calculate_subtotal BEFORE INSERT OR UPDATE ON order_items
  FOR EACH ROW EXECUTE FUNCTION calculate_order_item_subtotal();

-- ========================================
-- Row Level Security (RLS) Policies
-- ========================================

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE comparison_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_ratings ENABLE ROW LEVEL SECURITY;

-- Products Policies
CREATE POLICY "Users can view their own products" ON products
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own products" ON products
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own products" ON products
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own products" ON products
  FOR DELETE USING (auth.uid() = user_id);

-- Vendors Policies
CREATE POLICY "Users can view their own vendors" ON vendors
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own vendors" ON vendors
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own vendors" ON vendors
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own vendors" ON vendors
  FOR DELETE USING (auth.uid() = user_id);

-- Price Records Policies (readable by all authenticated users for comparison)
CREATE POLICY "Authenticated users can view all price records" ON price_records
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Service role can insert price records" ON price_records
  FOR INSERT WITH CHECK (auth.role() = 'service_role' OR auth.role() = 'authenticated');

-- Orders Policies
CREATE POLICY "Users can view their own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own orders" ON orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own orders" ON orders
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own orders" ON orders
  FOR DELETE USING (auth.uid() = user_id);

-- Order Items Policies
CREATE POLICY "Users can view order items of their orders" ON order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert order items for their orders" ON order_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

-- Comparison Tasks Policies
CREATE POLICY "Users can view their own comparison tasks" ON comparison_tasks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own comparison tasks" ON comparison_tasks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comparison tasks" ON comparison_tasks
  FOR UPDATE USING (auth.uid() = user_id);

-- Task Products Policies
CREATE POLICY "Users can view task products of their tasks" ON task_products
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM comparison_tasks
      WHERE comparison_tasks.id = task_products.task_id
      AND comparison_tasks.user_id = auth.uid()
    )
  );

-- Price Alerts Policies
CREATE POLICY "Users can view their own price alerts" ON price_alerts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own price alerts" ON price_alerts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own price alerts" ON price_alerts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own price alerts" ON price_alerts
  FOR DELETE USING (auth.uid() = user_id);

-- Vendor Ratings Policies
CREATE POLICY "Users can view their own vendor ratings" ON vendor_ratings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own vendor ratings" ON vendor_ratings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ========================================
-- Sample Data (Optional)
-- ========================================

-- This section can be uncommented for testing purposes
/*
INSERT INTO platforms (name, base_url, is_active) VALUES
  ('Shopee', 'https://shopee.tw', true),
  ('Ruten', 'https://www.ruten.com.tw', true),
  ('PChome', 'https://24h.pchome.com.tw', true),
  ('Momo', 'https://www.momoshop.com.tw', true),
  ('Yahoo', 'https://tw.buy.yahoo.com', true);
*/
