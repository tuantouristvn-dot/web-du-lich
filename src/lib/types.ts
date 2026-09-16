export interface Tour {
  id: string;
  sheet_id: string;
  tour_code: string;
  name: string;
  slug: string;
  region: 'Trong nước' | 'Đông Nam Á' | 'Châu Á' | 'Châu Âu' | 'Châu Mỹ' | 'Châu Úc' | string;
  destination: string;
  departure_date: string;
  duration_days: number;
  max_pax: number;
  slots_left: number;
  public_price: number;
  ta_price: number;
  commission: number;
  program_link?: string;
  tour_details?: string;
  transportation?: string;
  hotel_star?: number;
  image_url?: string;
  is_flash_sale?: boolean | number;
  is_featured?: boolean | number;
  company_name?: string; // Admin only
  sales_contact?: string; // Admin only
}

export interface PartnerSheet {
  id: string;
  sheet_url: string;
  company_name: string;
  sales_rep_name?: string;
  sales_contact?: string;
  notes?: string;
  last_synced?: string;
  status: 'SUCCESS' | 'ERROR' | 'PENDING';
}

export interface Lead {
  id: string;
  customer_name: string;
  phone: string;
  email?: string;
  interested_tour_id?: string;
  interested_tour_name?: string;
  source: 'chat' | 'web_form' | 'hotline';
  status: 'new' | 'contacted' | 'consulting' | 'quoted' | 'won' | 'lost';
  assigned_to?: string;
  assigned_staff_name?: string;
  notes?: string;
  created_at: string;
  updated_at?: string;
}

export interface LeadHistory {
  id: string;
  lead_id: string;
  action: 'CREATED' | 'STATUS_CHANGE' | 'ASSIGNED' | 'NOTE_ADDED';
  status_from?: string;
  status_to?: string;
  note?: string;
  created_by?: string;
  created_at: string;
}

export interface KnowledgeItem {
  id: string;
  category: string;
  question: string;
  answer: string;
  keywords?: string;
  created_at?: string;
}

export interface BrandSettings {
  brand_name: string;
  slogan: string;
  logo_url: string;
  hotline: string;
  zalo_oa: string;
  email: string;
  address: string;
  facebook_url: string;
  youtube_url: string;
  tiktok_url: string;
  threads_url: string;
  instagram_url: string;
  telegram_bot_token: string;
  telegram_chat_id: string;
  gemini_api_key: string;
  cron_auto_sync_hour: string;
}

export interface UserAccount {
  id: string;
  username: string;
  password?: string; // Only used server-side
  role: 'admin' | 'staff';
  fullname: string;
  phone?: string;
  status: 'active' | 'pending' | 'disabled';
  notes?: string;
  created_at?: string;
  approved_at?: string;
  approved_by?: string;
}

export interface SessionUser {
  userId: string;
  username: string;
  role: 'admin' | 'staff';
  fullname: string;
  token: string;
}
