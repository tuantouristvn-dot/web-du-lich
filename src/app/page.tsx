import Link from 'next/link';
import { getRuntimeDB } from '@/lib/db';
import { Tour } from '@/lib/types';
import {
  Flame, Calendar, Users, Star, ArrowRight, CheckCircle2,
  Compass, ShieldCheck, Award, MapPin, Clock, Zap, Globe,
  Phone, MessageCircle, ChevronRight
} from 'lucide-react';



function formatPrice(price: number) {
  return new Intl.NumberFormat('vi-VN').format(price) + 'â‚«';
}

function TourCard({ tour }: { tour: Tour }) {
  const departureDate = new Date(tour.departure_date);
  const formattedDate = departureDate.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const slotsPercent = Math.max(10, Math.round((tour.slots_left / tour.max_pax) * 100));
  const urgency = tour.slots_left <= 3 ? 'Gáº§n háº¿t chá»—!' : tour.slots_left <= 8 ? 'CĂ²n Ă­t chá»—' : 'CĂ²n chá»—';
  const urgencyColor = tour.slots_left <= 3 ? 'text-red-500' : tour.slots_left <= 8 ? 'text-orange-500' : 'text-green-600';

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:-translate-y-1">
      <div className="relative overflow-hidden h-48">
        <img
          src={tour.image_url || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=75'}
          alt={tour.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {tour.is_flash_sale ? (
            <span className="bg-red-500 text-white text-[10px] font-black px-2.5 py-1 rounded-full flex items-center gap-1 shadow-lg">
              <Flame size={10} /> FLASH SALE
            </span>
          ) : null}
          <span className="bg-blue-600/90 text-white text-[10px] font-bold px-2 py-1 rounded-full">
            {tour.region}
          </span>
        </div>

        {/* Duration badge */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur text-gray-800 text-[11px] font-bold px-2 py-1 rounded-full flex items-center gap-1">
          <Clock size={10} /> {tour.duration_days}N{tour.duration_days - 1}Ä
        </div>

        {/* Destination */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-white">
          <MapPin size={12} />
          <span className="text-sm font-bold drop-shadow">{tour.destination}</span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-bold text-gray-900 text-sm leading-tight line-clamp-2 mb-3 group-hover:text-blue-600 transition-colors">
          {tour.name}
        </h3>

        {/* Info row */}
        <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
          <span className="flex items-center gap-1"><Calendar size={11} /> {formattedDate}</span>
          <span className="flex items-center gap-1"><Users size={11} /> <span className={urgencyColor + ' font-semibold'}>{urgency}</span></span>
        </div>

        {/* Slots bar */}
        <div className="mb-3">
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${tour.slots_left <= 3 ? 'bg-red-500' : tour.slots_left <= 8 ? 'bg-orange-400' : 'bg-green-400'}`}
              style={{ width: `${slotsPercent}%` }}
            />
          </div>
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">Chá»‰ tá»«</div>
            <div className="text-xl font-black text-blue-600">{formatPrice(tour.public_price)}</div>
            <div className="text-[10px] text-gray-400">/ngÆ°á»i lá»›n</div>
          </div>
          <Link
            href={`/tours/${tour.id}`}
            className="bg-orange-500 hover:bg-orange-400 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
          >
            Äáº·t ngay <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default async function HomePage() {
  const db = getRuntimeDB();
  const allTours = db.getTours();
  const settings = db.getSettings();

  const flashSaleTours = allTours.filter(t => t.is_flash_sale).slice(0, 4);
  const domesticTours = allTours.filter(t => t.region === 'Trong nÆ°á»›c').slice(0, 6);
  const internationalTours = allTours.filter(t => t.region !== 'Trong nÆ°á»›c').slice(0, 6);
  const allFeatured = allTours.slice(0, 8);

  const destinations = [
    { name: 'ThĂ¡i Lan', img: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=600&q=75', count: '12 tour', flag: 'đŸ‡¹đŸ‡­' },
    { name: 'HĂ n Quá»‘c', img: 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?auto=format&fit=crop&w=600&q=75', count: '8 tour', flag: 'đŸ‡°đŸ‡·' },
    { name: 'HĂ  Giang', img: 'https://images.unsplash.com/photo-1545579133-99bb5ad189be?auto=format&fit=crop&w=600&q=75', count: '6 tour', flag: 'đŸ‡»đŸ‡³' },
    { name: 'Nháº­t Báº£n', img: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&w=600&q=75', count: '10 tour', flag: 'đŸ‡¯đŸ‡µ' },
    { name: 'ÄĂ  Náºµng', img: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=600&q=75', count: '5 tour', flag: 'đŸ‡»đŸ‡³' },
    { name: 'ChĂ¢u Ă‚u', img: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=600&q=75', count: '4 tour', flag: 'đŸŒ' },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TravelAgency',
    'name': settings.brand_name || 'TRAVEL TA',
    'description': 'Há»‡ thá»‘ng chuyĂªn phĂ¢n phá»‘i vĂ  Ä‘áº·t tour du lá»‹ch ghĂ©p hĂ ng Ä‘áº§u Viá»‡t Nam.',
    'telephone': settings.hotline,
    'url': 'https://travelta.vn',
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': settings.address,
      'addressCountry': 'VN'
    },
    'offers': allFeatured.map(t => ({
      '@type': 'Offer',
      'name': t.name,
      'price': t.public_price,
      'priceCurrency': 'VND',
      'availability': 'https://schema.org/InStock',
    }))
  };

  return (
    <div className="bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* ===== HERO SECTION ===== */}
      <section className="relative min-h-[620px] flex items-center bg-slate-900 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=2000&q=80"
            alt="Du lá»‹ch tour ghĂ©p chuyĂªn nghiá»‡p"
            className="w-full h-full object-cover object-center opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
        </div>

        <div className="container mx-auto px-4 relative z-10 py-20">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-orange-500 text-white px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider mb-6 shadow-lg">
              <Zap size={12} /> Máº¡ng LÆ°á»›i Tour GhĂ©p HĂ ng Äáº§u Viá»‡t Nam
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
              KHĂM PHĂ<br />
              <span className="text-orange-400">THáº¾ GIá»I</span><br />
              CĂ™NG CHĂNG TĂ”I
            </h1>

            <p className="text-lg text-slate-300 leading-relaxed mb-8 max-w-xl">
              HĂ ng trÄƒm tuyáº¿n tour ghĂ©p trá»n gĂ³i trong nÆ°á»›c vĂ  quá»‘c táº¿. Khá»Ÿi hĂ nh hĂ ng tuáº§n, giĂ¡ tá»‘t nháº¥t, dá»‹ch vá»¥ chuáº©n sao.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/tours"
                className="bg-orange-500 hover:bg-orange-400 text-white font-black px-8 py-4 rounded-2xl transition-all shadow-xl shadow-orange-500/30 flex items-center gap-2 text-sm"
              >
                Xem Táº¥t Cáº£ Tour <ArrowRight size={18} />
              </Link>
              <a
                href={`tel:${settings.hotline}`}
                className="bg-white/10 backdrop-blur hover:bg-white/20 text-white font-bold px-6 py-4 rounded-2xl transition-all border border-white/20 flex items-center gap-2 text-sm"
              >
                <Phone size={16} /> {settings.hotline}
              </a>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap gap-6 mt-10">
              {[
                { icon: 'âœ“', label: '100% Khá»Ÿi hĂ nh Ä‘Ăºng háº¹n' },
                { icon: 'â˜…', label: 'Dá»‹ch vá»¥ 4-5 sao' },
                { icon: 'đŸ›¡', label: 'Báº£o hiá»ƒm toĂ n hĂ nh trĂ¬nh' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-white/80 text-sm">
                  <span className="text-orange-400 font-black">{item.icon}</span>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== SEARCH BAR ===== */}
      <section className="bg-white shadow-xl border-b border-gray-100 sticky top-16 z-30">
        <div className="container mx-auto px-4">
          <form action="/tours" method="GET" className="grid grid-cols-2 md:grid-cols-4 gap-0 divide-x divide-gray-100">
            <div className="p-4">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Äiá»ƒm Ä‘áº¿n</label>
              <select name="destination" className="w-full text-sm font-semibold text-gray-800 focus:outline-none bg-transparent">
                <option value="">Táº¥t cáº£ Ä‘iá»ƒm Ä‘áº¿n</option>
                <option>ThĂ¡i Lan</option><option>HĂ n Quá»‘c</option><option>Nháº­t Báº£n</option>
                <option>HĂ  Giang</option><option>ÄĂ  Náºµng</option><option>PhĂº Quá»‘c</option>
              </select>
            </div>
            <div className="p-4">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Khu vá»±c</label>
              <select name="region" className="w-full text-sm font-semibold text-gray-800 focus:outline-none bg-transparent">
                <option value="">Trong nÆ°á»›c & Quá»‘c táº¿</option>
                <option>Trong nÆ°á»›c</option><option>ÄĂ´ng Nam Ă</option><option>ChĂ¢u Ă</option>
                <option>ChĂ¢u Ă‚u</option>
              </select>
            </div>
            <div className="p-4">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Sá»‘ ngĂ y</label>
              <select name="duration" className="w-full text-sm font-semibold text-gray-800 focus:outline-none bg-transparent">
                <option value="">Má»i thá»i gian</option>
                <option value="3">3 ngĂ y 2 Ä‘Ăªm</option><option value="4">4 ngĂ y 3 Ä‘Ăªm</option>
                <option value="5">5 ngĂ y 4 Ä‘Ăªm</option><option value="7">7 ngĂ y trá»Ÿ lĂªn</option>
              </select>
            </div>
            <div className="p-3 flex items-center">
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-2.5 rounded-xl text-sm transition flex items-center justify-center gap-2">
                <Compass size={16} /> TĂ¬m Tour
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* ===== FLASH SALE ===== */}
      {flashSaleTours.length > 0 && (
        <section className="py-12 bg-gradient-to-r from-red-600 to-orange-500">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-xl">
                  <Flame size={22} className="text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white">FLASH SALE</h2>
                  <p className="text-red-100 text-xs">Æ¯u Ä‘Ă£i giá»›i háº¡n â€” Sá»‘ lÆ°á»£ng cĂ³ háº¡n</p>
                </div>
              </div>
              <Link href="/tours?flash=true" className="text-white/90 hover:text-white font-bold text-sm flex items-center gap-1 bg-white/10 px-4 py-2 rounded-xl">
                Xem táº¥t cáº£ <ChevronRight size={16} />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {flashSaleTours.map(tour => <TourCard key={tour.id} tour={tour} />)}
            </div>
          </div>
        </section>
      )}

      {/* ===== POPULAR DESTINATIONS ===== */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider mb-3">
              <Globe size={12} /> Äiá»ƒm Äáº¿n Ná»•i Báº­t
            </div>
            <h2 className="text-3xl font-black text-gray-900">KhĂ¡m PhĂ¡ Tháº¿ Giá»›i</h2>
            <p className="text-gray-500 mt-2 text-sm max-w-xl mx-auto">Tá»« miá»n nĂºi hĂ¹ng vÄ© trong nÆ°á»›c Ä‘áº¿n cĂ¡c thĂ nh phá»‘ phá»“n hoa chĂ¢u Ă â€” chĂºng tĂ´i cĂ³ tour ghĂ©p cho má»i hĂ nh trĂ¬nh</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {destinations.map((dest, i) => (
              <Link
                key={i}
                href={`/tours?destination=${encodeURIComponent(dest.name)}`}
                className="group relative rounded-2xl overflow-hidden h-44 sm:h-56 cursor-pointer"
              >
                <img src={dest.img} alt={dest.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="text-2xl mb-1">{dest.flag}</div>
                  <h3 className="text-white font-black text-lg leading-tight">{dest.name}</h3>
                  <p className="text-white/70 text-xs mt-0.5">{dest.count} ghĂ©p Ä‘ang má»Ÿ</p>
                </div>
                <div className="absolute top-3 right-3 bg-white/20 backdrop-blur text-white text-[10px] font-bold px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                  Xem ngay â†’
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== DOMESTIC TOURS ===== */}
      {domesticTours.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-black text-orange-500 uppercase tracking-wider mb-2">
                  <MapPin size={12} /> Tour Trong NÆ°á»›c
                </div>
                <h2 className="text-2xl font-black text-gray-900">Tour GhĂ©p Ná»™i Äá»‹a Ná»•i Báº­t</h2>
              </div>
              <Link href="/tours?region=Trong+n%C6%B0%E1%BB%9Bc" className="hidden sm:flex text-blue-600 hover:text-blue-500 font-bold text-sm items-center gap-1">
                Xem táº¥t cáº£ <ArrowRight size={15} />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {domesticTours.map(tour => <TourCard key={tour.id} tour={tour} />)}
            </div>
          </div>
        </section>
      )}

      {/* ===== INTERNATIONAL TOURS ===== */}
      {internationalTours.length > 0 && (
        <section className="py-16 bg-slate-50">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-black text-blue-600 uppercase tracking-wider mb-2">
                  <Globe size={12} /> Tour Quá»‘c Táº¿
                </div>
                <h2 className="text-2xl font-black text-gray-900">Tour GhĂ©p Quá»‘c Táº¿ Äá»‰nh Cao</h2>
              </div>
              <Link href="/tours?region=international" className="hidden sm:flex text-blue-600 hover:text-blue-500 font-bold text-sm items-center gap-1">
                Xem táº¥t cáº£ <ArrowRight size={15} />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {internationalTours.map(tour => <TourCard key={tour.id} tour={tour} />)}
            </div>
          </div>
        </section>
      )}

      {/* ===== WHY CHOOSE US ===== */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-gray-900 mb-3">Táº¡i Sao Chá»n ChĂºng TĂ´i?</h2>
            <p className="text-gray-500 text-sm max-w-lg mx-auto">ChĂºng tĂ´i khĂ´ng chá»‰ bĂ¡n tour â€” chĂºng tĂ´i táº¡o ra nhá»¯ng hĂ nh trĂ¬nh Ä‘Ă¡ng nhá»› vá»›i dá»‹ch vá»¥ táº­n tĂ¢m nháº¥t</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: ShieldCheck, color: 'blue', title: '100% Khá»Ÿi HĂ nh', desc: 'Cam káº¿t khá»Ÿi hĂ nh Ä‘Ăºng háº¹n, khĂ´ng lo há»§y tour Ä‘á»™t ngá»™t' },
              { icon: Award, color: 'orange', title: 'GiĂ¡ Tá»‘t Nháº¥t', desc: 'Cá»™ng tĂ¡c viĂªn hĂ ng trÄƒm cĂ´ng ty, giĂ¡ cáº¡nh tranh nháº¥t thá»‹ trÆ°á»ng' },
              { icon: Users, color: 'green', title: 'Tour GhĂ©p Cháº¥t', desc: 'ÄoĂ n ghĂ©p vÄƒn minh, hÆ°á»›ng dáº«n viĂªn chuyĂªn nghiá»‡p 24/7' },
              { icon: MessageCircle, color: 'purple', title: 'AI TÆ° Váº¥n 24/7', desc: 'Chatbot AI luĂ´n sáºµn sĂ ng tÆ° váº¥n vĂ  giáº£i Ä‘Ă¡p má»i tháº¯c máº¯c' },
            ].map((item, i) => (
              <div key={i} className="text-center group">
                <div className={`w-16 h-16 rounded-2xl bg-${item.color}-50 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                  <item.icon size={28} className={`text-${item.color}-500`} />
                </div>
                <h3 className="font-black text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA BANNER ===== */}
      <section className="py-16 bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-black text-white mb-4">Sáºµn SĂ ng KhĂ¡m PhĂ¡?</h2>
          <p className="text-blue-200 mb-8 max-w-lg mx-auto">HĂ ng trÄƒm Ä‘oĂ n ghĂ©p Ä‘ang chá» báº¡n. Äáº·t ngay hĂ´m nay Ä‘á»ƒ cĂ³ giĂ¡ tá»‘t nháº¥t!</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/tours" className="bg-white text-blue-700 font-black px-8 py-4 rounded-2xl hover:bg-blue-50 transition shadow-xl text-sm flex items-center gap-2">
              <Compass size={18} /> Xem Táº¥t Cáº£ Tour
            </Link>
            <a href={`https://zalo.me/${settings.hotline?.replace(/\s/g, '')}`} target="_blank" rel="noopener noreferrer"
              className="bg-white/10 backdrop-blur text-white font-black px-8 py-4 rounded-2xl hover:bg-white/20 transition border border-white/20 text-sm flex items-center gap-2">
              <MessageCircle size={18} /> TÆ° Váº¥n Miá»…n PhĂ­
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

