import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";

const HERO_BG = "https://cdn.poehali.dev/projects/b1da8d2d-2612-436f-bab4-aff3d10f7585/files/2ab72ee4-1981-4cab-afcd-213a2bbb731d.jpg";

// Эпическая музыка через Web Audio API — генерируем драматический звук
function playEpicSound() {
  try {
    interface WinWithWebkit extends Window { webkitAudioContext?: typeof AudioContext; }
    const AudioCtx = window.AudioContext || (window as WinWithWebkit).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    const playNote = (freq: number, start: number, duration: number, gain = 0.3) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      osc.frequency.value = freq;
      osc.type = "sawtooth";
      gainNode.gain.setValueAtTime(0, ctx.currentTime + start);
      gainNode.gain.linearRampToValueAtTime(gain, ctx.currentTime + start + 0.05);
      gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + start + duration);
      osc.start(ctx.currentTime + start);
      osc.stop(ctx.currentTime + start + duration + 0.1);
    };

    // Эпическая тема: фанфары альянса
    const melody = [
      [196, 0.0, 0.3],
      [261, 0.3, 0.3],
      [329, 0.6, 0.3],
      [392, 0.9, 0.6],
      [523, 1.5, 0.4],
      [659, 1.9, 0.4],
      [784, 2.3, 0.8],
      [659, 3.1, 0.3],
      [784, 3.4, 1.2],
    ];

    melody.forEach(([freq, start, dur]) => {
      playNote(freq, start as number, dur as number, 0.25);
    });

    // Бас
    [
      [98, 0.0, 0.8],
      [130, 0.9, 0.6],
      [196, 1.5, 0.8],
      [261, 2.3, 1.2],
    ].forEach(([freq, start, dur]) => {
      playNote(freq, start as number, dur as number, 0.15);
    });

  } catch (e) {
    // silently fail
  }
}

type Phase = "invite" | "welcome";

