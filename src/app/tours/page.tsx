import Link from 'next/link';
import { getRuntimeDB } from '@/lib/db';
import { Tour } from '@/lib/types';
import { Calendar, Users, Flame, Search, ArrowRight } from 'lucide-react';



export default async function ToursCatalogPage({
  searchParams
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const params = await searchParams;
  const regionParam = params.region;
  const destinationParam = params.destination || params.q;
  const flashSaleParam = params.flash_sale;

  const db = getRuntimeDB();
  let tours = db.getTours();

  // Apply real-time search & filters
  if (regionParam) {
    tours = tours.filter(t => t.region.toLowerCase().includes(regionParam.toLowerCase()));
  }
  if (destinationParam) {
    const q = destinationParam.toLowerCase();
    tours = tours.filter(t => 
      t.destination.toLowerCase().includes(q) || 
      t.name.toLowerCase().includes(q) ||
      (t.tour_details && t.tour_details.toLowerCase().includes(q))
    );
  }
  if (flashSaleParam === 'true') {
    tours = tours.filter(t => t.is_flash_sale);
  }

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="text-xs text-gray-500 mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-blue-600">Trang chá»§</Link>
          <span>/</span>
          <span className="font-bold text-gray-800">
            {flashSaleParam === 'true' ? 'Tour Giá» ChĂ³t' : regionParam ? `Tour ${regionParam}` : 'Táº¥t Cáº£ Tour GhĂ©p'}
          </span>
        </div>

        {/* Header Title */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-blue-900">
              {flashSaleParam === 'true' ? 'đŸ”¥ Tour GhĂ©p Giá» ChĂ³t GiĂ¡ Tá»‘t Nháº¥t' : destinationParam ? `Káº¿t Quáº£ TĂ¬m Kiáº¿m: "${destinationParam}"` : 'Danh Má»¥c Tour GhĂ©p Khá»Ÿi HĂ nh HĂ ng Tuáº§n'}
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              TĂ¬m tháº¥y <b>{tours.length}</b> tour ghĂ©p cĂ²n chá»— khá»Ÿi hĂ nh trong thá»i gian tá»›i.
            </p>
          </div>

          {/* Quick Filter Tabs */}
          <div className="flex flex-wrap gap-2 text-xs font-bold">
            <Link 
              href="/tours" 
              className={`px-3.5 py-2 rounded-lg border transition ${!regionParam && !flashSaleParam ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'}`}
            >
              Táº¥t Cáº£
            </Link>
            <Link 
              href="/tours?region=Trong nÆ°á»›c" 
              className={`px-3.5 py-2 rounded-lg border transition ${regionParam === 'Trong nÆ°á»›c' ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'}`}
            >
              Trong NÆ°á»›c
            </Link>
            <Link 
              href="/tours?region=ÄĂ´ng Nam Ă" 
              className={`px-3.5 py-2 rounded-lg border transition ${regionParam === 'ÄĂ´ng Nam Ă' ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'}`}
            >
              ÄĂ´ng Nam Ă
            </Link>
            <Link 
              href="/tours?region=ChĂ¢u Ă" 
              className={`px-3.5 py-2 rounded-lg border transition ${regionParam === 'ChĂ¢u Ă' ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'}`}
            >
              ChĂ¢u Ă
            </Link>
            <Link 
              href="/tours?flash_sale=true" 
              className={`px-3.5 py-2 rounded-lg border transition flex items-center gap-1 ${flashSaleParam === 'true' ? 'bg-orange-600 text-white border-orange-600' : 'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100'}`}
            >
              <Flame size={13} /> Giá» ChĂ³t
            </Link>
          </div>
        </div>

        {/* Tour Grid */}
        {tours.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tours.map(tour => (
              <div key={tour.id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 overflow-hidden flex flex-col group">
                <div className="relative h-52 overflow-hidden bg-slate-200">
                  <img
                    src={tour.image_url || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'}
                    alt={tour.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-blue-900/90 text-white text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {tour.region}
                  </div>
                  <div className="absolute bottom-3 left-3 bg-white/95 text-gray-800 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow">
                    <Calendar size={13} className="text-orange-600" />
                    {new Date(tour.departure_date).toLocaleDateString('vi-VN')}
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
                      <span className="font-bold text-blue-600">{tour.tour_code}</span>
                      <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                        <Users size={12} /> CĂ²n {tour.slots_left} chá»—
                      </span>
                    </div>

                    <Link href={`/tours/${tour.id}`}>
                      <h3 className="font-bold text-gray-800 text-base leading-snug line-clamp-2 hover:text-blue-600 transition">
                        {tour.name}
                      </h3>
                    </Link>

                    <p className="text-xs text-gray-500 mt-2 line-clamp-2 leading-relaxed">
                      {tour.tour_details}
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-gray-100 flex items-end justify-between gap-2">
                    <div>
                      <div className="text-[11px] text-gray-400 font-medium">GiĂ¡ bĂ¡n láº» (KhĂ¡ch)</div>
                      <div className="text-xl font-black text-orange-600 tracking-tight">
                        {new Intl.NumberFormat('vi-VN').format(tour.public_price)} <span className="text-xs font-normal text-gray-500">Ä‘</span>
                      </div>
                    </div>

                    <Link
                      href={`/tours/${tour.id}`}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition shadow-sm"
                    >
                      Xem Chi Tiáº¿t
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-2xl border border-gray-200">
            <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search size={32} />
            </div>
            <h3 className="text-lg font-bold text-gray-800">KhĂ´ng tĂ¬m tháº¥y tour phĂ¹ há»£p</h3>
            <p className="text-sm text-gray-500 max-w-md mx-auto mt-2">
              HĂ£y thá»­ chá»n tá»« khĂ³a khĂ¡c hoáº·c báº¥m chat vá»›i Trá»£ lĂ½ AI á»Ÿ gĂ³c dÆ°á»›i Ä‘á»ƒ Ä‘Æ°á»£c tÆ° váº¥n lá»‹ch trĂ¬nh theo yĂªu cáº§u nhĂ©!
            </p>
            <Link href="/tours" className="inline-block mt-6 px-6 py-2.5 bg-blue-600 text-white font-bold text-sm rounded-lg hover:bg-blue-700 transition">
              Xem toĂ n bá»™ tour
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

