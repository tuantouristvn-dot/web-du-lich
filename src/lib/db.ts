import { Tour, PartnerSheet, Lead, KnowledgeItem, BrandSettings, UserAccount } from './types';

// Default Fallback Settings
export const DEFAULT_SETTINGS: BrandSettings = {
  brand_name: 'TRAVEL TA',
  slogan: 'Chuyên Tour Ghép Chất Lượng Cao - Giá Tốt Nhất Thị Trường',
  logo_url: '',
  hotline: '0909 888 999',
  zalo_oa: 'https://zalo.me/0909888999',
  email: 'dat-tour@travelta.vn',
  address: 'Tầng 5, Tòa nhà Du Lịch, Quận 1, TP. Hồ Chí Minh',
  facebook_url: 'https://facebook.com/travelta.vn',
  youtube_url: 'https://youtube.com/@travelta',
  tiktok_url: 'https://tiktok.com/@travelta.vn',
  threads_url: 'https://threads.net/@travelta.vn',
  instagram_url: 'https://instagram.com/travelta.vn',
  telegram_bot_token: '',
  telegram_chat_id: '',
  gemini_api_key: '',
  cron_auto_sync_hour: '01:00',
};

// High-quality Initial / Mock Tour Catalog (Always Future Departure Dates)
const getFutureDate = (daysAhead: number): string => {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  return d.toISOString().split('T')[0];
};

