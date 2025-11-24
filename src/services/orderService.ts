import { supabase, Order, OrderItem } from '../lib/supabase';

export interface CreateOrderInput {
  vendorId: string;
  items: Array<{
    productId?: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    specs?: Record<string, any>;
  }>;
  shippingFee?: number;
  notes?: string;
  paymentMethod?: string;
}

/**
 * Generate unique order number
 */
function generateOrderNumber(): string {
  const date = new Date();
  const timestamp = date.getTime().toString().slice(-8);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `ORD${timestamp}${random}`;
}

/**
 * Create a new order
 */
export async function createOrder(
  input: CreateOrderInput,
  userId: string
): Promise<Order> {
  try {
    // Calculate total amount
    const itemsTotal = input.items.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0
    );
    const totalAmount = itemsTotal + (input.shippingFee || 0);

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        order_number: generateOrderNumber(),
        vendor_id: input.vendorId,
        total_amount: totalAmount,
        shipping_fee: input.shippingFee || 0,
        notes: input.notes,
        payment_method: input.paymentMethod,
        status: 'pending',
        user_id: userId,
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // Create order items
    for (const item of input.items) {
      const { error: itemError } = await supabase
        .from('order_items')
        .insert({
          order_id: order.id,
          product_id: item.productId,
          product_name: item.productName,
          quantity: item.quantity,
          unit_price: item.unitPrice,
          subtotal: item.quantity * item.unitPrice,
          specs: item.specs || {},
        });

      if (itemError) throw itemError;
    }

    return order;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
}

/**
 * Get all orders for a user
 */
export async function getOrders(userId: string): Promise<Order[]> {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', userId)
    .order('order_date', { ascending: false });

  if (error) throw error;
  return data || [];
}

/**
 * Get order by ID
 */
export async function getOrderById(orderId: string): Promise<Order | null> {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', orderId)
    .single();

  if (error) {
    console.error('Error getting order:', error);
    return null;
  }

  return data;
}

/**
 * Get order items for an order
 */
export async function getOrderItems(orderId: string): Promise<OrderItem[]> {
  const { data, error } = await supabase
    .from('order_items')
    .select('*')
    .eq('order_id', orderId);

  if (error) {
    console.error('Error getting order items:', error);
    return [];
  }

  return data || [];
}

/**
 * Update order status
 */
export async function updateOrderStatus(
  orderId: string,
  status: Order['status'],
  trackingNumber?: string
): Promise<Order> {
  const updates: Partial<Order> = {
    status,
    ...(trackingNumber && { tracking_number: trackingNumber }),
    ...(status === 'delivered' && { actual_delivery: new Date().toISOString() }),
  };

  const { data, error } = await supabase
    .from('orders')
    .update(updates)
    .eq('id', orderId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Update order
 */
export async function updateOrder(
  orderId: string,
  updates: Partial<Order>
): Promise<Order> {
  const { data, error } = await supabase
    .from('orders')
    .update(updates)
    .eq('id', orderId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Delete order
 */
export async function deleteOrder(orderId: string): Promise<void> {
  const { error } = await supabase
    .from('orders')
    .delete()
    .eq('id', orderId);

  if (error) throw error;
}

/**
 * Get orders by status
 */
export async function getOrdersByStatus(
  status: Order['status'],
  userId: string
): Promise<Order[]> {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', userId)
    .eq('status', status)
    .order('order_date', { ascending: false });

  if (error) throw error;
  return data || [];
}

/**
 * Get orders by vendor
 */
export async function getOrdersByVendor(
  vendorId: string,
  userId: string
): Promise<Order[]> {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', userId)
    .eq('vendor_id', vendorId)
    .order('order_date', { ascending: false });

  if (error) throw error;
  return data || [];
}

/**
 * Get order statistics
 */
export async function getOrderStatistics(userId: string): Promise<{
  total: number;
  pending: number;
  confirmed: number;
  shipped: number;
  delivered: number;
  cancelled: number;
  totalAmount: number;
}> {
  const orders = await getOrders(userId);

  return {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    confirmed: orders.filter(o => o.status === 'confirmed').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
    totalAmount: orders.reduce((sum, o) => sum + o.total_amount, 0),
  };
}
