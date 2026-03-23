import { useState } from "react";
import Icon from "@/components/ui/icon";

const HERO_BG = "https://cdn.poehali.dev/projects/b1da8d2d-2612-436f-bab4-aff3d10f7585/files/2ab72ee4-1981-4cab-afcd-213a2bbb731d.jpg";

type Role = "admin" | "commander" | "member";
type Tab = "home" | "news" | "gallery" | "members" | "chat" | "events" | "rules";

interface Member {
  id: number;
  name: string;
  role: Role;
  power: string;
  kills: string;
  avatar: string;
  online: boolean;
  achievements: string[];
}

interface NewsItem {
  id: number;
  title: string;
  text: string;
  date: string;
  author: string;
  type: "war" | "event" | "announce";
}

interface GalleryItem {
  id: number;
  url: string;
  caption: string;
  author: string;
}

interface ChatMessage {
  id: number;
  author: string;
  role: Role;
  text: string;
  time: string;
}

interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  type: "war" | "rally" | "kvk" | "build";
  description: string;
}

const members: Member[] = [
  { id: 1, name: "ВождьОрды", role: "admin", power: "125.4M", kills: "8.2M", avatar: "👑", online: true, achievements: ["Победитель KvK", "Топ-1 альянса", "Легенда"] },
  { id: 2, name: "ЧёрныйВолк", role: "commander", power: "98.7M", kills: "5.6M", avatar: "⚔️", online: true, achievements: ["Полководец", "100 войн"] },
  { id: 3, name: "КровавыйРассвет", role: "commander", power: "87.3M", kills: "4.1M", avatar: "🛡️", online: false, achievements: ["Защитник", "50 войн"] },
  { id: 4, name: "ТёмныйМаг", role: "member", power: "54.2M", kills: "2.3M", avatar: "🔮", online: true, achievements: ["Маг альянса"] },
  { id: 5, name: "СтальнойКулак", role: "member", power: "41.8M", kills: "1.9M", avatar: "🗡️", online: false, achievements: ["Воин"] },
  { id: 6, name: "НочнойОхотник", role: "member", power: "38.5M", kills: "1.5M", avatar: "🏹", online: true, achievements: ["Лучник"] },
];

const news: NewsItem[] = [
  { id: 1, title: "Победа в KvK! Орда непобедима!", text: "Альянс Орда одержал сокрушительную победу в межсерверной войне. Уничтожено 42 миллиона войск противника. Трофеи разделены между участниками.", date: "23 мар 2026", author: "ВождьОрды", type: "war" },
  { id: 2, title: "Объявляется набор в альянс", text: "Принимаем игроков с мощью от 30M. Требования: активность ежедневно, участие в войнах альянса, донат в R5 по запросу.", date: "20 мар 2026", author: "ЧёрныйВолк", type: "announce" },
  { id: 3, title: "Событие: Осада крепости", text: "В эту субботу в 20:00 МСК стартует осада вражеской крепости. Все участники обязаны быть онлайн. Сбор у координат 444:888.", date: "18 мар 2026", author: "ВождьОрды", type: "event" },
];

const gallery: GalleryItem[] = [
  { id: 1, url: HERO_BG, caption: "Наша крепость непреступна", author: "ВождьОрды" },
  { id: 2, url: HERO_BG, caption: "KvK — финальная битва", author: "ЧёрныйВолк" },
  { id: 3, url: HERO_BG, caption: "Победный марш Орды", author: "КровавыйРассвет" },
  { id: 4, url: HERO_BG, caption: "Захват вражеского замка", author: "ТёмныйМаг" },
  { id: 5, url: HERO_BG, caption: "Тренировочный рейд", author: "СтальнойКулак" },
  { id: 6, url: HERO_BG, caption: "Союзники Орды", author: "НочнойОхотник" },
];