export const INITIAL_TOURS: Tour[] = [
  {
    id: 'tour-1',
    sheet_id: 'sheet-partner-1',
    tour_code: 'TG-TL05N',
    name: 'Tour Ghép Thái Lan: Bangkok - Pattaya - Đảo San Hô Coral - Buffet Baiyoke 86 Tầng',
    slug: 'tour-ghep-thai-lan-bangkok-pattaya',
    region: 'Đông Nam Á',
    destination: 'Thái Lan',
    departure_date: getFutureDate(3),
    duration_days: 5,
    max_pax: 25,
    slots_left: 4,
    public_price: 6990000,
    ta_price: 6190000,
    commission: 800000,
    program_link: 'https://travelta.vn/ct/thai-lan-5n4d.pdf',
    tour_details: 'Khách sạn 4 sao tiêu chuẩn. Bao gồm vé máy bay khứ hồi Vietjet Air, 20kg hành lý. Khám phá Đảo Coral lặn biển, Lâu Đài Tỷ Phú Baan Sukhawadee, Chợ nổi Bốn Miền, Thưởng thức Buffet Baiyoke Sky 86 tầng ngắm toàn cảnh Bangkok, Chùa Phật Vàng Wat Traimit, dạo thuyền sông Chao Phraya. Bảo hiểm du lịch quốc tế 210.000.000 VNĐ.',
    transportation: 'Máy bay khứ hồi & Xe du lịch cao cấp',
    hotel_star: 4,
    image_url: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=1200&q=80',
    is_flash_sale: 1,
    is_featured: 1,
    company_name: 'Công ty Lữ Hành Quốc Tế Á Châu',
    sales_contact: '0933112233 (Ms. Thu Hương)'
  },
  {
    id: 'tour-2',
    sheet_id: 'sheet-partner-2',
    tour_code: 'TG-HG03N',
    name: 'Tour Ghép Hà Giang Hùng Vĩ: Đồng Văn - Cột Cờ Lũng Cú - Đi Thuyền Sông Nho Quế',
    slug: 'tour-ghep-ha-giang-dong-van-nho-que',
    region: 'Trong nước',
    destination: 'Hà Giang',
    departure_date: getFutureDate(2),
    duration_days: 3,
    max_pax: 20,
    slots_left: 3,
    public_price: 2650000,
    ta_price: 2250000,
    commission: 400000,
    program_link: 'https://travelta.vn/ct/ha-giang-3n2d.pdf',
    tour_details: 'Khởi hành từ Hà Nội bằng xe Limousine VIP giường nằm cao cấp. Chinh phục Đèo Mã Pí Lèng - tứ đại đỉnh đèo hiểm trở, đi thuyền du ngoạn Hẻm Tu Sản sâu nhất Đông Nam Á trên dòng Nho Quế xanh ngọc bích, check-in Cột Cờ Cực Bắc Lũng Cú, Phố Cổ Đồng Văn, Dinh Thự Vua Mèo Vương Chính Đức. Thưởng thức đặc sản thắng dền, cháo ấu tẩu, lẩu gà đen.',
    transportation: 'Xe Limousine VIP đón trả phố cổ',
    hotel_star: 3,
    image_url: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80',
    is_flash_sale: 1,
    is_featured: 1,
    company_name: 'Công ty Du Lịch Phương Bắc',
    sales_contact: '0944556677 (Mr. Tuấn Anh)'
  },
  {
    id: 'tour-3',
    sheet_id: 'sheet-partner-1',
    tour_code: 'TG-HQ05N',
    name: 'Tour Ghép Hàn Quốc: Seoul - Đảo Nami - Công Viên Lotte World - Trải Nghiệm Mặc Hanbok',
    slug: 'tour-ghep-han-quoc-seoul-nami-lotte-world',
    region: 'Châu Á',
    destination: 'Hàn Quốc',
    departure_date: getFutureDate(7),
    duration_days: 5,
    max_pax: 22,
    slots_left: 6,
    public_price: 13990000,
    ta_price: 12490000,
    commission: 1500000,
    program_link: 'https://travelta.vn/ct/han-quoc-5n4d.pdf',
    tour_details: 'Hàng không cao cấp Vietnam Airlines. Khách sạn 4 sao trung tâm Seoul. Tham quan Đảo Nami lãng mạn bối cảnh phim Bản Tình Ca Mùa Đông, Công viên giải trí trong nhà lớn nhất thế giới Lotte World, Cung điện Hoàng Gia Gyeongbokgung, Tháp N Seoul tình yêu. Hỗ trợ hồ sơ visa nhanh chóng, tỷ lệ đậu 99.5%.',
    transportation: 'Vietnam Airlines & Xe đưa đón VIP',
    hotel_star: 4,
    image_url: 'https://images.unsplash.com/photo-1538485399081-7191377e8241?auto=format&fit=crop&w=1200&q=80',
    is_flash_sale: 0,
    is_featured: 1,
    company_name: 'Công ty Lữ Hành Quốc Tế Á Châu',
    sales_contact: '0933112233 (Ms. Thu Hương)'
  },
  {
    id: 'tour-4',
    sheet_id: 'sheet-partner-2',
    tour_code: 'TG-DN04N',
    name: 'Tour Ghép Đà Nẵng - Bà Nà Hills - Cầu Vàng - Phố Cổ Hội An - Rừng Dừa Bảy Mẫu',
    slug: 'tour-ghep-da-nang-ba-na-hoi-an',
    region: 'Trong nước',
    destination: 'Đà Nẵng',
    departure_date: getFutureDate(4),
    duration_days: 4,
    max_pax: 30,
    slots_left: 8,
    public_price: 4390000,
    ta_price: 3790000,
    commission: 600000,
    program_link: 'https://travelta.vn/ct/da-nang-4n3d.pdf',
    tour_details: 'Bao gồm vé cáp treo Bà Nà Hills và vé Cầu Vàng huyền thoại, khám phá phố cổ Hội An rực rỡ đèn lồng về đêm, trải nghiệm thuyền thúng lắc vui nhộn tại Rừng Dừa Bảy Mẫu Cẩm Thanh, tắm biển Mỹ Khê một trong những bãi biển đẹp nhất hành tinh. Ăn tối đặc sản Bánh tráng cuốn thịt heo, Mì Quảng.',
    transportation: 'Xe du lịch đời mới máy lạnh',
    hotel_star: 4,
    image_url: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=1200&q=80',
    is_flash_sale: 0,
    is_featured: 1,
    company_name: 'Công ty Du Lịch Phương Bắc',
    sales_contact: '0944556677 (Mr. Tuấn Anh)'
  },
  {
    id: 'tour-5',
    sheet_id: 'sheet-partner-1',
    tour_code: 'TG-SIN04N',
    name: 'Tour Ghép Singapore - Malaysia: Đảo Quốc Sư Tử - Tháp Đôi Petronas - Cao Nguyên Genting',
    slug: 'tour-ghep-singapore-malaysia-4n3d',
    region: 'Đông Nam Á',
    destination: 'Singapore',
    departure_date: getFutureDate(5),
    duration_days: 4,
    max_pax: 25,
    slots_left: 5,
    public_price: 9890000,
    ta_price: 8890000,
    commission: 1000000,
    program_link: 'https://travelta.vn/ct/singapore-malaysia.pdf',
    tour_details: 'Hành trình 1 chuyến đi 2 quốc gia thịnh vượng. Tham quan Gardens by the Bay, Công viên Sư Tử Biển Merlion Park, Đảo Sentosa. Tại Malaysia: Khám phá động Batu huyền bí, Quảng trường Độc Lập Merdeka, chụp ảnh Tháp Đôi Petronas, cáp treo lên Cao Nguyên Genting sầm uất.',
    transportation: 'Bay thẳng khứ hồi & Xe du lịch',
    hotel_star: 4,
    image_url: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1200&q=80',
    is_flash_sale: 0,
    is_featured: 1,
    company_name: 'Công ty Lữ Hành Quốc Tế Á Châu',
    sales_contact: '0933112233 (Ms. Thu Hương)'
  },
  {
    id: 'tour-6',
    sheet_id: 'sheet-partner-2',
    tour_code: 'TG-PQ03N',
    name: 'Tour Ghép Phú Quốc Thiên Đường Đảo Ngọc: Grand World - Cano 4 Đảo - Cáp Treo Hòn Thơm',
    slug: 'tour-ghep-phu-quoc-cano-4-dao',
    region: 'Trong nước',
    destination: 'Phú Quốc',
    departure_date: getFutureDate(6),
    duration_days: 3,
    max_pax: 25,
    slots_left: 7,
    public_price: 3450000,
    ta_price: 2950000,
    commission: 500000,
    program_link: 'https://travelta.vn/ct/phu-quoc-3n2d.pdf',
    tour_details: 'Trải nghiệm đi cano cao tốc khám phá 4 hòn đảo đẹp nhất: Hòn Móng Tay, Hòn Mây Rút, Hòn Gầm Ghì lặn ngắm san hô tự nhiên. Đi cáp treo vượt biển 3 dây dài nhất thế giới sang Hòn Thơm. Dạo chơi thành phố không ngủ Grand World Phú Quốc, xem show diễn Tinh Hoa Việt Nam hoành tráng.',
    transportation: 'Xe du lịch & Cano cao tốc',
    hotel_star: 4,
    image_url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
    is_flash_sale: 1,
    is_featured: 1,
    company_name: 'Công ty Du Lịch Phương Bắc',
    sales_contact: '0944556677 (Mr. Tuấn Anh)'
  }
];

