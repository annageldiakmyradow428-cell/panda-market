import React, { useState, useMemo } from 'react';

// ==========================================
// CONSTANTS & TRANSLATIONS
// ==========================================
const EXCH_RATE = 3.5; // 1 Yuan = 3.5 TMT

const SHIPPING_METHODS = {
  truck_std: { id: 'truck_std', rate: 40, days: '35-40', ru: 'Авто 1 Стандарт', tr: 'Kamyon 1 Standart' },
  truck_cos: { id: 'truck_cos', rate: 50, days: '35-40', ru: 'Авто 2 Косметика/Батарейки', tr: 'Kamyon 2 Makyaj/Batarya' },
  plane_std: { id: 'plane_std', rate: 140, days: '10-15', ru: 'Авиа 1 Стандарт', tr: 'Uçak 1 Standart' },
  plane_exp: { id: 'plane_exp', rate: 200, days: '7-10', ru: 'Авиа Экспресс', tr: 'Uçak Ekspres' },
};

const TIKTOK_CATALOG = [
  { id: 1, ru: 'Смарт-часы Ultra', tr: 'Akıllı Saat Ultra', yuanCost: 45, sellTmt: 350, weight: 0.35 },
  { id: 2, ru: 'Беспроводные наушники Pro', tr: 'Kablosuz Kulaklık Pro', yuanCost: 25, sellTmt: 220, weight: 0.2 },
  { id: 3, ru: 'Магнитный Powerbank', tr: 'Manyetik Powerbank', yuanCost: 35, sellTmt: 290, weight: 0.4, forceMethod: 'truck_cos' },
  { id: 4, ru: 'Трендовые Солнцезащитные Очки', tr: 'Trend Güneş Gözlüğü', yuanCost: 12, sellTmt: 140, weight: 0.15 },
];