export default function Invite() {
  const [phase, setPhase] = useState<Phase>("invite");
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; delay: number }[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const p = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 3,
    }));
    setParticles(p);
  }, []);

  const handleJoin = () => {
    playEpicSound();
    setPhase("welcome");
  };

  const handleDecline = () => {
    navigate("/");
  };

  const handleEnter = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#0a0b0f] font-oswald flex items-center justify-center relative overflow-hidden">
      {/* Фон */}
      <div className="absolute inset-0">
        <img src={HERO_BG} alt="" className="w-full h-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0b0f]/80 via-[#0a0b0f]/60 to-[#0a0b0f]" />
      </div>

      {/* Сетка */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: "repeating-linear-gradient(45deg, #8b0000 0, #8b0000 1px, transparent 0, transparent 50%)",
        backgroundSize: "20px 20px",
      }} />

      {/* Частицы */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute w-1 h-1 rounded-full bg-amber-500 opacity-40"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            animation: `pulse 2s ease-in-out ${p.delay}s infinite`,
          }}
        />
      ))}

      {/* ЭКРАН ПРИГЛАШЕНИЯ */}
      {phase === "invite" && (
        <div className="relative z-10 max-w-md w-full mx-4 animate-fade-in">
          {/* Герб альянса */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="w-28 h-28 rounded-full bg-gradient-to-br from-red-800 via-red-600 to-amber-600 flex items-center justify-center text-6xl shadow-2xl shadow-red-900/60 border-4 border-amber-500/40">
                ☠
              </div>
              <div className="absolute inset-0 rounded-full border-2 border-amber-500/30 animate-ping" style={{ animationDuration: "2s" }} />
            </div>
          </div>

          {/* Заголовок */}
          <div className="text-center mb-8">
            <div className="text-xs text-amber-500 tracking-[0.4em] uppercase mb-3">Приглашение в альянс</div>
            <h1 className="text-5xl font-black tracking-widest text-white mb-2">
              ОРДА
            </h1>
            <div className="text-slate-400 text-sm tracking-wider">Puzzles Conquest · Закрытый клан</div>
          </div>

          {/* Карточка */}
          <div className="bg-[#12141a]/90 backdrop-blur-sm border border-red-900/40 rounded-2xl p-8 mb-6">
            <div className="text-center mb-6">
              <div className="text-slate-300 text-base leading-relaxed">
                Тебя приглашают вступить в ряды<br />
                <span className="text-amber-400 font-bold">могущественного альянса ОРДА</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                { icon: "Users", label: "28 воинов", color: "text-blue-400" },
                { icon: "Crown", label: "7 побед KvK", color: "text-amber-400" },
                { icon: "Sword", label: "42M убийств", color: "text-red-400" },
              ].map((s) => (
                <div key={s.label} className="bg-[#0a0b0f] rounded-xl p-3 text-center border border-slate-800">
                  <Icon name={s.icon} size={18} className={`${s.color} mx-auto mb-1`} />
                  <div className="text-[11px] text-slate-400 leading-tight">{s.label}</div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <div className="text-lg font-bold text-white mb-1">Хочешь вступить в Орду?</div>
              <div className="text-xs text-slate-500">Решение необратимо. Орда не прощает слабых.</div>
            </div>
          </div>

          {/* Кнопки */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleDecline}
              className="py-4 bg-[#12141a] border border-slate-700 text-slate-400 rounded-xl font-bold tracking-wider hover:bg-slate-800 transition-all text-sm"
            >
              Отказаться
            </button>
            <button
              onClick={handleJoin}
              className="py-4 bg-gradient-to-r from-red-700 to-amber-600 text-white rounded-xl font-black tracking-widest hover:from-red-600 hover:to-amber-500 transition-all text-sm shadow-lg shadow-red-900/50 relative overflow-hidden group"
            >
              <span className="relative z-10">⚔️ ВСТУПИТЬ</span>
              <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-12" />
            </button>
          </div>
        </div>
      )}

      {/* ЭКРАН ПРИВЕТСТВИЯ */}
      {phase === "welcome" && (
        <div className="relative z-10 max-w-lg w-full mx-4 text-center animate-fade-in">
          {/* Взрыв частиц */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  background: i % 2 === 0 ? "#f59e0b" : "#dc2626",
                  transform: `rotate(${i * 30}deg) translateX(${80 + Math.random() * 40}px)`,
                  animation: `ping 1s ease-out ${i * 0.05}s forwards`,
                  opacity: 0,
                }}
              />
            ))}
          </div>

          {/* Герб */}
          <div className="flex justify-center mb-6">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-red-800 via-red-600 to-amber-600 flex items-center justify-center text-7xl shadow-2xl shadow-red-900/60 border-4 border-amber-400/60"
              style={{ animation: "pulse 1.5s ease-in-out infinite" }}>
              ☠
            </div>
          </div>

          {/* Приветствие */}
          <div className="mb-4">
            <div className="text-amber-400 text-sm tracking-[0.5em] uppercase mb-3">⚔️ Ты теперь часть орды ⚔️</div>
            <h1 className="text-5xl font-black tracking-widest text-white leading-tight mb-4">
              ДОБРО<br />
              <span className="text-red-500">ПОЖАЛОВАТЬ</span><br />
              <span className="text-amber-400">ВОИН!</span>
            </h1>
          </div>

          <div className="bg-[#12141a]/90 backdrop-blur-sm border border-amber-500/30 rounded-2xl p-6 mb-8">
            <div className="text-slate-300 text-sm leading-relaxed mb-4">
              Альянс <span className="text-amber-400 font-bold">ОРДА</span> принял тебя в свои ряды.<br />
              Сражайся с честью. Защищай братьев.<br />
              <span className="text-red-400 font-bold">Враги падут перед нами!</span>
            </div>
            <div className="flex justify-center gap-6 text-2xl">
              <span style={{ animation: "bounce 1s ease-in-out 0s infinite" }}>⚔️</span>
              <span style={{ animation: "bounce 1s ease-in-out 0.2s infinite" }}>🛡️</span>
              <span style={{ animation: "bounce 1s ease-in-out 0.4s infinite" }}>👑</span>
              <span style={{ animation: "bounce 1s ease-in-out 0.6s infinite" }}>🔥</span>
            </div>
          </div>

          <button
            onClick={handleEnter}
            className="w-full py-5 bg-gradient-to-r from-red-700 to-amber-600 text-white rounded-xl font-black tracking-widest text-lg hover:from-red-600 hover:to-amber-500 transition-all shadow-2xl shadow-red-900/50 relative overflow-hidden group"
          >
            <span className="relative z-10">ВОЙТИ В АЛЬЯНС →</span>
            <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-12" />
          </button>
        </div>
      )}
    </div>
  );
}