export const INITIAL_LEADS: Lead[] = [
  {
    id: 'lead-1',
    customer_name: 'Anh Hoàng Minh Đức',
    phone: '0918889999',
    email: 'minhduc.hoang@gmail.com',
    interested_tour_id: 'tour-1',
    interested_tour_name: 'Tour Ghép Thái Lan: Bangkok - Pattaya',
    source: 'chat',
    status: 'consulting',
    assigned_to: 'user-staff-1',
    assigned_staff_name: 'Nguyễn Thị Hải Yến',
    notes: 'Khách đi nhóm 4 người lớn vào cuối tuần này. Cần phòng đôi và ăn chay 1 người.',
    created_at: '2026-09-15T09:30:00Z',
    updated_at: '2026-09-16T08:15:00Z'
  },
  {
    id: 'lead-2',
    customer_name: 'Chị Mai Lan Anh',
    phone: '0982334455',
    interested_tour_id: 'tour-2',
    interested_tour_name: 'Tour Ghép Hà Giang Hùng Vĩ 3N2Đ',
    source: 'web_form',
    status: 'new',
    notes: 'Khách hỏi đặt 2 chỗ tour Hà Giang ngắm sông Nho Quế.',
    created_at: '2026-09-16T11:00:00Z'
  },
  {
    id: 'lead-3',
    customer_name: 'Bác Trần Văn Quý',
    phone: '0903445566',
    interested_tour_id: 'tour-3',
    interested_tour_name: 'Tour Ghép Hàn Quốc: Seoul - Nami',
    source: 'chat',
    status: 'won',
    assigned_to: 'user-staff-2',
    assigned_staff_name: 'Trần Hoài Nam',
    notes: 'Đã chốt cọc 50% cho gia đình 3 người đi Hàn Quốc ngày 25 tới.',
    created_at: '2026-09-14T14:20:00Z',
    updated_at: '2026-09-16T10:00:00Z'
  }
];

