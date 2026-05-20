import React, { useState, useEffect, useRef } from 'react';
import { Star, Home, Volume2, Trophy, RefreshCw, ArrowLeft } from 'lucide-react';
import * as Tone from 'tone';

// ============ 資料 ============
const ZHUYIN_DATA = [
  { symbol: 'ㄅ', example: '八', emoji: '8️⃣', freq: 261.63 },
  { symbol: 'ㄆ', example: '葡萄', emoji: '🍇', freq: 293.66 },
  { symbol: 'ㄇ', example: '媽媽', emoji: '👩', freq: 329.63 },
  { symbol: 'ㄈ', example: '飛機', emoji: '✈️', freq: 349.23 },
  { symbol: 'ㄉ', example: '蛋糕', emoji: '🎂', freq: 392.00 },
  { symbol: 'ㄊ', example: '太陽', emoji: '☀️', freq: 440.00 },
  { symbol: 'ㄋ', example: '牛奶', emoji: '🥛', freq: 493.88 },
  { symbol: 'ㄌ', example: '老虎', emoji: '🐯', freq: 523.25 },
  { symbol: 'ㄍ', example: '哥哥', emoji: '🧑', freq: 587.33 },
  { symbol: 'ㄎ', example: '可樂', emoji: '🥤', freq: 659.25 },
  { symbol: 'ㄏ', example: '猴子', emoji: '🐵', freq: 698.46 },
  { symbol: 'ㄐ', example: '雞蛋', emoji: '🥚', freq: 783.99 },
  { symbol: 'ㄑ', example: '汽車', emoji: '🚗', freq: 261.63 },
  { symbol: 'ㄒ', example: '西瓜', emoji: '🍉', freq: 293.66 },
  { symbol: 'ㄓ', example: '蜘蛛', emoji: '🕷️', freq: 329.63 },
  { symbol: 'ㄔ', example: '吃飯', emoji: '🍚', freq: 349.23 },
  { symbol: 'ㄕ', example: '獅子', emoji: '🦁', freq: 392.00 },
  { symbol: 'ㄖ', example: '日頭', emoji: '🌞', freq: 440.00 },
  { symbol: 'ㄗ', example: '紫色', emoji: '🟣', freq: 493.88 },
  { symbol: 'ㄘ', example: '草莓', emoji: '🍓', freq: 523.25 },
  { symbol: 'ㄙ', example: '四個', emoji: '4️⃣', freq: 587.33 },
  { symbol: 'ㄚ', example: '阿姨', emoji: '👩', freq: 659.25 },
  { symbol: 'ㄛ', example: '喔', emoji: '😮', freq: 698.46 },
  { symbol: 'ㄜ', example: '鵝', emoji: '🦢', freq: 783.99 },
  { symbol: 'ㄝ', example: '葉子', emoji: '🍃', freq: 261.63 },
  { symbol: 'ㄞ', example: '愛心', emoji: '❤️', freq: 293.66 },
  { symbol: 'ㄟ', example: '黑色', emoji: '⚫', freq: 329.63 },
  { symbol: 'ㄠ', example: '貓咪', emoji: '🐱', freq: 349.23 },
  { symbol: 'ㄡ', example: '狗狗', emoji: '🐶', freq: 392.00 },
  { symbol: 'ㄢ', example: '安全', emoji: '🛡️', freq: 440.00 },
  { symbol: 'ㄣ', example: '恩', emoji: '🤝', freq: 493.88 },
  { symbol: 'ㄤ', example: '糖果', emoji: '🍬', freq: 523.25 },
  { symbol: 'ㄥ', example: '燈', emoji: '💡', freq: 587.33 },
  { symbol: 'ㄦ', example: '耳朵', emoji: '👂', freq: 659.25 },
  { symbol: 'ㄧ', example: '衣服', emoji: '👕', freq: 698.46 },
  { symbol: 'ㄨ', example: '烏龜', emoji: '🐢', freq: 783.99 },
  { symbol: 'ㄩ', example: '魚', emoji: '🐟', freq: 880.00 },
];

const WORDS_LEVEL2 = [
  { word: '貓', zhuyin: ['ㄇ', 'ㄠ'], tone: 1, emoji: '🐱' },
  { word: '狗', zhuyin: ['ㄍ', 'ㄡ'], tone: 3, emoji: '🐶' },
  { word: '魚', zhuyin: ['ㄩ'], tone: 2, emoji: '🐟' },
  { word: '鳥', zhuyin: ['ㄋ', 'ㄧ', 'ㄠ'], tone: 3, emoji: '🐦' },
  { word: '花', zhuyin: ['ㄏ', 'ㄨ', 'ㄚ'], tone: 1, emoji: '🌸' },
  { word: '樹', zhuyin: ['ㄕ', 'ㄨ'], tone: 4, emoji: '🌳' },
  { word: '車', zhuyin: ['ㄔ', 'ㄜ'], tone: 1, emoji: '🚗' },
  { word: '球', zhuyin: ['ㄑ', 'ㄧ', 'ㄡ'], tone: 2, emoji: '⚽' },
  { word: '書', zhuyin: ['ㄕ', 'ㄨ'], tone: 1, emoji: '📚' },
  { word: '蛋', zhuyin: ['ㄉ', 'ㄢ'], tone: 4, emoji: '🥚' },
  { word: '雲', zhuyin: ['ㄩ', 'ㄣ'], tone: 2, emoji: '☁️' },
  { word: '雨', zhuyin: ['ㄩ'], tone: 3, emoji: '🌧️' },
  { word: '日', zhuyin: ['ㄖ'], tone: 4, emoji: '☀️' },
  { word: '月', zhuyin: ['ㄩ', 'ㄝ'], tone: 4, emoji: '🌙' },
  { word: '山', zhuyin: ['ㄕ', 'ㄢ'], tone: 1, emoji: '⛰️' },
  { word: '海', zhuyin: ['ㄏ', 'ㄞ'], tone: 3, emoji: '🌊' },
  { word: '火', zhuyin: ['ㄏ', 'ㄨ', 'ㄛ'], tone: 3, emoji: '🔥' },
  { word: '冰', zhuyin: ['ㄅ', 'ㄧ', 'ㄥ'], tone: 1, emoji: '🧊' },
];

const TONE_MARKS = ['', '', 'ˊ', 'ˇ', 'ˋ'];

const EN_WORDS = [
  { word: 'cat', zh: '貓', emoji: '🐱' },
  { word: 'dog', zh: '狗', emoji: '🐶' },
  { word: 'fish', zh: '魚', emoji: '🐟' },
  { word: 'bird', zh: '鳥', emoji: '🐦' },
  { word: 'pig', zh: '豬', emoji: '🐷' },
  { word: 'cow', zh: '牛', emoji: '🐄' },
  { word: 'duck', zh: '鴨子', emoji: '🦆' },
  { word: 'bee', zh: '蜜蜂', emoji: '🐝' },
  { word: 'apple', zh: '蘋果', emoji: '🍎' },
  { word: 'banana', zh: '香蕉', emoji: '🍌' },
  { word: 'milk', zh: '牛奶', emoji: '🥛' },
  { word: 'bread', zh: '麵包', emoji: '🍞' },
  { word: 'egg', zh: '蛋', emoji: '🥚' },
  { word: 'cake', zh: '蛋糕', emoji: '🎂' },
  { word: 'red', zh: '紅色', emoji: '🔴' },
  { word: 'blue', zh: '藍色', emoji: '🔵' },
  { word: 'sun', zh: '太陽', emoji: '☀️' },
  { word: 'moon', zh: '月亮', emoji: '🌙' },
  { word: 'star', zh: '星星', emoji: '⭐' },
  { word: 'tree', zh: '樹', emoji: '🌳' },
  { word: 'car', zh: '車', emoji: '🚗' },
  { word: 'book', zh: '書', emoji: '📚' },
  { word: 'hat', zh: '帽子', emoji: '🎩' },
  { word: 'ball', zh: '球', emoji: '⚽' },
];

