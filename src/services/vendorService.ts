import { supabase, Vendor } from '../lib/supabase';

/**
 * Create a new vendor
 */
export async function createVendor(
  vendor: Omit<Vendor, 'id' | 'created_at' | 'updated_at'>,
  userId: string
): Promise<Vendor> {
  const { data, error } = await supabase
    .from('vendors')
    .insert({
      ...vendor,
      user_id: userId,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Get all vendors for a user
 */
export async function getVendors(userId: string): Promise<Vendor[]> {
  const { data, error } = await supabase
    .from('vendors')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

/**
 * Get vendor by ID
 */
export async function getVendorById(vendorId: string): Promise<Vendor | null> {
  const { data, error } = await supabase
    .from('vendors')
    .select('*')
    .eq('id', vendorId)
    .single();

  if (error) {
    console.error('Error getting vendor:', error);
    return null;
  }

  return data;
}

/**
 * Update vendor
 */
export async function updateVendor(
  vendorId: string,
  updates: Partial<Vendor>
): Promise<Vendor> {
  const { data, error } = await supabase
    .from('vendors')
    .update(updates)
    .eq('id', vendorId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Delete vendor
 */
export async function deleteVendor(vendorId: string): Promise<void> {
  const { error } = await supabase
    .from('vendors')
    .delete()
    .eq('id', vendorId);

  if (error) throw error;
}

/**
 * Rate vendor
 */
export async function rateVendor(
  vendorId: string,
  rating: number,
  note?: string,
  userId?: string
): Promise<void> {
  // Create rating record
  if (userId) {
    await supabase.from('vendor_ratings').insert({
      vendor_id: vendorId,
      user_id: userId,
      rating,
      note,
    });
  }

  // Update vendor rating
  await supabase
    .from('vendors')
    .update({ rating })
    .eq('id', vendorId);
}

/**
 * Search vendors
 */
export async function searchVendors(
  query: string,
  userId: string
): Promise<Vendor[]> {
  const { data, error } = await supabase
    .from('vendors')
    .select('*')
    .eq('user_id', userId)
    .or(`name.ilike.%${query}%,platform.ilike.%${query}%,notes.ilike.%${query}%`)
    .order('rating', { ascending: false });

  if (error) throw error;
  return data || [];
}

/**
 * Get vendors by platform
 */
export async function getVendorsByPlatform(
  platform: string,
  userId: string
): Promise<Vendor[]> {
  const { data, error } = await supabase
    .from('vendors')
    .select('*')
    .eq('user_id', userId)
    .eq('platform', platform)
    .order('rating', { ascending: false });

  if (error) throw error;
  return data || [];
}

/**
 * Add vendor from price record
 */
export async function addVendorFromPriceRecord(
  priceRecordId: string,
  userId: string
): Promise<Vendor> {
  const { data: priceRecord, error } = await supabase
    .from('price_records')
    .select('*')
    .eq('id', priceRecordId)
    .single();

  if (error) throw error;

  // Extract vendor info from price record
  const vendorData = {
    name: priceRecord.platform_specific_data?.vendorName || 'Unknown Vendor',
    platform: priceRecord.platform_specific_data?.platform || 'Unknown',
    website: priceRecord.product_url,
    rating: priceRecord.rating,
    user_id: userId,
  };

  // Check if vendor already exists
  const { data: existingVendor } = await supabase
    .from('vendors')
    .select('*')
    .eq('user_id', userId)
    .eq('website', vendorData.website)
    .single();

  if (existingVendor) {
    return existingVendor;
  }

  // Create new vendor
  return await createVendor(vendorData, userId);
}