export const INITIAL_PARTNERS: PartnerSheet[] = [
  {
    id: 'sheet-partner-1',
    sheet_url: 'https://docs.google.com/spreadsheets/d/1demo-vietravel-sheet/edit',
    company_name: 'Công ty Lữ Hành Quốc Tế Á Châu',
    sales_rep_name: 'Ms. Thu Hương',
    sales_contact: '0933112233 (Zalo/Call)',
    notes: 'Chuyên tour Quốc Tế, Thái Lan, Sing-Mã, Hàn Quốc. Đặt chỗ nhanh, com tốt',
    last_synced: 'Hôm nay lúc 01:00 AM',
    status: 'SUCCESS'
  },
  {
    id: 'sheet-partner-2',
    sheet_url: 'https://docs.google.com/spreadsheets/d/1demo-saigontour-sheet/edit',
    company_name: 'Công ty Du Lịch Phương Bắc',
    sales_rep_name: 'Mr. Tuấn Anh',
    sales_contact: '0944556677 (Zalo)',
    notes: 'Chuyên tour Trong Nước khởi hành Hà Nội: Hà Giang, Sa Pa, Đà Nẵng',
    last_synced: 'Hôm nay lúc 01:00 AM',
    status: 'SUCCESS'
  }
];

export const INITIAL_KNOWLEDGE: KnowledgeItem[] = [
  {
    id: 'kb-1',
    category: 'Giá trẻ em',
    question: 'Chính sách tính giá vé cho trẻ em đi tour ghép như thế nào?',
    answer: 'Dạ thưa quý khách, chính sách vé trẻ em tại Travel TA được tính rõ ràng như sau:<br/>• <b>Dưới 2 tuổi:</b> Miễn phí tiền tour (chỉ tính phụ phí bảo hiểm/vé máy bay tượng trưng khoảng 500.000đ).<br/>• <b>Từ 2 đến dưới 10 tuổi:</b> Tính 75% giá vé người lớn (đầy đủ ghế ngồi trên xe, suất ăn riêng, ngủ chung giường cùng bố mẹ).<br/>• <b>Từ 10 tuổi trở lên:</b> Tính như giá người lớn ạ.',
    keywords: 'trẻ em, em bé, giá vé trẻ con, phụ thu trẻ em'
  },
  {
    id: 'kb-2',
    category: 'Thủ tục Visa',
    question: 'Đi tour du lịch Thái Lan, Singapore hoặc Malaysia có cần xin visa trước không?',
    answer: 'Dạ, đối với công dân Việt Nam mang hộ chiếu (Passport) còn hạn tối thiểu trên 6 tháng tính đến ngày kết thúc tour thì được <b>MIỄN VISA</b> khi nhập cảnh Thái Lan, Singapore và Malaysia (thời hạn lưu trú tối đa 30 ngày) anh/chị nhé!',
    keywords: 'visa thái lan, visa singapore, visa malaysia, hộ chiếu, passport'
  },
  {
    id: 'kb-3',
    category: 'Đặt cọc & Giữ chỗ',
    question: 'Quy trình đặt cọc và thanh toán tour ghép ra sao?',
    answer: 'Dạ thưa quý khách, quy trình giữ chỗ đoàn ghép rất đơn giản:<br/>1. Quý khách vui lòng đặt cọc 50% giá trị tour ngay khi chốt lịch giữ chỗ.<br/>2. Số tiền 50% còn lại thanh toán trước ngày khởi hành 7 ngày (tour trong nước) hoặc 10 ngày (tour quốc tế).<br/>Hệ thống sẽ gửi phiếu xác nhận đặt tour điện tử có mã giữ chỗ ngay khi nhận cọc ạ!',
    keywords: 'đặt cọc, giữ chỗ, thanh toán, hủy tour'
  }
];