// ============ 主元件 ============
export default function App() {
  const [screen, setScreen] = useState('home');
  const [stars, setStars] = useState(0);
  const [synthReady, setSynthReady] = useState(false);
  const synthRef = useRef(null);

  useEffect(() => {
    try {
      const r = localStorage.getItem('zhuyin_stars');
      if (r) setStars(parseInt(r));
    } catch (e) {}
  }, []);

  const initAudio = async () => {
    if (!synthReady) {
      await Tone.start();
      synthRef.current = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: 'sine' },
        envelope: { attack: 0.05, decay: 0.1, sustain: 0.3, release: 0.5 }
      }).toDestination();
      setSynthReady(true);
    }
  };

  const playSound = (type) => {
    if (!synthRef.current) return;
    const now = Tone.now();
    if (type === 'correct') {
      synthRef.current.triggerAttackRelease('C5', '8n', now);
      synthRef.current.triggerAttackRelease('E5', '8n', now + 0.15);
      synthRef.current.triggerAttackRelease('G5', '4n', now + 0.3);
    } else if (type === 'wrong') {
      synthRef.current.triggerAttackRelease('E4', '8n', now);
      synthRef.current.triggerAttackRelease('C4', '4n', now + 0.15);
    } else if (type === 'tap') {
      synthRef.current.triggerAttackRelease('A4', '16n', now);
    }
  };

  const speakZh = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'zh-TW';
      u.rate = 0.75;
      window.speechSynthesis.speak(u);
    }
  };

  const speakEn = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'en-US';
      u.rate = 0.7;
      window.speechSynthesis.speak(u);
    }
  };

  const playZhuyinSound = (item) => {
    if (!synthRef.current) return;
    synthRef.current.triggerAttackRelease(item.freq, '4n', Tone.now());
    speakZh(item.example);
  };

  const addStars = (n) => {
    const ns = stars + n;
    setStars(ns);
    try { localStorage.setItem('zhuyin_stars', String(ns)); } catch (e) {}
  };

  const goHome = () => setScreen('home');
  const goBack = () => {
    if (screen.startsWith('zhuyin-') && screen !== 'zhuyin-menu') setScreen('zhuyin-menu');
    else if (screen.startsWith('math-') && screen !== 'math-menu') setScreen('math-menu');
    else if (screen.startsWith('en-') && screen !== 'en-menu') setScreen('en-menu');
    else setScreen('home');
  };

  const startGame = async (target) => {
    await initAudio();
    setScreen(target);
  };

  const onCorrect1 = () => { playSound('correct'); addStars(1); };
  const onCorrect2 = () => { playSound('correct'); addStars(2); };
  const onWrong = () => playSound('wrong');

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-pink-100 to-purple-100 p-4 select-none">
      <div className="max-w-3xl mx-auto">
        {screen !== 'home' && (
          <div className="flex items-center justify-between mb-4 bg-white rounded-2xl p-3 shadow-md">
            <div className="flex gap-2">
              <button onClick={goBack} className="flex items-center gap-1 px-3 py-2 bg-gray-300 text-gray-700 rounded-xl hover:bg-gray-400 transition font-bold">
                <ArrowLeft className="w-5 h-5" />返回
              </button>
              <button onClick={goHome} className="flex items-center gap-1 px-3 py-2 bg-purple-400 text-white rounded-xl hover:bg-purple-500 transition font-bold">
                <Home className="w-5 h-5" />首頁
              </button>
            </div>
            <div className="flex items-center gap-2 bg-yellow-300 px-4 py-2 rounded-xl">
              <Star className="w-6 h-6 text-yellow-700 fill-yellow-500" />
              <span className="font-bold text-yellow-900 text-xl">{stars}</span>
            </div>
          </div>
        )}

        {screen === 'home' && <HomeScreen stars={stars} onPick={setScreen} />}
        {screen === 'zhuyin-menu' && <SubjectMenu title="🎯 注音遊戲" color="from-pink-500 to-purple-500" games={[
          { id: 'zhuyin-spell', icon: '✏️', title: '注音拼字', desc: '看圖拼出注音符號', color: 'from-pink-400 to-red-400' },
          { id: 'zhuyin-listen', icon: '👂', title: '聽聲找字', desc: '聽聽看是哪個注音', color: 'from-blue-300 to-purple-300' },
          { id: 'zhuyin-listen-spell', icon: '🎵', title: '聽音拼讀', desc: '聽發音拼出注音', color: 'from-purple-400 to-pink-400' },
          { id: 'zhuyin-whack', icon: '🔨', title: '注音打地鼠', desc: '快速找出指定注音', color: 'from-orange-400 to-red-400' },
        ]} onStart={startGame} />}
        {screen === 'math-menu' && <SubjectMenu title="🔢 數學遊戲" color="from-blue-500 to-cyan-500" games={[
          { id: 'math-add', icon: '➕', title: '加法練習', desc: '算算看是多少', color: 'from-blue-400 to-cyan-400' },
          { id: 'math-sub', icon: '➖', title: '減法練習', desc: '減減看是多少', color: 'from-cyan-400 to-teal-400' },
          { id: 'math-compare', icon: '⚖️', title: '比大小', desc: '哪個比較大?', color: 'from-teal-400 to-green-400' },
          { id: 'math-fruit', icon: '🍎', title: '採水果湊數字', desc: '採出指定的總和', color: 'from-green-400 to-blue-400' },
        ]} onStart={startGame} />}
        {screen === 'en-menu' && <SubjectMenu title="🔤 英文遊戲" color="from-green-500 to-emerald-500" games={[
          { id: 'en-pick', icon: '🖼️', title: '看圖選字', desc: '哪個是正確的單字?', color: 'from-green-400 to-lime-400' },
          { id: 'en-listen', icon: '👂', title: '聽音選圖', desc: '聽英文選圖片', color: 'from-lime-400 to-yellow-400' },
          { id: 'en-spell', icon: '✏️', title: '拼單字', desc: '把字母拼起來', color: 'from-yellow-400 to-orange-400' },
          { id: 'en-case', icon: '🔤', title: '大小寫配對', desc: '配對大小寫字母', color: 'from-emerald-400 to-teal-400' },
        ]} onStart={startGame} />}

        {/* 注音 */}
        {screen === 'zhuyin-listen' && <ListenGame onCorrect={onCorrect1} onWrong={onWrong} playZhuyinSound={playZhuyinSound} />}
        {screen === 'zhuyin-spell' && <SpellGame onCorrect={onCorrect2} onWrong={onWrong} speakWord={speakZh} playSound={playSound} />}
        {screen === 'zhuyin-listen-spell' && <ListenSpellGame onCorrect={onCorrect2} onWrong={onWrong} speakWord={speakZh} playSound={playSound} />}
        {screen === 'zhuyin-whack' && <WhackGame onCorrect={onCorrect1} onWrong={onWrong} />}

        {/* 數學 */}
        {screen === 'math-add' && <MathAddGame onCorrect={onCorrect1} onWrong={onWrong} />}
        {screen === 'math-sub' && <MathSubGame onCorrect={onCorrect1} onWrong={onWrong} />}
        {screen === 'math-compare' && <MathCompareGame onCorrect={onCorrect1} onWrong={onWrong} />}
        {screen === 'math-fruit' && <MathFruitGame onCorrect={onCorrect1} onWrong={onWrong} playSound={playSound} />}

        {/* 英文 */}
        {screen === 'en-pick' && <EnPickGame onCorrect={onCorrect1} onWrong={onWrong} speakEn={speakEn} />}
        {screen === 'en-listen' && <EnListenGame onCorrect={onCorrect1} onWrong={onWrong} speakEn={speakEn} />}
        {screen === 'en-spell' && <EnSpellGame onCorrect={onCorrect2} onWrong={onWrong} speakEn={speakEn} playSound={playSound} />}
        {screen === 'en-case' && <EnCaseGame onCorrect={onCorrect1} onWrong={onWrong} />}

        <style>{`
          @keyframes pop { 0% { transform: scale(0); } 50% { transform: scale(1.1); } 100% { transform: scale(1); } }
          .animate-pop { animation: pop 0.3s ease-out; }
          @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } }
          .animate-shake { animation: shake 0.3s ease-in-out; }
          @keyframes fade-in { from { opacity: 0; transform: scale(0.5); } to { opacity: 1; transform: scale(1); } }
          .animate-fade-in { animation: fade-in 0.3s ease-out; }
        `}</style>
      </div>
    </div>
  );
}