const TRANSLATIONS = {
  RU: {
    brand: 'PANDA MARKET',
    tagline: 'Панель Управления Импортом',
    login: 'Вход в систему',
    username: 'Имя пользователя',
    password: 'Пароль',
    signIn: 'Войти',
    registerAgent: 'Регистрация нового агента',
    fullName: 'Полное имя',
    phone: 'Номер телефона',
    welayat: 'Велаят',
    district: 'Этрап / Район',
    submitReg: 'Завершить регистрацию',
    logout: 'Выйти',
    agentDash: 'Панель Агента',
    adminDash: 'Панель Администратора',
    catalogTab: 'Каталог TikTok',
    customTab: 'Индивидуальный Заказ',
    pinduoduoLink: 'Ссылка на Pinduoduo',
    description: 'Описание товара',
    yuanCost: 'Цена в Юанях (¥)',
    sellPrice: 'Цена продажи (TMT)',
    weightKg: 'Вес (КГ)',
    shipMethod: 'Способ доставки',
    estDelivery: 'Срок доставки',
    liveCalc: 'Предварительный Расчет',
    shipCost: 'Стоимость доставки',
    netProfit: 'Чистая прибыль',
    yourSplit: 'Ваша доля (50%)',
    submitOrder: 'Отправить заказ в систему',
    orderHistory: 'История ваших заказов',
    product: 'Товар',
    cost: 'Себестоимость',
    sell: 'Продажа',
    weight: 'Вес',
    shipping: 'Доставка',
    profit: 'Прибыль',
    status: 'Статус',
    financials: 'Финансовые показатели',
    grossRev: 'Валовая выручка',
    adminProfit: 'Доля Администратора',
    agentProfit: 'Доля Агентов',
    weeklyMetrics: 'Еженедельные метрики',
    chartNote: 'Автоматическое переключение на месячный тренд через 30 дней',
    auditQueue: 'Очередь аудита заказов',
    warehouseData: 'Данные склада',
    confirmAudit: 'Подтвердить Аудит',
    agentMgmt: 'Управление Агентами',
    orderCount: 'Заказы',
    daysIdle: 'Дней простоя',
    copyScript: 'Копировать скрипт увольнения',
    scriptCopied: 'Скрипт скопирован!',
    firingTemplate: 'Привет! Заметили, что твой аккаунт Panda Market не активен уже более 3 недель. Нам нужно освободить место для активных агентов, генерирующих трафик в TikTok. Желаем удачи в будущих проектах!',
    statuses: {
      pending: 'Ожидает аудита',
      ready: 'Готов к выкупу',
      ordered: 'Выкуплен',
      arrived: 'Прибыл на склад',
      delivered: 'Доставлен клиенту'
    }
  },
  TR: {
    brand: 'PANDA MARKET',
    tagline: 'İthalat Yönetim Paneli',
    login: 'Sistem Girişi',
    username: 'Kullanıcı Adı',
    password: 'Şifre',
    signIn: 'Giriş Yap',
    registerAgent: 'Yeni Temsilci Kaydı',
    fullName: 'Adı Soyadı',
    phone: 'Telefon Numarası',
    welayat: 'Vilayet',
    district: 'İlçe / Bölge',
    submitReg: 'Kaydı Tamamla',
    logout: 'Çıkış Yap',
    agentDash: 'Temsilci Paneli',
    adminDash: 'Yönetici Paneli',
    catalogTab: 'TikTok Kataloğu',
    customTab: 'Özel Sipariş',
    pinduoduoLink: 'Pinduoduo Linki',
    description: 'Ürün Açıklaması',
    yuanCost: 'Yuan Maliyeti (¥)',
    sellPrice: 'Yerel Satış Fiyatı (TMT)',
    weightKg: 'Ağırlık (KG)',
    shipMethod: 'Gönderim Türü',
    estDelivery: 'Teslimat Süresi',
    liveCalc: 'Canlı Hesaplama Modülü',
    shipCost: 'Kargo Maliyeti',
    netProfit: 'Net Kâr',
    yourSplit: 'Payınız (50%)',
    submitOrder: 'Siparişi Sisteme Gönder',
    orderHistory: 'Sipariş Geçmişiniz',
    product: 'Ürün',
    cost: 'Maliyet',
    sell: 'Satış',
    weight: 'Ağırlık',
    shipping: 'Kargo',
    profit: 'Kâr',
    status: 'Durum',
    financials: 'Finansal Göstergeler',
    grossRev: 'Brüt Hasılat',
    adminProfit: 'Yönetici Kâr Payı',
    agentProfit: 'Temsilci Kâr Payı',
    weeklyMetrics: 'Haftalık Metrikler',
    chartNote: '30 gün sonra otomatik olarak aylık trend grafiğine geçiş yapar',
    auditQueue: 'Sipariş Onay Sırası',
    warehouseData: 'Depo Verileri',
    confirmAudit: 'Denetimi Onayla',
    agentMgmt: 'Temsilci Yönetimi',
    orderCount: 'Siparişler',
    daysIdle: 'İnaktif Gün',
    copyScript: 'TikTok Fesih Metnini Kopyala',
    scriptCopied: 'Metin kopyalandı!',
    firingTemplate: 'Merhaba! Panda Market hesabınızın 3 haftadan uzun süredir inaktif olduğunu fark ettik. TikTok trafiği oluşturan aktif temsilcilere yer açmamız gerekiyor. Gelecek projelerinizde başarılar dileriz!',
    statuses: {
      pending: 'Denetim Bekliyor',
      ready: 'Satın Almaya Hazır',
      ordered: 'Sipariş Edildi',
      arrived: 'Depoya Ulaştı',
      delivered: 'Teslim Edildi'
    }
  }
};

// ==========================================
// CORE HELPERS
// ==========================================
const calculateMetrics = (yuanCost, sellTmt, weight, methodId) => {
  const method = SHIPPING_METHODS[methodId] || SHIPPING_METHODS.truck_std;
  const shippingCost = weight * method.rate;
  const productCostTmt = yuanCost * EXCH_RATE;
  const netProfit = sellTmt - productCostTmt - shippingCost;
  const split = netProfit > 0 ? netProfit / 2 : 0;
  return {
    shippingCost: Math.max(0, shippingCost).toFixed(2),
    netProfit: netProfit.toFixed(2),
    split: split.toFixed(2)
  };
};