const initMessages: ChatMessage[] = [
  { id: 1, author: "ВождьОрды", role: "admin", text: "Братья, сбор в 20:00! Война начинается!", time: "19:42" },
  { id: 2, author: "ЧёрныйВолк", role: "commander", text: "Готов! Войска в строю, жду команды.", time: "19:44" },
  { id: 3, author: "ТёмныйМаг", role: "member", text: "Магия заряжена, иду!", time: "19:45" },
  { id: 4, author: "НочнойОхотник", role: "member", text: "Уже онлайн, координаты получил 🏹", time: "19:47" },
  { id: 5, author: "КровавыйРассвет", role: "commander", text: "Фланг прикрыт, выдвигаемся по сигналу.", time: "19:49" },
  { id: 6, author: "ВождьОрды", role: "admin", text: "Орда непобедима! Вперёд на врага! ⚔️", time: "19:51" },
];

const events: Event[] = [
  { id: 1, title: "Межсерверная война KvK", date: "28 мар", time: "20:00", type: "kvk", description: "Финальная фаза KvK. Обязательное участие для всех." },
  { id: 2, title: "Осада крепости S4", date: "25 мар", time: "21:00", type: "war", description: "Атакуем замок сервера 4. Сбор у р5." },
  { id: 3, title: "Ралли на босса", date: "24 мар", time: "18:00", type: "rally", description: "5 ралли на мирового босса. Лут поровну." },
  { id: 4, title: "Событие строительства", date: "26 мар", time: "00:00", type: "build", description: "Срочно строимся. Очки идут в зачёт альянса." },
];

const roleColors: Record<Role, string> = {
  admin: "text-amber-400",
  commander: "text-red-400",
  member: "text-slate-300",
};

const roleLabels: Record<Role, string> = {
  admin: "Вождь",
  commander: "Командир",
  member: "Воин",
};

const roleBadge: Record<Role, string> = {
  admin: "bg-amber-500/20 text-amber-400 border-amber-500/40",
  commander: "bg-red-500/20 text-red-400 border-red-500/40",
  member: "bg-slate-500/20 text-slate-300 border-slate-500/40",
};

const eventColors: Record<Event["type"], string> = {
  war: "border-red-500/60 bg-red-500/10",
  kvk: "border-amber-500/60 bg-amber-500/10",
  rally: "border-purple-500/60 bg-purple-500/10",
  build: "border-blue-500/60 bg-blue-500/10",
};

const eventIconMap: Record<Event["type"], string> = {
  war: "Sword",
  kvk: "Crown",
  rally: "Zap",
  build: "Building2",
};

const eventTextColor: Record<Event["type"], string> = {
  war: "text-red-400",
  kvk: "text-amber-400",
  rally: "text-purple-400",
  build: "text-blue-400",
};

const eventBgColor: Record<Event["type"], string> = {
  war: "bg-red-500/20",
  kvk: "bg-amber-500/20",
  rally: "bg-purple-500/20",
  build: "bg-blue-500/20",
};