// ============ 首頁 ============
function HomeScreen({ stars, onPick }) {
  return (
    <div className="text-center">
      <div className="mt-4 mb-6">
        <h1 className="text-5xl md:text-6xl font-bold mb-2 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
          學習樂園
        </h1>
        <div className="text-2xl text-gray-600 mt-1">選一個科目開始吧!</div>
      </div>

      <div className="bg-white rounded-2xl p-4 mb-6 shadow-md inline-flex items-center gap-3">
        <Trophy className="w-8 h-8 text-yellow-500" />
        <span className="text-xl font-bold text-gray-700">收集星星:</span>
        <div className="flex items-center gap-1 bg-yellow-300 px-3 py-1 rounded-xl">
          <Star className="w-6 h-6 text-yellow-700 fill-yellow-500" />
          <span className="font-bold text-yellow-900 text-2xl">{stars}</span>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <button onClick={() => onPick('zhuyin-menu')} className="bg-gradient-to-br from-pink-400 to-purple-500 hover:scale-105 transition transform text-white rounded-3xl p-8 shadow-xl">
          <div className="text-7xl mb-3">🎯</div>
          <div className="text-3xl font-bold mb-1">注音</div>
          <div className="text-sm opacity-90">ㄅㄆㄇㄈ</div>
        </button>
        <button onClick={() => onPick('math-menu')} className="bg-gradient-to-br from-blue-400 to-cyan-500 hover:scale-105 transition transform text-white rounded-3xl p-8 shadow-xl">
          <div className="text-7xl mb-3">🔢</div>
          <div className="text-3xl font-bold mb-1">數學</div>
          <div className="text-sm opacity-90">+ − &lt; &gt;</div>
        </button>
        <button onClick={() => onPick('en-menu')} className="bg-gradient-to-br from-green-400 to-emerald-500 hover:scale-105 transition transform text-white rounded-3xl p-8 shadow-xl">
          <div className="text-7xl mb-3">🔤</div>
          <div className="text-3xl font-bold mb-1">英文</div>
          <div className="text-sm opacity-90">ABC abc</div>
        </button>
      </div>

      <div className="mt-8 text-gray-500 text-sm">每答對一題就會得到 ⭐ 星星喔!</div>
    </div>
  );
}