// In-memory runtime cache for seamless local dev & Cloudflare Pages fallbacks
let globalTours = [...INITIAL_TOURS];
let globalLeads = [...INITIAL_LEADS];
let globalPartners = [...INITIAL_PARTNERS];
let globalKnowledge = [...INITIAL_KNOWLEDGE];
let globalSettings = { ...DEFAULT_SETTINGS };

// Initial mock users
let globalUsers: UserAccount[] = [
  {
    id: 'user-admin-1',
    username: 'admin',
    password: 'admin2026',
    role: 'admin',
    fullname: 'Quản Trị Viên Hệ Thống',
    phone: '0909888999',
    status: 'active',
    created_at: '2026-01-01T00:00:00Z'
  },
  {
    id: 'user-staff-1',
    username: 'sales_yen',
    password: '123456',
    role: 'staff',
    fullname: 'Nguyễn Thị Hải Yến (Sale 01)',
    phone: '0912345678',
    status: 'active',
    created_at: '2026-01-01T00:00:00Z'
  },
  {
    id: 'user-staff-2',
    username: 'sales_nam',
    password: '123456',
    role: 'staff',
    fullname: 'Trần Hoài Nam (Sale 02)',
    phone: '0987654321',
    status: 'active',
    created_at: '2026-01-01T00:00:00Z'
  }
];

export function getRuntimeDB() {
  return {
    getTours: () => {
      // Filter only real-time future departure dates
      const todayStr = new Date().toISOString().split('T')[0];
      return globalTours.filter(t => t.departure_date >= todayStr);
    },
    getAllToursAdmin: () => globalTours,
    getTourById: (id: string) => globalTours.find(t => t.id === id || t.slug === id),
    setTours: (tours: Tour[]) => { globalTours = tours; },
    addTour: (tour: Tour) => { globalTours.unshift(tour); },

    getLeads: () => globalLeads,
    addLead: (lead: Lead) => { globalLeads.unshift(lead); return lead; },
    updateLeadStatus: (id: string, status: Lead['status'], assigned_to?: string, note?: string) => {
      const lead = globalLeads.find(l => l.id === id);
      if (lead) {
        lead.status = status;
        if (assigned_to) lead.assigned_to = assigned_to;
        lead.updated_at = new Date().toISOString();
      }
      return lead;
    },

    getPartners: () => globalPartners,
    addPartner: (partner: PartnerSheet) => { globalPartners.push(partner); },
    updatePartnerContact: (id: string, sales_contact: string, sales_rep_name?: string) => {
      const p = globalPartners.find(item => item.id === id);
      if (p) {
        p.sales_contact = sales_contact;
        if (sales_rep_name) p.sales_rep_name = sales_rep_name;
      }
      return p;
    },

    getKnowledge: () => globalKnowledge,
    addKnowledge: (item: KnowledgeItem) => { globalKnowledge.unshift(item); },

    getSettings: () => globalSettings,
    updateSettings: (newSettings: Partial<BrandSettings>) => {
      globalSettings = { ...globalSettings, ...newSettings };
      return globalSettings;
    },

    // --- User Management ---
    getUsers: () => globalUsers.map(u => ({ ...u, password: undefined })), // Never expose password
    getUserById: (id: string) => globalUsers.find(u => u.id === id),
    getUserByUsername: (username: string) => globalUsers.find(u => u.username === username),
    validateLogin: (username: string, password: string) => {
      const user = globalUsers.find(u => u.username === username && u.password === password && u.status === 'active');
      return user ? { ...user, password: undefined } : null;
    },
    addUser: (user: UserAccount) => { globalUsers.push(user); return user; },
    updateUserStatus: (id: string, status: UserAccount['status'], approved_by?: string, notes?: string) => {
      const user = globalUsers.find(u => u.id === id);
      if (user) {
        user.status = status;
        if (approved_by) user.approved_by = approved_by;
        if (notes) user.notes = notes;
        if (status === 'active') user.approved_at = new Date().toISOString();
      }
      return user;
    },
    getPendingUsers: () => globalUsers.filter(u => u.status === 'pending').map(u => ({ ...u, password: undefined })),
  };
}
