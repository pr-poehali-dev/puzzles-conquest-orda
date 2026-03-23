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
  mediaUrl?: string;
  mediaType?: "image" | "video";
  translated?: string;
  translating?: boolean;
}

interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  type: "war" | "rally" | "kvk" | "build";
  description: string;
}

const members: Member[] = [];

const news: NewsItem[] = [];

const gallery: GalleryItem[] = [];

const initMessages: ChatMessage[] = [];

const events: Event[] = [];

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

const LANG_OPTIONS = [
  { code: "ru", label: "🇷🇺 Русский" },
  { code: "en", label: "🇬🇧 English" },
  { code: "de", label: "🇩🇪 Deutsch" },
  { code: "fr", label: "🇫🇷 Français" },
  { code: "zh", label: "🇨🇳 中文" },
  { code: "tr", label: "🇹🇷 Türkçe" },
  { code: "uk", label: "🇺🇦 Українська" },
  { code: "pl", label: "🇵🇱 Polski" },
  { code: "es", label: "🇪🇸 Español" },
  { code: "ar", label: "🇸🇦 العربية" },
];

async function translateText(text: string, targetLang: string): Promise<string> {
  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=auto|${targetLang}`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.responseStatus === 200) return data.responseData.translatedText;
    return text;
  } catch {
    return text;
  }
}

export default function Index() {
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState(initMessages);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [notifications, setNotifications] = useState(3);
  const [translateLang, setTranslateLang] = useState("ru");
  const [showLangMenu, setShowLangMenu] = useState(false);

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
      id: Date.now(),
      author: "Ты",
      role: "member",
      text: chatInput,
      time: new Date().toLocaleTimeString("ru", { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, newMsg]);
    setChatInput("");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    const isVideo = file.type.startsWith("video/");
    const newMsg: ChatMessage = {
      id: Date.now(),
      author: "Ты",
      role: "member",
      text: isVideo ? "📹 Видео" : "🖼️ Фото",
      mediaUrl: url,
      mediaType: isVideo ? "video" : "image",
      time: new Date().toLocaleTimeString("ru", { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, newMsg]);
    e.target.value = "";
  };

  const handleTranslate = async (msgId: number, text: string) => {
    setMessages((prev) =>
      prev.map((m) => m.id === msgId ? { ...m, translating: true } : m)
    );
    const translated = await translateText(text, translateLang);
    setMessages((prev) =>
      prev.map((m) => m.id === msgId ? { ...m, translated, translating: false } : m)
    );
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
              <span className="text-slate-400 text-xs">{members.filter(m => m.online).length} онлайн</span>
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
                { label: "Участников", value: members.length.toString(), icon: "Users", color: "text-blue-400" },
                { label: "Новостей", value: news.length.toString(), icon: "Newspaper", color: "text-amber-400" },
                { label: "Событий", value: events.length.toString(), icon: "CalendarDays", color: "text-red-400" },
                { label: "В галерее", value: gallery.length.toString(), icon: "Image", color: "text-purple-400" },
              ].map((stat) => (
                <div key={stat.label} className="bg-[#12141a] border border-slate-800 rounded-xl p-4 text-center hover:border-red-900/60 transition-colors">
                  <Icon name={stat.icon} size={20} className={`${stat.color} mx-auto mb-2`} />
                  <div className={`text-2xl font-black ${stat.color}`}>{stat.value}</div>
                  <div className="text-xs text-slate-500 mt-1 tracking-wider">{stat.label}</div>
                </div>
              ))}
            </div>

            {news.length > 0 && (
              <div>
                <div className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-3 flex items-center gap-2">
                  <Icon name="Newspaper" size={12} />
                  Последние новости
                </div>
                <div className="space-y-3">
                  {news.slice(0, 2).map((item) => (
                    <div key={item.id} className="bg-[#12141a] border border-slate-800 rounded-xl p-4">
                      <div className="font-bold text-sm text-white">{item.title}</div>
                      <div className="text-[10px] text-slate-600 mt-1">{item.date} · {item.author}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {events.length > 0 && (
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
            )}
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
            {news.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="text-4xl mb-4">📰</div>
                <div className="text-slate-500 font-bold tracking-wider">Новостей пока нет</div>
                <div className="text-xs text-slate-700 mt-1">Нажми «Добавить», чтобы опубликовать первую</div>
              </div>
            ) : (
              <div className="space-y-4">
                {news.map((item) => (
                  <div key={item.id} className="bg-[#12141a] border border-slate-800 rounded-xl overflow-hidden">
                    <div className={`h-1 ${item.type === "war" ? "bg-red-600" : item.type === "event" ? "bg-amber-500" : "bg-blue-500"}`} />
                    <div className="p-5">
                      <h3 className="font-bold text-white text-base mb-2">{item.title}</h3>
                      <p className="text-slate-400 text-sm leading-relaxed">{item.text}</p>
                      <div className="text-[10px] text-slate-600 mt-3">{item.date} · {item.author}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
            {gallery.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="text-4xl mb-4">🖼️</div>
                <div className="text-slate-500 font-bold tracking-wider">Галерея пуста</div>
                <div className="text-xs text-slate-700 mt-1">Загружай скрины и видео из игры</div>
              </div>
            ) : (
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
            )}
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

            {members.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="text-4xl mb-4">⚔️</div>
                <div className="text-slate-500 font-bold tracking-wider">Участников пока нет</div>
                <div className="text-xs text-slate-700 mt-1">Пригласи воинов в альянс</div>
              </div>
            ) : (
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
            )}
          </div>
        )}

        {/* ЧАТ */}
        {activeTab === "chat" && (
          <div className="animate-fade-in flex flex-col" style={{ height: "calc(100vh - 200px)" }}>
            {/* Шапка чата */}
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-black tracking-widest text-white">ЧАТ ОРДЫ</h2>
              <div className="flex items-center gap-3">
                {/* Переводчик */}
                <div className="relative">
                  <button
                    onClick={() => setShowLangMenu((v) => !v)}
                    className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-[#12141a] border border-slate-700 rounded-lg text-slate-300 hover:border-amber-500/50 hover:text-amber-400 transition-colors font-bold"
                  >
                    <Icon name="Languages" size={13} />
                    {LANG_OPTIONS.find(l => l.code === translateLang)?.label.split(" ")[0]}
                    <Icon name="ChevronDown" size={12} />
                  </button>
                  {showLangMenu && (
                    <div className="absolute right-0 top-full mt-1 bg-[#12141a] border border-slate-700 rounded-xl shadow-xl z-50 py-1 min-w-[160px]">
                      {LANG_OPTIONS.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => { setTranslateLang(lang.code); setShowLangMenu(false); }}
                          className={`w-full text-left px-4 py-2 text-xs hover:bg-slate-800 transition-colors font-sans ${translateLang === lang.code ? "text-amber-400" : "text-slate-300"}`}
                        >
                          {lang.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="text-xs text-slate-500 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                  онлайн
                </div>
              </div>
            </div>

            {/* Сообщения */}
            <div className="flex-1 bg-[#12141a] border border-slate-800 rounded-xl p-4 overflow-y-auto mb-3">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="text-4xl mb-4">💬</div>
                  <div className="text-slate-500 font-bold tracking-wider">Чат пуст</div>
                  <div className="text-xs text-slate-700 mt-1">Будь первым, кто напишет!</div>
                </div>
              ) : (
                <div className="space-y-3">
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
                        <div className="bg-[#0a0b0f] rounded-xl rounded-tl-none border border-slate-800/50 overflow-hidden">
                          {msg.mediaUrl && msg.mediaType === "image" && (
                            <img src={msg.mediaUrl} alt="фото" className="max-w-[260px] max-h-48 object-cover rounded-t-xl" />
                          )}
                          {msg.mediaUrl && msg.mediaType === "video" && (
                            <video src={msg.mediaUrl} controls className="max-w-[260px] max-h-48 rounded-t-xl" />
                          )}
                          <div className="px-3 py-2 text-sm text-slate-300 font-sans">{msg.text}</div>
                          {/* Перевод */}
                          {msg.translated && (
                            <div className="px-3 pb-2 text-xs text-amber-400/80 font-sans border-t border-slate-800 pt-1.5 italic">
                              🌐 {msg.translated}
                            </div>
                          )}
                          {msg.translating && (
                            <div className="px-3 pb-2 text-xs text-slate-600 font-sans">переводим...</div>
                          )}
                        </div>
                        {!msg.translated && !msg.translating && (
                          <button
                            onClick={() => handleTranslate(msg.id, msg.text)}
                            className="mt-1 text-[10px] text-slate-600 hover:text-amber-400 transition-colors flex items-center gap-1"
                          >
                            <Icon name="Languages" size={10} />
                            перевести
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Ввод */}
            <div className="flex gap-2">
              <input
                type="file"
                accept="image/*,video/*"
                className="hidden"
                id="chat-file-input"
                onChange={handleFileUpload}
              />
              <label
                htmlFor="chat-file-input"
                className="px-3 py-3 bg-[#12141a] border border-slate-800 rounded-xl text-slate-400 hover:text-amber-400 hover:border-amber-500/40 transition-colors cursor-pointer flex items-center"
              >
                <Icon name="Paperclip" size={16} />
              </label>
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
            {events.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="text-4xl mb-4">📅</div>
                <div className="text-slate-500 font-bold tracking-wider">Событий пока нет</div>
                <div className="text-xs text-slate-700 mt-1">Создай войну или событие для альянса</div>
              </div>
            ) : (
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
            )}
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