// ============ 科目選單 ============
function SubjectMenu({ title, color, games, onStart }) {
  return (
    <div className="text-center">
      <h2 className={`text-4xl font-bold mb-6 bg-gradient-to-r ${color} bg-clip-text text-transparent`}>{title}</h2>
      <div className="grid grid-cols-2 gap-4">
        {games.map(g => (
          <button key={g.id} onClick={() => onStart(g.id)}
            className={`bg-gradient-to-br ${g.color} hover:scale-105 transition transform text-white rounded-3xl p-6 shadow-xl`}>
            <div className="text-5xl md:text-6xl mb-2">{g.icon}</div>
            <div className="text-xl md:text-2xl font-bold mb-1">{g.title}</div>
            <div className="text-xs md:text-sm opacity-90">{g.desc}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ============ 注音遊戲:聽聲找字 ============
function ListenGame({ onCorrect, onWrong, playZhuyinSound }) {
  const [target, setTarget] = useState(null);
  const [options, setOptions] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);

  const newRound = () => {
    const sh = [...ZHUYIN_DATA].sort(() => Math.random() - 0.5);
    const t = sh[0];
    setTarget(t);
    setOptions(sh.slice(0, 4).sort(() => Math.random() - 0.5));
    setFeedback(null);
    setTimeout(() => playZhuyinSound(t), 300);
  };

  useEffect(() => { newRound(); }, []);

  const handle = (item) => {
    if (feedback) return;
    if (item.symbol === target.symbol) {
      setFeedback({ type: 'correct', symbol: item.symbol });
      setScore(s => s + 1);
      onCorrect();
      setTimeout(newRound, 1500);
    } else {
      setFeedback({ type: 'wrong', symbol: item.symbol });
      onWrong();
      setTimeout(() => setFeedback(null), 1000);
    }
  };

  if (!target) return null;
  return (
    <div className="text-center">
      <h2 className="text-3xl font-bold text-blue-600 mb-4">👂 聽聲找字</h2>
      <button onClick={() => playZhuyinSound(target)}
        className="bg-white rounded-3xl p-8 shadow-xl mb-4 hover:scale-105 transition w-full border-4 border-blue-300">
        <div className="text-7xl mb-2">{target.emoji}</div>
        <div className="text-xl text-gray-600 mb-2">點我再聽一次</div>
        <Volume2 className="w-12 h-12 mx-auto text-blue-500" />
      </button>
      <p className="text-xl text-gray-700 mb-4 font-bold">是哪個注音符號呢?</p>
      <div className="grid grid-cols-2 gap-4">
        {options.map(opt => {
          const c = feedback?.symbol === opt.symbol;
          let bg = 'bg-white hover:bg-yellow-100';
          if (c) bg = feedback.type === 'correct' ? 'bg-green-300 scale-110' : 'bg-red-300';
          return (
            <button key={opt.symbol} onClick={() => handle(opt)}
              className={`${bg} rounded-3xl p-6 shadow-xl border-4 border-yellow-200 transition`}>
              <div className="text-7xl font-bold text-purple-600">{opt.symbol}</div>
            </button>
          );
        })}
      </div>
      {feedback?.type === 'correct' && <div className="mt-6 text-4xl font-bold text-green-600 animate-bounce">答對了!⭐</div>}
      {feedback?.type === 'wrong' && <div className="mt-6 text-2xl font-bold text-red-500">再聽聽看!👂</div>}
      <div className="mt-4 text-gray-600">答對:{score} 題</div>
    </div>
  );
}

// ============ 注音遊戲:拼字 (含聲符) ============
function SpellGame({ onCorrect, onWrong, speakWord, playSound }) {
  const [current, setCurrent] = useState(null);
  const [userInput, setUserInput] = useState([]);
  const [userTone, setUserTone] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [opts, setOpts] = useState([]);

  const newRound = () => {
    const w = WORDS_LEVEL2[Math.floor(Math.random() * WORDS_LEVEL2.length)];
    setCurrent(w);
    setUserInput([]);
    setUserTone(null);
    setFeedback(null);
    const cs = w.zhuyin;
    const d = ZHUYIN_DATA.filter(z => !cs.includes(z.symbol)).sort(() => Math.random() - 0.5).slice(0, 6 - cs.length).map(z => z.symbol);
    setOpts([...cs, ...d].sort(() => Math.random() - 0.5));
    setTimeout(() => speakWord(w.word), 300);
  };

  useEffect(() => { newRound(); }, []);

  const handleAdd = (sym) => {
    if (feedback || userInput.length >= current.zhuyin.length) return;
    playSound('tap');
    setUserInput([...userInput, sym]);
  };

  const handleTone = (tone) => {
    if (feedback) return;
    playSound('tap');
    setUserTone(tone);
    const zhuyinOk = userInput.every((s, i) => s === current.zhuyin[i]);
    const toneOk = tone === current.tone;
    if (zhuyinOk && toneOk) {
      setFeedback({ type: 'correct' });
      setScore(s => s + 1);
      onCorrect();
      setTimeout(newRound, 2000);
    } else {
      setFeedback({ type: 'wrong' });
      onWrong();
      setTimeout(() => { setUserInput([]); setUserTone(null); setFeedback(null); }, 1800);
    }
  };

  const handleClear = () => { setUserInput([]); setUserTone(null); setFeedback(null); };

  if (!current) return null;
  const zhuyinComplete = userInput.length === current.zhuyin.length;

  return (
    <div className="text-center">
      <h2 className="text-3xl font-bold text-red-500 mb-4">✏️ 注音拼字</h2>
      <button onClick={() => speakWord(current.word)}
        className="bg-white rounded-3xl p-6 shadow-xl mb-4 w-full hover:scale-105 transition border-4 border-pink-300">
        <div className="text-7xl mb-2">{current.emoji}</div>
        <div className="text-6xl font-bold text-purple-700 mb-2">{current.word}</div>
        <div className="flex items-center justify-center gap-2 text-pink-500">
          <Volume2 className="w-6 h-6" /><span>點我聽發音</span>
        </div>
      </button>

      <div className="bg-yellow-100 rounded-2xl p-4 mb-4 min-h-20 flex items-center justify-center gap-1 border-4 border-yellow-300">
        {userInput.length === 0 ? <span className="text-gray-400 text-xl">先選注音,再選聲符</span> : (
          <>
            {userInput.map((s, i) => <span key={i} className="text-5xl font-bold text-purple-600 animate-fade-in">{s}</span>)}
            {userTone !== null && <span className="text-5xl font-bold text-red-500 ml-1 animate-fade-in">{TONE_MARKS[userTone] || 'ˉ'}</span>}
          </>
        )}
      </div>

      {!zhuyinComplete && (
        <>
          <p className="text-base text-gray-600 mb-2">① 選注音 ({userInput.length}/{current.zhuyin.length})</p>
          <div className="grid grid-cols-3 gap-3 mb-4">
            {opts.map((s, i) => (
              <button key={i} onClick={() => handleAdd(s)} disabled={!!feedback}
                className="bg-white hover:bg-purple-100 rounded-2xl p-4 shadow-md disabled:opacity-50 border-2 border-purple-200">
                <span className="text-4xl font-bold text-purple-600">{s}</span>
              </button>
            ))}
          </div>
        </>
      )}

      {zhuyinComplete && (
        <>
          <p className="text-base text-gray-600 mb-2">② 選聲符</p>
          <div className="grid grid-cols-4 gap-2 mb-4">
            {[1, 2, 3, 4].map(t => {
              const isSelected = userTone === t;
              let bg = 'bg-white hover:bg-red-100 border-red-200';
              if (isSelected && feedback?.type === 'correct') bg = 'bg-green-300 border-green-400';
              else if (isSelected && feedback?.type === 'wrong') bg = 'bg-red-300 border-red-400 animate-shake';
              else if (isSelected) bg = 'bg-yellow-200 border-yellow-400';
              return (
                <button key={t} onClick={() => handleTone(t)} disabled={!!feedback}
                  className={`${bg} rounded-2xl p-3 shadow-md disabled:opacity-50 border-2 transition`}>
                  <div className="text-4xl font-bold text-red-500 h-12 flex items-center justify-center">
                    {TONE_MARKS[t] || <span className="text-gray-400 text-2xl">無</span>}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{t}聲</div>
                </button>
              );
            })}
          </div>
        </>
      )}

      <button onClick={handleClear} className="bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-xl py-2 px-4 mb-4 flex items-center gap-2 mx-auto">
        <RefreshCw className="w-4 h-4" />重新拼
      </button>
      {feedback?.type === 'correct' && <div className="text-4xl font-bold text-green-600 animate-bounce">答對了!⭐⭐</div>}
      {feedback?.type === 'wrong' && (
        <div className="text-xl font-bold text-red-500">
          正確答案是 {current.zhuyin.join('')}{TONE_MARKS[current.tone] || ''} ({current.tone}聲)
        </div>
      )}
      <div className="mt-4 text-gray-600">答對:{score} 題</div>
    </div>
  );
}

// ============ 注音遊戲:聽音拼讀 ============
function ListenSpellGame({ onCorrect, onWrong, speakWord, playSound }) {
  const [current, setCurrent] = useState(null);
  const [userInput, setUserInput] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [opts, setOpts] = useState([]);
  const [showHint, setShowHint] = useState(false);

  const newRound = () => {
    const w = WORDS_LEVEL2[Math.floor(Math.random() * WORDS_LEVEL2.length)];
    setCurrent(w);
    setUserInput([]);
    setFeedback(null);
    setShowHint(false);
    const cs = w.zhuyin;
    const d = ZHUYIN_DATA.filter(z => !cs.includes(z.symbol)).sort(() => Math.random() - 0.5).slice(0, 6 - cs.length).map(z => z.symbol);
    setOpts([...cs, ...d].sort(() => Math.random() - 0.5));
    setTimeout(() => speakWord(w.word), 300);
  };

  useEffect(() => { newRound(); }, []);

  const handleAdd = (sym) => {
    if (feedback) return;
    playSound('tap');
    const ni = [...userInput, sym];
    setUserInput(ni);
    if (ni.length === current.zhuyin.length) {
      const ok = ni.every((s, i) => s === current.zhuyin[i]);
      if (ok) {
        setFeedback({ type: 'correct' });
        setScore(s => s + 1);
        onCorrect();
        setTimeout(newRound, 2000);
      } else {
        setFeedback({ type: 'wrong' });
        onWrong();
        setTimeout(() => { setUserInput([]); setFeedback(null); }, 1500);
      }
    }
  };

  if (!current) return null;
  return (
    <div className="text-center">
      <h2 className="text-3xl font-bold text-purple-600 mb-4">🎵 聽音拼讀</h2>
      <button onClick={() => speakWord(current.word)}
        className="bg-gradient-to-br from-purple-200 to-pink-200 rounded-3xl p-8 shadow-xl mb-4 w-full hover:scale-105 transition border-4 border-purple-300">
        <Volume2 className="w-16 h-16 mx-auto text-purple-600 mb-2" />
        <div className="text-2xl font-bold text-purple-700">點我聽發音</div>
        <div className="text-sm text-purple-500 mt-2">聽聽看是什麼字</div>
      </button>
      <div className="bg-yellow-100 rounded-2xl p-4 mb-4 min-h-20 flex items-center justify-center gap-2 border-4 border-yellow-300">
        {userInput.length === 0 ? <span className="text-gray-400 text-xl">用注音拼出來</span> :
          userInput.map((s, i) => <span key={i} className="text-5xl font-bold text-purple-600">{s}</span>)}
        <span className="text-2xl text-gray-400 ml-2">({current.zhuyin.length} 個)</span>
      </div>
      <div className="grid grid-cols-3 gap-3 mb-4">
        {opts.map((s, i) => (
          <button key={i} onClick={() => handleAdd(s)} disabled={!!feedback}
            className="bg-white hover:bg-purple-100 rounded-2xl p-4 shadow-md disabled:opacity-50 border-2 border-purple-200">
            <span className="text-4xl font-bold text-purple-600">{s}</span>
          </button>
        ))}
      </div>
      <div className="flex gap-2 justify-center mb-4">
        <button onClick={() => { setUserInput([]); setFeedback(null); }} className="bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-xl py-2 px-4 flex items-center gap-2">
          <RefreshCw className="w-4 h-4" />重新拼
        </button>
        <button onClick={() => setShowHint(!showHint)} className="bg-yellow-300 hover:bg-yellow-400 text-gray-700 rounded-xl py-2 px-4">💡 看提示</button>
      </div>
      {showHint && (
        <div className="bg-yellow-50 rounded-2xl p-4 mb-4 border-2 border-yellow-300">
          <div className="text-5xl mb-1">{current.emoji}</div>
          <div className="text-3xl font-bold text-purple-600">{current.word}</div>
        </div>
      )}
      {feedback?.type === 'correct' && <div className="text-4xl font-bold text-green-600 animate-bounce">太厲害了!⭐⭐</div>}
      {feedback?.type === 'wrong' && <div className="text-xl font-bold text-red-500">答案是 {current.zhuyin.join(' ')}({current.word})</div>}
      <div className="mt-4 text-gray-600">答對:{score} 題</div>
    </div>
  );
}

// ============ 通用打地鼠引擎 ============
function useWhackGame(pickTarget, getDistractor, targetMatchFn) {
  const [target, setTarget] = useState(null);
  const [moles, setMoles] = useState([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);
  const moleIdRef = useRef(0);
  const scoreRef = useRef(0);
  const targetRef = useRef(null);

  const start = () => {
    setStarted(true);
    setScore(0);
    scoreRef.current = 0;
    setTimeLeft(30);
    setGameOver(false);
    setMoles([]);
    const t = pickTarget();
    targetRef.current = t;
    setTarget(t);
  };

  useEffect(() => {
    if (!started || gameOver) return;
    const t = setInterval(() => setTimeLeft(x => {
      if (x <= 1) { setGameOver(true); setStarted(false); return 0; }
      return x - 1;
    }), 1000);
    return () => clearInterval(t);
  }, [started, gameOver]);

  useEffect(() => {
    if (!started || gameOver || !target) return;
    const spawnMole = () => {
      setMoles(prev => {
        if (prev.length >= 7) return prev;
        const used = new Set(prev.map(x => x.position));
        const free = [];
        for (let p = 0; p < 9; p++) if (!used.has(p)) free.push(p);
        if (free.length === 0) return prev;
        const position = free[Math.floor(Math.random() * free.length)];
        const val = Math.random() < 0.5 ? target : getDistractor(target);
        const m = { id: moleIdRef.current++, value: val, position, createdAt: Date.now() };
        return [...prev, m];
      });
    };
    const initial = setTimeout(spawnMole, 100);
    const spawn = setInterval(spawnMole, 450);
    const clean = setInterval(() => setMoles(prev => prev.filter(m => Date.now() - m.createdAt < 1800)), 150);
    return () => { clearTimeout(initial); clearInterval(spawn); clearInterval(clean); };
  }, [started, gameOver, target]);

  const hit = (mole, onCorrect, onWrong, refreshTarget) => {
    if (targetMatchFn(mole.value, target)) {
      const ns = scoreRef.current + 1;
      scoreRef.current = ns;
      setScore(ns);
      onCorrect();
      setMoles(prev => prev.filter(m => m.id !== mole.id));
      if (ns > 0 && ns % 3 === 0 && refreshTarget) {
        let nt = pickTarget();
        let tries = 0;
        while (nt === targetRef.current && tries < 10) {
          nt = pickTarget();
          tries++;
        }
        targetRef.current = nt;
        setTarget(nt);
      }
    } else {
      onWrong();
      setMoles(prev => prev.filter(m => m.id !== mole.id));
    }
  };

  return { target, moles, score, timeLeft, gameOver, started, start, hit };
}

function WhackBoard({ target, moles, score, timeLeft, gameOver, started, start, hit, title, color, intro, displayTarget }) {
  if (!started && !gameOver) {
    return (
      <div className="text-center">
        <h2 className={`text-3xl font-bold ${color} mb-4`}>{title}</h2>
        <div className="bg-white rounded-3xl p-8 shadow-xl mb-4">
          <div className="text-7xl mb-4">🐹</div>
          {intro}
          <button onClick={start} className="bg-gradient-to-r from-orange-400 to-red-400 text-white text-2xl font-bold rounded-2xl px-8 py-4 shadow-lg hover:scale-105 transition mt-4">
            開始遊戲 🚀
          </button>
        </div>
      </div>
    );
  }
  if (gameOver) {
    return (
      <div className="text-center">
        <h2 className={`text-3xl font-bold ${color} mb-4`}>🎉 時間到!</h2>
        <div className="bg-white rounded-3xl p-8 shadow-xl mb-4">
          <Trophy className="w-20 h-20 mx-auto text-yellow-500 mb-2" />
          <div className="text-2xl text-gray-600 mb-2">你的成績</div>
          <div className="text-7xl font-bold text-purple-600 mb-4">{score}</div>
          <div className="text-xl text-gray-600 mb-4">
            {score >= 20 ? '太厲害了!⭐⭐⭐' : score >= 10 ? '做得很好!⭐⭐' : '繼續加油!⭐'}
          </div>
          <button onClick={start} className="bg-gradient-to-r from-orange-400 to-red-400 text-white text-xl font-bold rounded-2xl px-6 py-3 shadow-lg hover:scale-105 transition">
            再玩一次 🔄
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="text-center">
      <div className="flex justify-between items-center mb-4 bg-white rounded-2xl p-3 shadow-md">
        <div className="text-lg"><span className="text-gray-600">分數: </span><span className="font-bold text-purple-600 text-2xl">{score}</span></div>
        <div className="bg-orange-300 rounded-xl px-4 py-2 font-bold text-2xl">⏰ {timeLeft}</div>
      </div>
      <div className="bg-gradient-to-br from-yellow-200 to-orange-200 rounded-2xl p-4 mb-4 shadow-lg border-4 border-orange-300">
        <p className="text-lg text-gray-700">找出這個:</p>
        <div className="text-7xl font-bold text-red-600">{displayTarget}</div>
      </div>
      <div className="bg-green-200 rounded-3xl p-3 shadow-xl border-4 border-green-400">
        <div className="grid grid-cols-3 gap-2">
          {[...Array(9)].map((_, pos) => {
            const mole = moles.find(m => m.position === pos);
            return (
              <div key={pos} className="aspect-square bg-green-700 rounded-full flex items-center justify-center relative overflow-hidden shadow-inner">
                {mole && (
                  <button onClick={() => hit(mole)} className="absolute inset-2 bg-gradient-to-br from-yellow-200 to-orange-300 rounded-full flex items-center justify-center shadow-lg hover:scale-95 transition transform animate-pop">
                    <span className="text-3xl md:text-4xl font-bold text-purple-700">{mole.value}</span>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ============ 注音遊戲:打地鼠 ============
function WhackGame({ onCorrect, onWrong }) {
  const pickTarget = () => ZHUYIN_DATA[Math.floor(Math.random() * ZHUYIN_DATA.length)].symbol;
  const getDistractor = (currentTarget) => {
    let s;
    let tries = 0;
    do {
      s = ZHUYIN_DATA[Math.floor(Math.random() * ZHUYIN_DATA.length)].symbol;
      tries++;
    } while (s === currentTarget && tries < 10);
    return s;
  };
  const game = useWhackGame(pickTarget, getDistractor, (a, b) => a === b);

  return <WhackBoard {...game}
    hit={(m) => game.hit(m, onCorrect, onWrong, true)}
    title="🔨 注音打地鼠" color="text-orange-500"
    displayTarget={game.target}
    intro={<>
      <p className="text-lg text-gray-700 mb-2">畫面上會出現很多注音符號</p>
      <p className="text-lg text-gray-700 mb-2">只能點題目要求的那一個喔!</p>
      <p className="text-lg text-gray-700">30 秒挑戰開始!</p>
    </>}
  />;
}

// ============ 數學:加法 ============
function MathAddGame({ onCorrect, onWrong }) {
  const [problem, setProblem] = useState(null);
  const [opts, setOpts] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);

  const newRound = () => {
    const a = 1 + Math.floor(Math.random() * 19);
    const b = 1 + Math.floor(Math.random() * 19);
    const ans = a + b;
    const ds = new Set();
    while (ds.size < 3) {
      const d = ans + (Math.random() < 0.5 ? -1 : 1) * (1 + Math.floor(Math.random() * 5));
      if (d !== ans && d > 0) ds.add(d);
    }
    setProblem({ a, b, ans });
    setOpts([...ds, ans].sort(() => Math.random() - 0.5));
    setFeedback(null);
  };

  useEffect(() => { newRound(); }, []);

  const pick = (n) => {
    if (feedback) return;
    if (n === problem.ans) {
      setFeedback({ type: 'correct', n });
      setScore(s => s + 1);
      onCorrect();
      setTimeout(newRound, 1300);
    } else {
      setFeedback({ type: 'wrong', n });
      onWrong();
      setTimeout(() => setFeedback(null), 900);
    }
  };

  if (!problem) return null;
  return (
    <div className="text-center">
      <h2 className="text-3xl font-bold text-blue-600 mb-4">➕ 加法練習</h2>
      <div className="bg-white rounded-3xl p-8 shadow-xl mb-4 border-4 border-blue-300">
        <div className="text-6xl md:text-7xl font-bold text-purple-700">{problem.a} + {problem.b} = ?</div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {opts.map((n, i) => {
          const c = feedback?.n === n;
          let bg = 'bg-white hover:bg-yellow-100';
          if (c) bg = feedback.type === 'correct' ? 'bg-green-300 scale-110' : 'bg-red-300 animate-shake';
          return (
            <button key={i} onClick={() => pick(n)}
              className={`${bg} rounded-3xl p-6 shadow-xl border-4 border-yellow-200 transition`}>
              <span className="text-5xl font-bold text-purple-600">{n}</span>
            </button>
          );
        })}
      </div>
      {feedback?.type === 'correct' && <div className="mt-6 text-4xl font-bold text-green-600 animate-bounce">答對了!⭐</div>}
      {feedback?.type === 'wrong' && <div className="mt-6 text-2xl font-bold text-red-500">再算一次!💪</div>}
      <div className="mt-4 text-gray-600">答對:{score} 題</div>
    </div>
  );
}

// ============ 數學:減法 ============
function MathSubGame({ onCorrect, onWrong }) {
  const [problem, setProblem] = useState(null);
  const [opts, setOpts] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);

  const newRound = () => {
    let a = 5 + Math.floor(Math.random() * 25);
    let b = 1 + Math.floor(Math.random() * (a - 1));
    const ans = a - b;
    const ds = new Set();
    while (ds.size < 3) {
      const d = ans + (Math.random() < 0.5 ? -1 : 1) * (1 + Math.floor(Math.random() * 5));
      if (d !== ans && d >= 0) ds.add(d);
    }
    setProblem({ a, b, ans });
    setOpts([...ds, ans].sort(() => Math.random() - 0.5));
    setFeedback(null);
  };

  useEffect(() => { newRound(); }, []);

  const pick = (n) => {
    if (feedback) return;
    if (n === problem.ans) {
      setFeedback({ type: 'correct', n });
      setScore(s => s + 1);
      onCorrect();
      setTimeout(newRound, 1300);
    } else {
      setFeedback({ type: 'wrong', n });
      onWrong();
      setTimeout(() => setFeedback(null), 900);
    }
  };

  if (!problem) return null;
  return (
    <div className="text-center">
      <h2 className="text-3xl font-bold text-cyan-600 mb-4">➖ 減法練習</h2>
      <div className="bg-white rounded-3xl p-8 shadow-xl mb-4 border-4 border-cyan-300">
        <div className="text-6xl md:text-7xl font-bold text-purple-700">{problem.a} − {problem.b} = ?</div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {opts.map((n, i) => {
          const c = feedback?.n === n;
          let bg = 'bg-white hover:bg-yellow-100';
          if (c) bg = feedback.type === 'correct' ? 'bg-green-300 scale-110' : 'bg-red-300 animate-shake';
          return (
            <button key={i} onClick={() => pick(n)}
              className={`${bg} rounded-3xl p-6 shadow-xl border-4 border-yellow-200 transition`}>
              <span className="text-5xl font-bold text-purple-600">{n}</span>
            </button>
          );
        })}
      </div>
      {feedback?.type === 'correct' && <div className="mt-6 text-4xl font-bold text-green-600 animate-bounce">答對了!⭐</div>}
      {feedback?.type === 'wrong' && <div className="mt-6 text-2xl font-bold text-red-500">再算一次!💪</div>}
      <div className="mt-4 text-gray-600">答對:{score} 題</div>
    </div>
  );
}

// ============ 數學:比大小 ============
function MathCompareGame({ onCorrect, onWrong }) {
  const [pair, setPair] = useState(null);
  const [question, setQuestion] = useState('bigger');
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);

  const newRound = () => {
    let a = 1 + Math.floor(Math.random() * 99);
    let b = 1 + Math.floor(Math.random() * 99);
    while (a === b) b = 1 + Math.floor(Math.random() * 99);
    setPair({ a, b });
    setQuestion(Math.random() < 0.5 ? 'bigger' : 'smaller');
    setFeedback(null);
  };

  useEffect(() => { newRound(); }, []);

  const pick = (which) => {
    if (feedback) return;
    const correct = question === 'bigger' ? (pair.a > pair.b ? 'a' : 'b') : (pair.a < pair.b ? 'a' : 'b');
    if (which === correct) {
      setFeedback({ type: 'correct', which });
      setScore(s => s + 1);
      onCorrect();
      setTimeout(newRound, 1200);
    } else {
      setFeedback({ type: 'wrong', which });
      onWrong();
      setTimeout(() => setFeedback(null), 900);
    }
  };

  if (!pair) return null;
  return (
    <div className="text-center">
      <h2 className="text-3xl font-bold text-teal-600 mb-4">⚖️ 比大小</h2>
      <div className="bg-white rounded-2xl p-4 mb-4 shadow-md border-4 border-teal-300">
        <div className="text-2xl md:text-3xl font-bold text-gray-700">
          哪個數字{question === 'bigger' ? '比較大' : '比較小'}?
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {['a', 'b'].map(k => {
          const c = feedback?.which === k;
          let bg = 'bg-white hover:bg-yellow-100';
          if (c) bg = feedback.type === 'correct' ? 'bg-green-300 scale-110' : 'bg-red-300 animate-shake';
          return (
            <button key={k} onClick={() => pick(k)}
              className={`${bg} rounded-3xl p-8 shadow-xl border-4 border-yellow-200 transition`}>
              <span className="text-7xl font-bold text-purple-600">{pair[k]}</span>
            </button>
          );
        })}
      </div>
      {feedback?.type === 'correct' && <div className="mt-6 text-4xl font-bold text-green-600 animate-bounce">答對了!⭐</div>}
      {feedback?.type === 'wrong' && <div className="mt-6 text-2xl font-bold text-red-500">再想想看!🤔</div>}
      <div className="mt-4 text-gray-600">答對:{score} 題</div>
    </div>
  );
}

// ============ 數學:採水果湊數字 ============
function MathFruitGame({ onCorrect, onWrong, playSound }) {
  const FRUIT_EMOJIS = ['🍎', '🍊', '🍇', '🍓', '🍑', '🍒', '🍐', '🍌', '🥝', '🍉'];
  const [target, setTarget] = useState(10);
  const [fruits, setFruits] = useState([]);
  const [selected, setSelected] = useState([]);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [streak, setStreak] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const fruitIdRef = useRef(0);

  const generateRound = (lvl) => {
    const minT = 5 + (lvl - 1) * 4;
    const maxT = 12 + (lvl - 1) * 5;
    const newTarget = minT + Math.floor(Math.random() * (maxT - minT + 1));
    const maxFruitVal = Math.min(newTarget - 1, 20);

    const newFruits = [];

    for (let i = 0; i < 2; i++) {
      let a, b;
      let tries = 0;
      do {
        a = 1 + Math.floor(Math.random() * Math.min(maxFruitVal, newTarget - 1));
        b = newTarget - a;
        tries++;
      } while ((b < 1 || b > maxFruitVal) && tries < 20);
      if (b >= 1 && b <= maxFruitVal) {
        newFruits.push({ id: fruitIdRef.current++, value: a });
        newFruits.push({ id: fruitIdRef.current++, value: b });
      }
    }

    let safety = 50;
    while (newFruits.length < 8 && safety > 0) {
      safety--;
      const v = 1 + Math.floor(Math.random() * maxFruitVal);
      const wouldPair = newFruits.some(f => f.value + v === newTarget);
      if (!wouldPair || newFruits.length < 4) {
        newFruits.push({ id: fruitIdRef.current++, value: v });
      }
    }
    while (newFruits.length < 8) {
      newFruits.push({ id: fruitIdRef.current++, value: 1 + Math.floor(Math.random() * maxFruitVal) });
    }

    const shuffled = newFruits.sort(() => Math.random() - 0.5).slice(0, 8).map(f => ({
      ...f,
      emoji: FRUIT_EMOJIS[Math.floor(Math.random() * FRUIT_EMOJIS.length)],
    }));

    setTarget(newTarget);
    setFruits(shuffled);
    setSelected([]);
    setFeedback(null);
  };

  useEffect(() => { generateRound(1); }, []);

  const handlePick = (id) => {
    if (feedback) return;
    if (selected.includes(id)) {
      setSelected(selected.filter(s => s !== id));
      playSound('tap');
      return;
    }
    playSound('tap');
    const ns = [...selected, id];
    setSelected(ns);

    if (ns.length === 2) {
      const sum = ns.reduce((acc, sid) => acc + fruits.find(f => f.id === sid).value, 0);
      if (sum === target) {
        setFeedback({ type: 'correct', ids: ns });
        onCorrect();
        const newScore = score + 1;
        const newStreak = streak + 1;
        setScore(newScore);
        setStreak(newStreak);
        const shouldLevelUp = newScore > 0 && newScore % 5 === 0;
        setTimeout(() => {
          if (shouldLevelUp) {
            setLevel(l => {
              const nl = l + 1;
              generateRound(nl);
              return nl;
            });
          } else {
            generateRound(level);
          }
        }, shouldLevelUp ? 1800 : 1200);
      } else {
        setFeedback({ type: 'wrong', ids: ns, sum });
        onWrong();
        setStreak(0);
        setTimeout(() => {
          setSelected([]);
          setFeedback(null);
        }, 1200);
      }
    }
  };

  const currentSum = selected.reduce((acc, sid) => {
    const f = fruits.find(x => x.id === sid);
    return acc + (f ? f.value : 0);
  }, 0);

  const isLevelUp = feedback?.type === 'correct' && score > 0 && (score + 1) % 5 === 0;

  return (
    <div className="text-center">
      <h2 className="text-3xl font-bold text-green-600 mb-2">🍎 採水果湊數字</h2>

      <div className="flex justify-between items-center mb-3 bg-white rounded-2xl p-2 shadow-md">
        <div className="flex items-center gap-2">
          <span className="bg-purple-200 px-3 py-1 rounded-xl font-bold text-purple-700">Lv.{level}</span>
          {streak >= 3 && (
            <span className="bg-yellow-300 px-2 py-1 rounded-xl text-sm font-bold animate-pulse">
              🔥 連對 {streak}!
            </span>
          )}
        </div>
        <div className="text-lg">
          <span className="text-gray-600">分數: </span>
          <span className="font-bold text-purple-600 text-xl">{score}</span>
        </div>
      </div>

      <div className="bg-gradient-to-br from-orange-200 to-yellow-200 rounded-3xl p-3 mb-3 shadow-lg border-4 border-orange-300">
        <div className="text-base text-gray-700">採兩顆水果,加起來等於</div>
        <div className="text-6xl font-bold text-red-600">{target}</div>
      </div>

      <div className="bg-yellow-100 rounded-2xl p-3 mb-3 min-h-14 flex items-center justify-center gap-2 border-2 border-yellow-300">
        {selected.length === 0 ? (
          <span className="text-gray-400">點兩顆水果</span>
        ) : (
          <>
            {selected.map((sid, i) => {
              const f = fruits.find(x => x.id === sid);
              if (!f) return null;
              return (
                <React.Fragment key={sid}>
                  {i > 0 && <span className="text-2xl text-gray-500">+</span>}
                  <span className="text-3xl font-bold text-purple-700">{f.value}</span>
                </React.Fragment>
              );
            })}
            {selected.length === 2 && (
              <>
                <span className="text-2xl text-gray-500">=</span>
                <span className={`text-3xl font-bold ${
                  feedback?.type === 'correct' ? 'text-green-600' :
                  feedback?.type === 'wrong' ? 'text-red-500' : 'text-purple-700'
                }`}>{currentSum}</span>
              </>
            )}
          </>
        )}
      </div>

      <div className="bg-gradient-to-b from-lime-300 to-green-500 rounded-3xl p-3 shadow-xl mb-3 border-4 border-green-600 relative">
        <div className="absolute -top-3 left-3 text-4xl">🌳</div>
        <div className="absolute -top-3 right-3 text-4xl">🌳</div>
        <div className="grid grid-cols-4 gap-2 pt-4">
          {fruits.map(f => {
            const isSelected = selected.includes(f.id);
            const isCorrect = feedback?.type === 'correct' && feedback.ids.includes(f.id);
            const isWrong = feedback?.type === 'wrong' && feedback.ids.includes(f.id);
            let cls = 'bg-white hover:bg-yellow-100 hover:scale-105';
            if (isCorrect) cls = 'bg-green-300 scale-110 animate-bounce';
            else if (isWrong) cls = 'bg-red-300 animate-shake';
            else if (isSelected) cls = 'bg-yellow-300 scale-105 ring-4 ring-yellow-500';
            return (
              <button
                key={f.id}
                onClick={() => handlePick(f.id)}
                disabled={!!feedback}
                className={`${cls} rounded-2xl p-2 shadow-md transition transform border-2 border-yellow-400`}
              >
                <div className="text-3xl md:text-4xl">{f.emoji}</div>
                <div className="text-2xl md:text-3xl font-bold text-purple-700">{f.value}</div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-3 shadow-md flex items-center gap-3">
        <span className="text-3xl">🐿️</span>
        <div className="flex-1 bg-gray-200 rounded-full h-4 overflow-hidden">
          <div
            className="bg-gradient-to-r from-yellow-400 to-orange-400 h-full transition-all duration-500"
            style={{ width: `${(score % 5) * 20}%` }}
          />
        </div>
        <span className="text-sm text-gray-600 font-bold whitespace-nowrap">{score % 5}/5 升等</span>
      </div>

      {isLevelUp && (
        <div className="mt-3 text-4xl font-bold text-orange-500 animate-bounce">
          🎉 升等啦! Lv.{level + 1} 🎉
        </div>
      )}
      {feedback?.type === 'correct' && !isLevelUp && (
        <div className="mt-3 text-3xl font-bold text-green-600 animate-bounce">
          採到了!⭐
        </div>
      )}
      {feedback?.type === 'wrong' && (
        <div className="mt-3 text-xl font-bold text-red-500">
          不是 {target} 喔!再試試 💪
        </div>
      )}
    </div>
  );
}

// ============ 英文:看圖選字 ============
function EnPickGame({ onCorrect, onWrong, speakEn }) {
  const [target, setTarget] = useState(null);
  const [opts, setOpts] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);

  const newRound = () => {
    const sh = [...EN_WORDS].sort(() => Math.random() - 0.5);
    setTarget(sh[0]);
    setOpts(sh.slice(0, 4).sort(() => Math.random() - 0.5));
    setFeedback(null);
  };

  useEffect(() => { newRound(); }, []);

  const pick = (w) => {
    if (feedback) return;
    if (w.word === target.word) {
      setFeedback({ type: 'correct', w: w.word });
      speakEn(w.word);
      setScore(s => s + 1);
      onCorrect();
      setTimeout(newRound, 1600);
    } else {
      setFeedback({ type: 'wrong', w: w.word });
      onWrong();
      setTimeout(() => setFeedback(null), 1000);
    }
  };

  if (!target) return null;
  return (
    <div className="text-center">
      <h2 className="text-3xl font-bold text-green-600 mb-4">🖼️ 看圖選字</h2>
      <div className="bg-white rounded-3xl p-6 shadow-xl mb-4 border-4 border-green-300">
        <div className="text-8xl mb-2">{target.emoji}</div>
        <div className="text-3xl font-bold text-purple-700">{target.zh}</div>
      </div>
      <p className="text-xl text-gray-700 mb-4 font-bold">是哪個英文單字呢?</p>
      <div className="grid grid-cols-2 gap-3">
        {opts.map((o, i) => {
          const c = feedback?.w === o.word;
          let bg = 'bg-white hover:bg-yellow-100';
          if (c) bg = feedback.type === 'correct' ? 'bg-green-300 scale-110' : 'bg-red-300 animate-shake';
          return (
            <button key={i} onClick={() => pick(o)}
              className={`${bg} rounded-3xl p-5 shadow-xl border-4 border-green-200 transition`}>
              <span className="text-3xl md:text-4xl font-bold text-purple-600 lowercase">{o.word}</span>
            </button>
          );
        })}
      </div>
      {feedback?.type === 'correct' && <div className="mt-6 text-4xl font-bold text-green-600 animate-bounce">答對了!⭐</div>}
      {feedback?.type === 'wrong' && <div className="mt-6 text-2xl font-bold text-red-500">再試試看!💪</div>}
      <div className="mt-4 text-gray-600">答對:{score} 題</div>
    </div>
  );
}

// ============ 英文:聽音選圖 ============
function EnListenGame({ onCorrect, onWrong, speakEn }) {
  const [target, setTarget] = useState(null);
  const [opts, setOpts] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);

  const newRound = () => {
    const sh = [...EN_WORDS].sort(() => Math.random() - 0.5);
    const t = sh[0];
    setTarget(t);
    setOpts(sh.slice(0, 4).sort(() => Math.random() - 0.5));
    setFeedback(null);
    setTimeout(() => speakEn(t.word), 400);
  };

  useEffect(() => { newRound(); }, []);

  const pick = (w) => {
    if (feedback) return;
    if (w.word === target.word) {
      setFeedback({ type: 'correct', w: w.word });
      setScore(s => s + 1);
      onCorrect();
      setTimeout(newRound, 1500);
    } else {
      setFeedback({ type: 'wrong', w: w.word });
      onWrong();
      setTimeout(() => setFeedback(null), 1000);
    }
  };

  if (!target) return null;
  return (
    <div className="text-center">
      <h2 className="text-3xl font-bold text-lime-600 mb-4">👂 聽音選圖</h2>
      <button onClick={() => speakEn(target.word)}
        className="bg-gradient-to-br from-lime-200 to-yellow-200 rounded-3xl p-8 shadow-xl mb-4 w-full hover:scale-105 transition border-4 border-lime-300">
        <Volume2 className="w-16 h-16 mx-auto text-lime-600 mb-2" />
        <div className="text-2xl font-bold text-lime-700">點我聽英文</div>
      </button>
      <p className="text-xl text-gray-700 mb-4 font-bold">是哪一個呢?</p>
      <div className="grid grid-cols-2 gap-3">
        {opts.map((o, i) => {
          const c = feedback?.w === o.word;
          let bg = 'bg-white hover:bg-yellow-100';
          if (c) bg = feedback.type === 'correct' ? 'bg-green-300 scale-110' : 'bg-red-300 animate-shake';
          return (
            <button key={i} onClick={() => pick(o)}
              className={`${bg} rounded-3xl p-4 shadow-xl border-4 border-yellow-200 transition`}>
              <div className="text-6xl mb-1">{o.emoji}</div>
              <div className="text-base font-bold text-purple-600">{o.zh}</div>
            </button>
          );
        })}
      </div>
      {feedback?.type === 'correct' && <div className="mt-6 text-4xl font-bold text-green-600 animate-bounce">答對了!⭐</div>}
      {feedback?.type === 'wrong' && <div className="mt-6 text-2xl font-bold text-red-500">再聽聽看!👂</div>}
      <div className="mt-4 text-gray-600">答對:{score} 題</div>
    </div>
  );
}

// ============ 英文:拼單字 ============
function EnSpellGame({ onCorrect, onWrong, speakEn, playSound }) {
  const [current, setCurrent] = useState(null);
  const [userInput, setUserInput] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [letters, setLetters] = useState([]);

  const newRound = () => {
    const w = EN_WORDS[Math.floor(Math.random() * EN_WORDS.length)];
    setCurrent(w);
    setUserInput([]);
    setFeedback(null);
    const correctLetters = w.word.split('');
    const allLetters = 'abcdefghijklmnopqrstuvwxyz';
    const distractors = [];
    while (distractors.length < Math.max(2, 8 - correctLetters.length)) {
      const l = allLetters[Math.floor(Math.random() * 26)];
      if (!correctLetters.includes(l) && !distractors.includes(l)) distractors.push(l);
    }
    setLetters([...correctLetters, ...distractors].sort(() => Math.random() - 0.5));
    setTimeout(() => speakEn(w.word), 300);
  };

  useEffect(() => { newRound(); }, []);

  const handleAdd = (idx, letter) => {
    if (feedback) return;
    playSound('tap');
    const ni = [...userInput, { letter, sourceIdx: idx }];
    setUserInput(ni);
    if (ni.length === current.word.length) {
      const guess = ni.map(x => x.letter).join('');
      if (guess === current.word) {
        setFeedback({ type: 'correct' });
        setScore(s => s + 1);
        onCorrect();
        speakEn(current.word);
        setTimeout(newRound, 2000);
      } else {
        setFeedback({ type: 'wrong' });
        onWrong();
        setTimeout(() => { setUserInput([]); setFeedback(null); }, 1500);
      }
    }
  };

  const handleClear = () => { setUserInput([]); setFeedback(null); };

  if (!current) return null;
  return (
    <div className="text-center">
      <h2 className="text-3xl font-bold text-orange-500 mb-4">✏️ 拼單字</h2>
      <button onClick={() => speakEn(current.word)}
        className="bg-white rounded-3xl p-6 shadow-xl mb-4 w-full hover:scale-105 transition border-4 border-orange-300">
        <div className="text-7xl mb-2">{current.emoji}</div>
        <div className="text-3xl font-bold text-purple-700 mb-2">{current.zh}</div>
        <div className="flex items-center justify-center gap-2 text-orange-500">
          <Volume2 className="w-6 h-6" /><span>點我聽英文</span>
        </div>
      </button>
      <div className="bg-yellow-100 rounded-2xl p-4 mb-4 min-h-20 flex items-center justify-center gap-2 border-4 border-yellow-300">
        {userInput.length === 0 ? <span className="text-gray-400 text-xl">點下面字母拼出單字</span> :
          userInput.map((x, i) => <span key={i} className="text-5xl font-bold text-purple-600 animate-fade-in lowercase">{x.letter}</span>)}
        <span className="text-2xl text-gray-400 ml-2">({current.word.length} 個)</span>
      </div>
      <div className="grid grid-cols-4 gap-2 mb-4">
        {letters.map((l, i) => {
          const used = userInput.some(x => x.sourceIdx === i);
          return (
            <button key={i} onClick={() => handleAdd(i, l)} disabled={!!feedback || used}
              className="bg-white hover:bg-orange-100 rounded-xl p-3 shadow-md disabled:opacity-30 border-2 border-orange-200">
              <span className="text-3xl font-bold text-purple-600 lowercase">{l}</span>
            </button>
          );
        })}
      </div>
      <button onClick={handleClear} className="bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-xl py-2 px-4 mb-4 flex items-center gap-2 mx-auto">
        <RefreshCw className="w-4 h-4" />重新拼
      </button>
      {feedback?.type === 'correct' && <div className="text-4xl font-bold text-green-600 animate-bounce">太厲害了!⭐⭐</div>}
      {feedback?.type === 'wrong' && <div className="text-2xl font-bold text-red-500">正確是 {current.word}</div>}
      <div className="mt-4 text-gray-600">答對:{score} 題</div>
    </div>
  );
}

// ============ 英文:大小寫配對 ============
function EnCaseGame({ onCorrect, onWrong }) {
  const [target, setTarget] = useState(null);
  const [opts, setOpts] = useState([]);
  const [mode, setMode] = useState('upper-to-lower');
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);

  const newRound = () => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const t = letters[Math.floor(Math.random() * 26)];
    const m = Math.random() < 0.5 ? 'upper-to-lower' : 'lower-to-upper';
    setTarget(t);
    setMode(m);
    const dist = new Set();
    while (dist.size < 3) {
      const d = letters[Math.floor(Math.random() * 26)];
      if (d !== t) dist.add(d);
    }
    setOpts([t, ...dist].sort(() => Math.random() - 0.5));
    setFeedback(null);
  };

  useEffect(() => { newRound(); }, []);

  const pick = (l) => {
    if (feedback) return;
    if (l === target) {
      setFeedback({ type: 'correct', l });
      setScore(s => s + 1);
      onCorrect();
      setTimeout(newRound, 1200);
    } else {
      setFeedback({ type: 'wrong', l });
      onWrong();
      setTimeout(() => setFeedback(null), 900);
    }
  };

  if (!target) return null;
  const displayTarget = mode === 'upper-to-lower' ? target : target.toLowerCase();
  return (
    <div className="text-center">
      <h2 className="text-3xl font-bold text-emerald-600 mb-4">🔤 大小寫配對</h2>
      <div className="bg-white rounded-3xl p-6 shadow-xl mb-4 border-4 border-emerald-300">
        <p className="text-lg text-gray-600 mb-2">找出{mode === 'upper-to-lower' ? '小寫' : '大寫'}:</p>
        <div className="text-9xl font-bold text-purple-700">{displayTarget}</div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {opts.map((l, i) => {
          const display = mode === 'upper-to-lower' ? l.toLowerCase() : l;
          const c = feedback?.l === l;
          let bg = 'bg-white hover:bg-yellow-100';
          if (c) bg = feedback.type === 'correct' ? 'bg-green-300 scale-110' : 'bg-red-300 animate-shake';
          return (
            <button key={i} onClick={() => pick(l)}
              className={`${bg} rounded-3xl p-6 shadow-xl border-4 border-emerald-200 transition`}>
              <span className="text-6xl font-bold text-purple-600">{display}</span>
            </button>
          );
        })}
      </div>
      {feedback?.type === 'correct' && <div className="mt-6 text-4xl font-bold text-green-600 animate-bounce">答對了!⭐</div>}
      {feedback?.type === 'wrong' && <div className="mt-6 text-2xl font-bold text-red-500">再試試看!💪</div>}
      <div className="mt-4 text-gray-600">答對:{score} 題</div>
    </div>
  );
}