export default function PandaMarketApp() {
  // Global States
  const [lang, setLang] = useState('RU');
  const [user, setUser] = useState(null); // { username, role: 'admin' | 'agent', name }
  const [view, setView] = useState('login'); // login | register | dashboard

  // Login Form States
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  
  // Registration Form States
  const [regForm, setRegForm] = useState({ name: '', phone: '', welayat: '', district: '' });

  // Agent Panel States
  const [agentTab, setAgentTab] = useState('catalog'); // catalog | custom
  const [selectedCatalogItem, setSelectedCatalogItem] = useState(TIKTOK_CATALOG[0].id);
  const [catalogShipMethod, setCatalogShipMethod] = useState('truck_std');
  
  const [customForm, setCustomForm] = useState({
    link: '', desc: '', yuanCost: '', sellTmt: '', weight: '', shipMethod: 'truck_std'
  });

  // Database / Global App State Mocks
  const [orders, setOrders] = useState([
    { id: 101, agent: 'Arslan M.', product: 'Smart Watch Ultra', yuanCost: 45, sellTmt: 350, weight: 0.35, shipMethod: 'plane_std', shippingCost: 49.00, netProfit: 143.50, split: 71.75, status: 'ordered', timestamp: '2026-06-25' },
    { id: 102, agent: 'Jennet K.', product: 'Custom PDD Shoes', yuanCost: 80, sellTmt: 500, weight: 1.2, shipMethod: 'truck_std', shippingCost: 48.00, netProfit: 172.00, split: 86.00, status: 'pending', timestamp: '2026-06-27' },
    { id: 103, agent: 'Arslan M.', product: 'Powerbank Pro', yuanCost: 35, sellTmt: 290, weight: 0.4, shipMethod: 'truck_cos', shippingCost: 20.00, netProfit: 147.50, split: 73.75, status: 'delivered', timestamp: '2026-06-20' },
  ]);

  const [agents, setAgents] = useState([
    { name: 'Arslan M.', phone: '+993 61 123456', location: 'Ashgabat', ordersCount: 14, idleDays: 2 },
    { name: 'Jennet K.', phone: '+993 65 654321', location: 'Mary', ordersCount: 5, idleDays: 1 },
    { name: 'Dovlet B.', phone: '+993 62 789012', location: 'Lebap', ordersCount: 2, idleDays: 24 }, // Over 3 weeks idle
  ]);

  const t = TRANSLATIONS[lang];

  // ==========================================
  // HANDLERS
  // ==========================================
  const handleLogin = (e) => {
    e.preventDefault();
    if (usernameInput.toLowerCase() === 'admin' && passwordInput === 'panda123') {
      const adminUser = { username: 'admin', role: 'admin', name: 'System Administrator' };
      setUser(adminUser);
      setView('dashboard');
    } else if (usernameInput.trim() !== '' && passwordInput !== '') {
      // Treat as potential new or existing agent
      const existingAgent = agents.find(a => a.name.toLowerCase().includes(usernameInput.toLowerCase()));
      if (existingAgent) {
        setUser({ username: usernameInput, role: 'agent', name: existingAgent.name });
        setView('dashboard');
      } else {
        setView('register');
      }
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    const newAgent = {
      name: regForm.name,
      phone: regForm.phone,
      location: `${regForm.welayat}, ${regForm.district}`,
      ordersCount: 0,
      idleDays: 0
    };
    setAgents([newAgent, ...agents]);
    setUser({ username: regForm.name.toLowerCase().replace(/\s+/g, ''), role: 'agent', name: regForm.name });
    setView('dashboard');
  };

  const handleCatalogSubmit = () => {
    const item = TIKTOK_CATALOG.find(i => i.id === Number(selectedCatalogItem));
    const methodId = item.forceMethod || catalogShipMethod;
    const metrics = calculateMetrics(item.yuanCost, item.sellTmt, item.weight, methodId);
    
    const newOrder = {
      id: Date.now(),
      agent: user.name,
      product: lang === 'RU' ? item.ru : item.tr,
      yuanCost: item.yuanCost,
      sellTmt: item.sellTmt,
      weight: item.weight,
      shipMethod: methodId,
      shippingCost: parseFloat(metrics.shippingCost),
      netProfit: parseFloat(metrics.netProfit),
      split: parseFloat(metrics.split),
      status: 'ready', // Catalog products bypass initial admin verification parameters
      timestamp: new Date().toISOString().split('T')[0]
    };

    setOrders([newOrder, ...orders]);
    // Update agent orders count
    setAgents(agents.map(a => a.name === user.name ? { ...a, ordersCount: a.ordersCount + 1, idleDays: 0 } : a));
    alert(lang === 'RU' ? 'Заказ успешно добавлен!' : 'Sipariş başarıyla eklendi!');
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    const metrics = calculateMetrics(
      Number(customForm.yuanCost),
      Number(customForm.sellTmt),
      Number(customForm.weight),
      customForm.shipMethod
    );

    const newOrder = {
      id: Date.now(),
      agent: user.name,
      product: customForm.desc || 'Custom Pinduoduo Item',
      yuanCost: Number(customForm.yuanCost),
      sellTmt: Number(customForm.sellTmt),
      weight: Number(customForm.weight),
      shipMethod: customForm.shipMethod,
      shippingCost: parseFloat(metrics.shippingCost),
      netProfit: parseFloat(metrics.netProfit),
      split: parseFloat(metrics.split),
      status: 'pending',
      timestamp: new Date().toISOString().split('T')[0]
    };

    setOrders([newOrder, ...orders]);
    setCustomForm({ link: '', desc: '', yuanCost: '', sellTmt: '', weight: '', shipMethod: 'truck_std' });
    alert(lang === 'RU' ? 'Заказ отправлен на аудит администратора.' : 'Sipariş yönetici denetimine gönderildi.');
  };

  const handleAdminUpdateField = (orderId, field, value) => {
    setOrders(orders.map(order => {
      if (order.id === orderId) {
        const updatedOrder = { ...order, [field]: Number(value) };
        const metrics = calculateMetrics(updatedOrder.yuanCost, updatedOrder.sellTmt, updatedOrder.weight, updatedOrder.shipMethod);
        return {
          ...updatedOrder,
          shippingCost: parseFloat(metrics.shippingCost),
          netProfit: parseFloat(metrics.netProfit),
          split: parseFloat(metrics.split)
        };
      }
      return order;
    }));
  };

  const handleConfirmAudit = (orderId) => {
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: 'ready' } : o));
  };

  const copyFiringScript = (agentName) => {
    navigator.clipboard.writeText(t.firingTemplate);
    alert(`${t.scriptCopied}\n\n"${t.firingTemplate}"`);
  };

  // ==========================================
  // DERIVED FINANCIAL STATES (ADMIN)
  // ==========================================
  const financials = useMemo(() => {
    return orders.reduce((acc, curr) => {
      acc.gross += curr.sellTmt;
      if (curr.netProfit > 0) {
        acc.adminShare += curr.split; // 50%
        acc.agentShare += curr.split; // 50%
      }
      return acc;
    }, { gross: 0, adminShare: 0, agentShare: 0 });
  }, [orders]);

  // Live calculation block state for the agent's custom form
  const liveCustomMetrics = useMemo(() => {
    return calculateMetrics(
      Number(customForm.yuanCost || 0),
      Number(customForm.sellTmt || 0),
      Number(customForm.weight || 0),
      customForm.shipMethod
    );
  }, [customForm]);

  return (
    <div className="min-h-screen bg-[#000000] text-neutral-200 font-sans antialiased selection:bg-[#A3E635] selection:text-black">
      
      {/* GLOBAL HEADER BAR */}
      <header className="sticky top-0 z-50 bg-[#000000]/90 backdrop-blur-md border-b border-neutral-800 px-4 py-3 flex items-center justify-between max-w-md mx-auto w-full">
        <div className="flex items-center space-x-2">
          <span className="text-xl font-black tracking-tighter text-[#A3E635]">🐼 {t.brand}</span>
        </div>
        
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setLang(lang === 'RU' ? 'TR' : 'RU')}
            className="bg-neutral-900 border border-neutral-700 text-xs font-bold px-2.5 py-1 rounded text-[#A3E635] hover:bg-neutral-800 transition"
          >
            {lang === 'RU' ? 'RU / TR' : 'TR / RU'} ({lang})
          </button>
          
          {user && (
            <button 
              onClick={() => { setUser(null); setView('login'); }}
              className="text-xs bg-red-950/40 border border-red-900 text-red-400 px-2 py-1 rounded hover:bg-red-900/40 transition"
            >
              {t.logout}
            </button>
          )}
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 pb-24">
        
        {/* VIEW 1: LOGIN SCREEN */}
        {view === 'login' && (
          <div className="bg-neutral-950 border border-neutral-900 rounded-xl p-6 shadow-2xl space-y-6">
            <div className="text-center space-y-1">
              <h2 className="text-2xl font-bold tracking-tight text-white">{t.login}</h2>
              <p className="text-xs text-neutral-500">{t.tagline}</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-neutral-400 uppercase tracking-wider mb-1.5">{t.username}</label>
                <input 
                  type="text" 
                  required
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  placeholder="e.g., admin or agentname"
                  className="w-full bg-[#000000] border border-neutral-800 rounded-lg px-3 py-2.5 text-white placeholder-neutral-700 focus:outline-none focus:border-[#A3E635] transition text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-neutral-400 uppercase tracking-wider mb-1.5">{t.password}</label>
                <input 
                  type="password" 
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#000000] border border-neutral-800 rounded-lg px-3 py-2.5 text-white placeholder-neutral-700 focus:outline-none focus:border-[#A3E635] transition text-sm"
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-[#A3E635] text-black font-bold py-3 rounded-lg hover:bg-[#b4f542] transition tracking-tight text-sm shadow-lg shadow-[#A3E635]/10"
              >
                {t.signIn}
              </button>
            </form>

            <div className="border-t border-neutral-900 pt-4 text-center">
              <p className="text-[11px] font-mono text-neutral-600">Demo Access: admin / panda123</p>
            </div>
          </div>
        )}

        {/* VIEW 2: REGISTRATION SCREEN FOR NEW AGENT */}
        {view === 'register' && (
          <div className="bg-neutral-950 border border-neutral-900 rounded-xl p-6 shadow-2xl space-y-6">
            <div className="space-y-1">
              <h2 className="text-xl font-bold tracking-tight text-white">{t.registerAgent}</h2>
              <p className="text-xs text-[#A3E635] font-mono">{usernameInput}</p>
            </div>

            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-neutral-400 uppercase mb-1">{t.fullName}</label>
                <input 
                  type="text" required
                  value={regForm.name}
                  onChange={(e) => setRegForm({...regForm, name: e.target.value})}
                  className="w-full bg-[#000000] border border-neutral-800 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#A3E635]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-neutral-400 uppercase mb-1">{t.phone}</label>
                <input 
                  type="text" required placeholder="+993..."
                  value={regForm.phone}
                  onChange={(e) => setRegForm({...regForm, phone: e.target.value})}
                  className="w-full bg-[#000000] border border-neutral-800 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#A3E635]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-neutral-400 uppercase mb-1">{t.welayat}</label>
                  <input 
                    type="text" required placeholder="e.g., Mary"
                    value={regForm.welayat}
                    onChange={(e) => setRegForm({...regForm, welayat: e.target.value})}
                    className="w-full bg-[#000000] border border-neutral-800 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#A3E635]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-neutral-400 uppercase mb-1">{t.district}</label>
                  <input 
                    type="text" required placeholder="e.g., Sakarchaga"
                    value={regForm.district}
                    onChange={(e) => setRegForm({...regForm, district: e.target.value})}
                    className="w-full bg-[#000000] border border-neutral-800 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#A3E635]"
                  />
                </div>
              </div>

              <button 
                type="submit"
                className="w-full bg-[#A3E635] text-black font-bold py-2.5 rounded-lg text-sm"
              >
                {t.submitReg}
              </button>
            </form>
          </div>
        )}

        {/* VIEW 3 & 4: DASHBOARDS */}
        {view === 'dashboard' && user && (
          <div className="space-y-8">
            
            {/* USER ME
