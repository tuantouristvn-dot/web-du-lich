-- =============================================
-- TRAVEL TA - CLOUDFLARE D1 DATABASE SCHEMA
-- Phien ban: v4.0 - He thong Auth + Phan quyen
-- =============================================

-- 1. BANG CAI DAT THUONG HIEU
CREATE TABLE IF NOT EXISTS brand_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL DEFAULT '',
    description TEXT
);

INSERT OR IGNORE INTO brand_settings (key, value, description) VALUES 
('brand_name', 'TRAVEL TA', 'Ten thuong hieu dai ly'),
('slogan', 'Chuyen Tour Ghep Chat Luong Cao - Gia Tot Nhat Thi Truong', 'Khau hieu'),
('logo_url', '', 'URL Logo'),
('hotline', '0909 888 999', 'So hotline ban tour'),
('zalo_oa', 'https://zalo.me/0909888999', 'Duong dan Zalo'),
('email', 'dat-tour@travelta.vn', 'Email ho tro'),
('address', 'Tang 5, Toa nha Du Lich, Quan 1, TP. Ho Chi Minh', 'Dia chi'),
('facebook_url', 'https://facebook.com/travelta.vn', 'Fanpage Facebook'),
('youtube_url', 'https://youtube.com/@travelta', 'Kenh YouTube'),
('tiktok_url', 'https://tiktok.com/@travelta.vn', 'Kenh TikTok'),
('threads_url', 'https://threads.net/@travelta.vn', 'Kenh Threads'),
('instagram_url', 'https://instagram.com/travelta.vn', 'Kenh Instagram'),
('telegram_bot_token', '', 'Telegram Bot Token'),
('telegram_chat_id', '', 'Telegram Chat ID'),
('gemini_api_key', '', 'Gemini API Key'),
('cron_auto_sync_hour', '01:00', 'Gio tu dong dong bo');

-- 2. BANG TAI KHOAN & PHAN QUYEN
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'staff',
    fullname TEXT NOT NULL,
    phone TEXT,
    telegram_chat_id TEXT,
    status TEXT NOT NULL DEFAULT 'active',
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    approved_at DATETIME,
    approved_by TEXT
);

INSERT OR IGNORE INTO users (id, username, password, role, fullname, phone, status) VALUES 
('user-admin-1', 'admin', 'admin2026', 'admin', 'Quan Tri Vien He Thong', '0909888999', 'active');

-- 3. BANG SESSION
CREATE TABLE IF NOT EXISTS sessions (
    token TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    username TEXT NOT NULL,
    role TEXT NOT NULL,
    fullname TEXT NOT NULL,
    expires_at DATETIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 4. BANG GOOGLE SHEETS
CREATE TABLE IF NOT EXISTS google_sheets (
    id TEXT PRIMARY KEY,
    sheet_url TEXT NOT NULL,
    company_name TEXT NOT NULL,
    sales_rep_name TEXT,
    sales_contact TEXT,
    notes TEXT,
    last_synced DATETIME,
    status TEXT DEFAULT 'SUCCESS',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT OR IGNORE INTO google_sheets (id, sheet_url, company_name, sales_rep_name, sales_contact, notes) VALUES 
('sheet-partner-1', 'https://docs.google.com/spreadsheets/d/1demo-sheet1/edit', 'Cong ty Lu Hanh Quoc Te A Chau', 'Ms. Thu Huong', '0933112233', 'Chuyen tuyen Thai Lan, Singapore'),
('sheet-partner-2', 'https://docs.google.com/spreadsheets/d/1demo-sheet2/edit', 'Cong ty Du Lich Phuong Bac', 'Mr. Tuan Anh', '0944556677', 'Chuyen tour Mien Bac');

-- 5. BANG TOURS
CREATE TABLE IF NOT EXISTS tours (
    id TEXT PRIMARY KEY,
    sheet_id TEXT NOT NULL,
    tour_code TEXT,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    region TEXT NOT NULL,
    destination TEXT NOT NULL,
    departure_date DATE NOT NULL,
    duration_days INTEGER DEFAULT 4,
    max_pax INTEGER DEFAULT 25,
    slots_left INTEGER DEFAULT 8,
    public_price INTEGER NOT NULL,
    ta_price INTEGER NOT NULL,
    commission INTEGER NOT NULL,
    program_link TEXT,
    tour_details TEXT,
    transportation TEXT DEFAULT 'May bay & Xe du lich',
    hotel_star INTEGER DEFAULT 4,
    image_url TEXT,
    is_flash_sale BOOLEAN DEFAULT 0,
    is_featured BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sheet_id) REFERENCES google_sheets(id) ON DELETE CASCADE
);

-- 6. BANG CRM LEADS
CREATE TABLE IF NOT EXISTS leads (
    id TEXT PRIMARY KEY,
    customer_name TEXT,
    phone TEXT NOT NULL,
    email TEXT,
    interested_tour_id TEXT,
    source TEXT DEFAULT 'chat',
    status TEXT DEFAULT 'new',
    assigned_to TEXT,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (assigned_to) REFERENCES users(id),
    FOREIGN KEY (interested_tour_id) REFERENCES tours(id)
);

-- 7. BANG LICH SU KHACH HANG
CREATE TABLE IF NOT EXISTS lead_history (
    id TEXT PRIMARY KEY,
    lead_id TEXT NOT NULL,
    action TEXT NOT NULL,
    status_from TEXT,
    status_to TEXT,
    note TEXT,
    created_by TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE
);

-- 8. BANG BO NHO AI
CREATE TABLE IF NOT EXISTS knowledge_base (
    id TEXT PRIMARY KEY,
    category TEXT DEFAULT 'Quy dinh chung',
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    keywords TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT OR IGNORE INTO knowledge_base (id, category, question, answer, keywords) VALUES 
('kb-1', 'Gia tre em', 'Chinh sach gia ve cho tre em di tour ghep?', 'Da thua anh/chi, chinh sach ve tre em:<br/>* Duoi 2 tuoi: Mien phi tour.<br/>* Tu 2 den duoi 10 tuoi: 75% gia nguoi lon.<br/>* Tu 10 tuoi tro len: Tinh nhu nguoi lon.', 'tre em, em be, gia ve'),
('kb-2', 'Visa', 'Di tour Thai Lan, Singapore co can visa khong?', 'Da, cong dan Viet Nam duoc MIEN VISA khi nhap canh Thai Lan va Singapore (toi da 30 ngay) voi passport con han tren 6 thang.', 'visa, ho chieu, passport'),
('kb-3', 'Dat coc', 'Quy trinh dat coc tour ghep?', 'Da: 1. Dat coc 50% khi chot lich. 2. Thanh toan 50% con lai truoc KH 7 ngay (trong nuoc) hoac 10 ngay (quoc te).', 'dat coc, giu cho, thanh toan');