export default function Index() {
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState(initMessages);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [notifications, setNotifications] = useState(3);

  const navItems: { id: Tab; label: string; icon: string }[] = [
    { id: "home", label: "Главная", icon: "Home" },
    { id: "news", label: "Новости", icon: "Newspaper" },
    { id: "gallery", label: "Галерея", icon: "Image" },
    { id: "members", label: "Участники", icon: "Users" },
    { id: "chat", label: "Чат", icon: "MessageSquare" },
    { id: "events", label: "События", icon: "CalendarDays" },
    { id: "rules", label: "Правила", icon: "ScrollText" },
  ];

  const sendMessage = () => {
    if (!chatInput.trim()) return;
    const newMsg: ChatMessage = {
      id: messages.length + 1,
      author: "Ты",
      role: "member",
      text: chatInput,
      time: new Date().toLocaleTimeString("ru", { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages([...messages, newMsg]);
    setChatInput("");
  };

  return (
    <div className="min-h-screen bg-[#0a0b0f] text-slate-100 font-oswald">
      <div className="fixed inset-0 z-0 opacity-5 pointer-events-none" style={{
        backgroundImage: "repeating-linear-gradient(45deg, #8b0000 0, #8b0000 1px, transparent 0, transparent 50%)",
        backgroundSize: "20px 20px",
      }} />

      {/* Шапка */}
      <header className="relative z-20 border-b border-red-900/40 bg-[#0d0f14]/95 backdrop-blur-sm sticky top-0">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-600 to-amber-600 flex items-center justify-center text-lg font-black shadow-lg shadow-red-900/50">
              ☠
            </div>
            <div>
              <div className="text-lg font-black tracking-widest text-amber-400 leading-none">ОРДА</div>
              <div className="text-[10px] text-slate-500 tracking-widest uppercase">Puzzles Conquest</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative text-slate-400 hover:text-amber-400 transition-colors" onClick={() => setNotifications(0)}>
              <Icon name="Bell" size={20} />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 rounded-full text-[9px] flex items-center justify-center font-bold text-white">
                  {notifications}
                </span>
              )}
            </button>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-slate-400 text-xs">4 онлайн</span>
            </div>
            <div className="text-xs px-3 py-1.5 rounded border border-amber-500/40 bg-amber-500/10 text-amber-400 font-bold tracking-wider">
              👑 Вождь
            </div>
          </div>
        </div>

        <nav className="max-w-7xl mx-auto px-4 flex gap-1 overflow-x-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold tracking-wider uppercase whitespace-nowrap border-b-2 transition-all duration-200 ${
                activeTab === item.id
                  ? "border-red-500 text-red-400 bg-red-500/5"
                  : "border-transparent text-slate-500 hover:text-slate-300 hover:border-slate-600"
              }`}
            >
              <Icon name={item.icon} size={14} />
              {item.label}
            </button>
          ))}
        </nav>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-4 py-6">

        {/* ГЛАВНАЯ */}
        {activeTab === "home" && (
          <div className="space-y-6 animate-fade-in">
            <div className="relative rounded-xl overflow-hidden h-64 border border-red-900/40">
              <img src={HERO_BG} alt="Орда" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0b0f] via-[#0a0b0f]/50 to-transparent" />
              <div className="absolute bottom-6 left-6">
                <div className="text-4xl font-black tracking-widest text-white drop-shadow-lg">
                  АЛЬЯНС <span className="text-red-500">ОРДА</span>
                </div>
                <div className="text-amber-400 text-sm tracking-widest mt-1">⚔️ ВМЕСТЕ МЫ НЕПОБЕДИМЫ ⚔️</div>
              </div>
              <div className="absolute top-4 right-4 bg-red-600/90 text-white text-xs font-bold px-3 py-1 rounded-full border border-red-400/40">
                🔒 Закрытый альянс
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: "Участников", value: "28", icon: "Users", color: "text-blue-400" },
                { label: "Мощь альянса", value: "1.2B", icon: "Zap", color: "text-amber-400" },
                { label: "Убийств", value: "42M", icon: "Sword", color: "text-red-400" },
                { label: "Побед KvK", value: "7", icon: "Crown", color: "text-purple-400" },
              ].map((stat) => (
                <div key={stat.label} className="bg-[#12141a] border border-slate-800 rounded-xl p-4 text-center hover:border-red-900/60 transition-colors">
                  <Icon name={stat.icon} size={20} className={`${stat.color} mx-auto mb-2`} />
                  <div className={`text-2xl font-black ${stat.color}`}>{stat.value}</div>
                  <div className="text-xs text-slate-500 mt-1 tracking-wider">{stat.label}</div>
                </div>
              ))}
            </div>

            <div>
              <div className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-3 flex items-center gap-2">
                <Icon name="Newspaper" size={12} />
                Последние новости
              </div>
              <div className="space-y-3">
                {news.slice(0, 2).map((item) => (
                  <div key={item.id} className="bg-[#12141a] border border-slate-800 rounded-xl p-4 hover:border-red-900/50 transition-colors">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-bold text-sm text-white">{item.title}</div>
                        <div className="text-xs text-slate-500 mt-1 line-clamp-2">{item.text}</div>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full border font-bold flex-shrink-0 ${
                        item.type === "war" ? "border-red-500/40 text-red-400 bg-red-500/10" :
                        item.type === "event" ? "border-amber-500/40 text-amber-400 bg-amber-500/10" :
                        "border-blue-500/40 text-blue-400 bg-blue-500/10"
                      }`}>
                        {item.type === "war" ? "Война" : item.type === "event" ? "Событие" : "Анонс"}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-600 mt-2">{item.date} · {item.author}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className={`border rounded-xl p-4 ${eventColors[events[0].type]}`}>
              <div className="text-xs text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                <Icon name="CalendarDays" size={12} />
                Ближайшее событие
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-white">{events[0].title}</div>
                  <div className="text-xs text-slate-400 mt-1">{events[0].description}</div>
                </div>
                <div className="text-right flex-shrink-0 ml-4">
                  <div className="text-amber-400 font-bold">{events[0].date}</div>
                  <div className="text-xs text-slate-400">{events[0].time} МСК</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* НОВОСТИ */}
        {activeTab === "news" && (
          <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-black tracking-widest text-white">НОВОСТИ АЛЬЯНСА</h2>
              <button className="text-xs px-4 py-2 bg-red-600/20 border border-red-600/40 text-red-400 rounded-lg hover:bg-red-600/30 transition-colors font-bold tracking-wider">
                + Добавить
              </button>
            </div>
            <div className="space-y-4">
              {news.map((item) => (
                <div key={item.id} className="bg-[#12141a] border border-slate-800 rounded-xl overflow-hidden hover:border-red-900/50 transition-all">
                  <div className={`h-1 ${item.type === "war" ? "bg-red-600" : item.type === "event" ? "bg-amber-500" : "bg-blue-500"}`} />
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <h3 className="font-bold text-white text-base">{item.title}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full border font-bold flex-shrink-0 ${
                        item.type === "war" ? "border-red-500/40 text-red-400 bg-red-500/10" :
                        item.type === "event" ? "border-amber-500/40 text-amber-400 bg-amber-500/10" :
                        "border-blue-500/40 text-blue-400 bg-blue-500/10"
                      }`}>
                        {item.type === "war" ? "⚔️ Война" : item.type === "event" ? "🎯 Событие" : "📣 Анонс"}
                      </span>
                    </div>
                    <p className="text-slate-400 text-sm leading-relaxed">{item.text}</p>
                    <div className="flex items-center gap-3 mt-4 pt-3 border-t border-slate-800">
                      <span className="text-amber-400 text-xs font-bold">👤 {item.author}</span>
                      <span className="text-slate-600 text-xs">{item.date}</span>
                      <div className="flex gap-3 ml-auto">
                        <button className="text-slate-500 hover:text-red-400 transition-colors">
                          <Icon name="Heart" size={14} />
                        </button>
                        <button className="text-slate-500 hover:text-blue-400 transition-colors">
                          <Icon name="MessageSquare" size={14} />
                        </button>
                        <button className="text-slate-500 hover:text-green-400 transition-colors">
                          <Icon name="Share2" size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ГАЛЕРЕЯ */}
        {activeTab === "gallery" && (
          <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-black tracking-widest text-white">ГАЛЕРЕЯ ОРДЫ</h2>
              <button className="text-xs px-4 py-2 bg-red-600/20 border border-red-600/40 text-red-400 rounded-lg hover:bg-red-600/30 transition-colors font-bold tracking-wider flex items-center gap-2">
                <Icon name="Upload" size={12} />
                Загрузить
              </button>
            </div>
            <div className="flex gap-2 mb-4">
              {["Все", "Скрины", "Видео", "Победы"].map((f) => (
                <button key={f} className="text-xs px-3 py-1.5 bg-[#12141a] border border-slate-800 rounded-lg text-slate-400 hover:border-red-900/50 hover:text-red-400 transition-colors font-bold">
                  {f}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {gallery.map((item) => (
                <div key={item.id} className="group relative rounded-xl overflow-hidden border border-slate-800 hover:border-red-900/50 transition-all cursor-pointer aspect-video">
                  <img src={item.url} alt={item.caption} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-200">
                    <div className="text-xs text-white font-bold">{item.caption}</div>
                    <div className="text-[10px] text-slate-400">{item.author}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* УЧАСТНИКИ */}
        {activeTab === "members" && (
          <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-black tracking-widest text-white">ВОИНЫ ОРДЫ</h2>
              <button className="text-xs px-4 py-2 bg-red-600/20 border border-red-600/40 text-red-400 rounded-lg hover:bg-red-600/30 transition-colors font-bold tracking-wider flex items-center gap-2">
                <Icon name="UserPlus" size={12} />
                Пригласить
              </button>
            </div>

            {selectedMember && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setSelectedMember(null)}>
                <div className="bg-[#12141a] border border-red-900/40 rounded-2xl p-6 max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
                  <div className="text-center mb-4">
                    <div className="text-5xl mb-3">{selectedMember.avatar}</div>
                    <div className="text-xl font-black text-white">{selectedMember.name}</div>
                    <div className="mt-2">
                      <span className={`text-xs px-3 py-1 rounded-full border font-bold ${roleBadge[selectedMember.role]}`}>
                        {roleLabels[selectedMember.role]}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-[#0a0b0f] rounded-xl p-3 text-center">
                      <div className="text-amber-400 font-black text-lg">{selectedMember.power}</div>
                      <div className="text-xs text-slate-500">Мощь</div>
                    </div>
                    <div className="bg-[#0a0b0f] rounded-xl p-3 text-center">
                      <div className="text-red-400 font-black text-lg">{selectedMember.kills}</div>
                      <div className="text-xs text-slate-500">Убийств</div>
                    </div>
                  </div>
                  <div className="mb-4">
                    <div className="text-xs text-slate-500 uppercase tracking-widest mb-2">Достижения</div>
                    <div className="flex flex-wrap gap-2">
                      {selectedMember.achievements.map((a) => (
                        <span key={a} className="text-xs px-2 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-lg">🏆 {a}</span>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button className="text-xs py-2 bg-red-600/20 border border-red-600/40 text-red-400 rounded-lg font-bold hover:bg-red-600/30 transition-colors">
                      Написать
                    </button>
                    <button className="text-xs py-2 bg-slate-700/50 border border-slate-700 text-slate-300 rounded-lg font-bold hover:bg-slate-700 transition-colors" onClick={() => setSelectedMember(null)}>
                      Закрыть
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-2">
              {members.map((m) => (
                <div key={m.id} className="bg-[#12141a] border border-slate-800 rounded-xl p-4 flex items-center gap-4 hover:border-red-900/50 transition-all cursor-pointer" onClick={() => setSelectedMember(m)}>
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-[#1a1d24] border border-slate-700 flex items-center justify-center text-2xl">
                      {m.avatar}
                    </div>
                    {m.online && <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-[#12141a]" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm truncate">{m.name}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full border font-bold ${roleBadge[m.role]}`}>
                        {roleLabels[m.role]}
                      </span>
                    </div>
                    <div className="flex gap-4 mt-1">
                      <span className="text-xs text-slate-500">⚡ {m.power}</span>
                      <span className="text-xs text-slate-500">⚔️ {m.kills}</span>
                    </div>
                  </div>
                  <Icon name="ChevronRight" size={14} className="text-slate-600 flex-shrink-0" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ЧАТ */}
        {activeTab === "chat" && (
          <div className="animate-fade-in flex flex-col" style={{ height: "calc(100vh - 200px)" }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-black tracking-widest text-white">ЧАТ ОРДЫ</h2>
              <div className="text-xs text-slate-500 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                4 онлайн
              </div>
            </div>

            <div className="flex-1 bg-[#12141a] border border-slate-800 rounded-xl p-4 overflow-y-auto space-y-3 mb-3">
              {messages.map((msg) => (
                <div key={msg.id} className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#1a1d24] border border-slate-700 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                    {msg.author[0]}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className={`text-xs font-bold ${roleColors[msg.role]}`}>{msg.author}</span>
                      <span className="text-[10px] text-slate-600">{roleLabels[msg.role]}</span>
                      <span className="text-[10px] text-slate-700 ml-auto">{msg.time}</span>
                    </div>
                    <div className="text-sm text-slate-300 bg-[#0a0b0f] rounded-xl rounded-tl-none px-3 py-2 border border-slate-800/50 font-sans">
                      {msg.text}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Сообщение альянсу..."
                className="flex-1 bg-[#12141a] border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-red-900/60 font-sans"
              />
              <button onClick={sendMessage} className="px-4 py-3 bg-red-600 hover:bg-red-700 rounded-xl text-white transition-colors">
                <Icon name="Send" size={16} />
              </button>
            </div>
          </div>
        )}

        {/* СОБЫТИЯ */}
        {activeTab === "events" && (
          <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-black tracking-widest text-white">СОБЫТИЯ И ВОЙНЫ</h2>
              <button className="text-xs px-4 py-2 bg-red-600/20 border border-red-600/40 text-red-400 rounded-lg hover:bg-red-600/30 transition-colors font-bold tracking-wider flex items-center gap-2">
                <Icon name="Plus" size={12} />
                Создать
              </button>
            </div>
            <div className="space-y-3">
              {events.map((event) => (
                <div key={event.id} className={`border rounded-xl p-5 ${eventColors[event.type]}`}>
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${eventBgColor[event.type]}`}>
                      <Icon name={eventIconMap[event.type]} size={20} className={eventTextColor[event.type]} />
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-white">{event.title}</div>
                      <div className="text-xs text-slate-400 mt-1">{event.description}</div>
                      <div className="flex items-center gap-3 mt-3">
                        <span className={`text-xs font-bold ${eventTextColor[event.type]}`}>📅 {event.date}</span>
                        <span className="text-xs text-slate-500">🕐 {event.time} МСК</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 flex-shrink-0">
                      <button className="text-xs px-3 py-1.5 bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/20 transition-colors font-bold">
                        Иду ✓
                      </button>
                      <button className="text-xs px-3 py-1.5 bg-black/20 border border-white/10 text-slate-300 rounded-lg hover:bg-black/30 transition-colors font-bold">
                        🔔
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ПРАВИЛА */}
        {activeTab === "rules" && (
          <div className="animate-fade-in">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-red-500/20 border border-red-500/40 rounded-xl flex items-center justify-center">
                <Icon name="ScrollText" size={18} className="text-red-400" />
              </div>
              <div>
                <h2 className="text-xl font-black tracking-widest text-white">КОДЕКС ОРДЫ</h2>
                <div className="text-xs text-slate-500">Законы нашего альянса</div>
              </div>
            </div>

            <div className="space-y-4">
              {[
                { num: "01", title: "Активность", icon: "Zap", text: "Минимум 1 вход в игру каждые 24 часа. Отсутствие без уведомления более 3 дней — исключение из альянса.", color: "text-amber-400", border: "border-amber-500/30" },
                { num: "02", title: "Войны альянса", icon: "Sword", text: "Обязательное участие во всех войнах альянса. Неучастие без уважительной причины — штраф.", color: "text-red-400", border: "border-red-500/30" },
                { num: "03", title: "Чат и общение", icon: "MessageSquare", text: "Уважительное общение обязательно. Оскорбления, спам и конфликты недопустимы. R5 — последняя инстанция.", color: "text-blue-400", border: "border-blue-500/30" },
                { num: "04", title: "Помощь альянсу", icon: "Heart", text: "Помогаем строить друг другу здания. Донат в хранилище альянса приветствуется. Сила вместе.", color: "text-green-400", border: "border-green-500/30" },
                { num: "05", title: "Конфиденциальность", icon: "Lock", text: "Стратегия, координаты и планы атак не разглашаются посторонним. Предательство — немедленное исключение.", color: "text-purple-400", border: "border-purple-500/30" },
                { num: "06", title: "Иерархия", icon: "Crown", text: "Приказы R5 и R4 выполняются без обсуждений. Споры решаются после сражения. В бою — единое командование.", color: "text-amber-400", border: "border-amber-500/30" },
              ].map((rule) => (
                <div key={rule.num} className={`bg-[#12141a] border ${rule.border} rounded-xl p-5`}>
                  <div className="flex gap-4">
                    <div className={`text-3xl font-black ${rule.color} opacity-30 flex-shrink-0 leading-none`}>{rule.num}</div>
                    <div>
                      <div className="font-bold text-white flex items-center gap-2 mb-1">
                        <Icon name={rule.icon} size={14} className={rule.color} />
                        {rule.title}
                      </div>
                      <div className="text-sm text-slate-400 leading-relaxed font-sans">{rule.text}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-red-900/20 border border-red-700/40 rounded-xl text-center">
              <div className="text-red-400 font-black tracking-widest text-sm mb-1">⚔️ ОРДА ЕДИНА ⚔️</div>
              <div className="text-xs text-slate-500 font-sans">Нарушение правил ведёт к понижению ранга или исключению</div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
