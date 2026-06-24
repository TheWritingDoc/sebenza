import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://bpwynhapcndrjebrmtby.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwd3luaGFwY25kcmplYnJtdGJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIwOTk2MzYsImV4cCI6MjA5NzY3NTYzNn0.LTkF3-RWPKwehIBickGUzQbNRh0BckE6xUNjQwlk-5Q';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Auth helpers
export const signUp = async (email, password, userData) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: userData
    }
  });
  if (error) throw error;
  return data;
};

export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  if (error) throw error;
  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
};

export const getSession = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) throw error;
  return session;
};

// Database helpers
export const getUserProfile = async (userId) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();
  if (error) throw error;
  return data;
};

export const updateUserProfile = async (userId, updates) => {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const getServices = async (filters = {}) => {
  let query = supabase
    .from('services')
    .select('*, provider:users(name, avatar, rating)');
  
  if (filters.category) {
    query = query.eq('category', filters.category);
  }
  if (filters.available) {
    query = query.eq('available', true);
  }
  if (filters.location) {
    // Add location-based filtering if needed
  }
  
  const { data, error } = await query.order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

export const createService = async (serviceData) => {
  const { data, error } = await supabase
    .from('services')
    .insert(serviceData)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const getTransactions = async (userId, role = 'requester') => {
  const column = role === 'requester' ? 'requester_id' : 'provider_id';
  const { data, error } = await supabase
    .from('transactions')
    .select('*, requester:users!requester_id(name), provider:users!provider_id(name), service:services(title)')
    .eq(column, userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

export const createTransaction = async (transactionData) => {
  const { data, error } = await supabase
    .from('transactions')
    .insert(transactionData)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const getNotifications = async (userId) => {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .eq('read', false)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

export const markNotificationRead = async (notificationId) => {
  const { data, error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('id', notificationId)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const getMessages = async (userId, otherUserId) => {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .or(`and(sender_id.eq.${userId},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${userId})`)
    .order('created_at', { ascending: true });
  if (error) throw error;
  return data;
};

export const sendMessage = async (messageData) => {
  const { data, error } = await supabase
    .from('messages')
    .insert(messageData)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const getJobs = async (filters = {}) => {
  let query = supabase
    .from('jobs')
    .select('*, requester:users(name, avatar)');
  
  if (filters.status) {
    query = query.eq('status', filters.status);
  }
  if (filters.category) {
    query = query.eq('category', filters.category);
  }
  
  const { data, error } = await query.order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

export const createJob = async (jobData) => {
  const { data, error } = await supabase
    .from('jobs')
    .insert(jobData)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const getReviews = async (userId) => {
  const { data, error } = await supabase
    .from('reviews')
    .select('*, reviewer:users(name, avatar)')
    .eq('reviewee_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

export const createReview = async (reviewData) => {
  const { data, error } = await supabase
    .from('reviews')
    .insert(reviewData)
    .select()
    .single();
  if (error) throw error;
  return data;
};

// Real-time subscriptions
export const subscribeToMessages = (userId, callback) => {
  return supabase
    .channel('messages')
    .on('postgres_changes', 
      { event: 'INSERT', schema: 'public', table: 'messages', filter: `receiver_id=eq.${userId}` },
      callback
    )
    .subscribe();
};

export const subscribeToNotifications = (userId, callback) => {
  return supabase
    .channel('notifications')
    .on('postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${userId}` },
      callback
    )
    .subscribe();
};

export const subscribeToTransactions = (userId, callback) => {
  return supabase
    .channel('transactions')
    .on('postgres_changes',
      { event: '*', schema: 'public', table: 'transactions', filter: `or(requester_id.eq.${userId},provider_id.eq.${userId})` },
      callback
    )
    .subscribe();
};

// Storage helpers
export const uploadImage = async (bucket, filePath, file) => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true
    });
  if (error) throw error;
  return data;
};

export const getImageUrl = (bucket, filePath) => {
  const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
  return data.publicUrl;
};

export default supabase;
