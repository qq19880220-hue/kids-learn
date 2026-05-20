import React, { useState, useEffect, useRef } from 'react';
import { Star, Home, Volume2, Trophy, RefreshCw, ArrowLeft } from 'lucide-react';
import * as Tone from 'tone';
import { loadFamily, saveFamily, subscribeFamily, generateFamilyCode } from './firebase';

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
  // 動物 animal (20)
  { word: 'cat',    zh: '貓',       emoji: '🐱', cat: 'animal' },
  { word: 'dog',    zh: '狗',       emoji: '🐶', cat: 'animal' },
  { word: 'fish',   zh: '魚',       emoji: '🐟', cat: 'animal' },
  { word: 'bird',   zh: '鳥',       emoji: '🐦', cat: 'animal' },
  { word: 'pig',    zh: '豬',       emoji: '🐷', cat: 'animal' },
  { word: 'cow',    zh: '牛',       emoji: '🐄', cat: 'animal' },
  { word: 'duck',   zh: '鴨子',     emoji: '🦆', cat: 'animal' },
  { word: 'bee',    zh: '蜜蜂',     emoji: '🐝', cat: 'animal' },
  { word: 'lion',   zh: '獅子',     emoji: '🦁', cat: 'animal' },
  { word: 'frog',   zh: '青蛙',     emoji: '🐸', cat: 'animal' },
  { word: 'fox',    zh: '狐狸',     emoji: '🦊', cat: 'animal' },
  { word: 'owl',    zh: '貓頭鷹',   emoji: '🦉', cat: 'animal' },
  { word: 'bear',   zh: '熊',       emoji: '🐻', cat: 'animal' },
  { word: 'mouse',  zh: '老鼠',     emoji: '🐭', cat: 'animal' },
  { word: 'rabbit', zh: '兔子',     emoji: '🐰', cat: 'animal' },
  { word: 'snake',  zh: '蛇',       emoji: '🐍', cat: 'animal' },
  { word: 'panda',  zh: '熊貓',     emoji: '🐼', cat: 'animal' },
  { word: 'sheep',  zh: '綿羊',     emoji: '🐑', cat: 'animal' },
  { word: 'horse',  zh: '馬',       emoji: '🐴', cat: 'animal' },
  { word: 'monkey', zh: '猴子',     emoji: '🐵', cat: 'animal' },
  // 食物 food (15)
  { word: 'apple',  zh: '蘋果',     emoji: '🍎', cat: 'food' },
  { word: 'banana', zh: '香蕉',     emoji: '🍌', cat: 'food' },
  { word: 'milk',   zh: '牛奶',     emoji: '🥛', cat: 'food' },
  { word: 'bread',  zh: '麵包',     emoji: '🍞', cat: 'food' },
  { word: 'egg',    zh: '蛋',       emoji: '🥚', cat: 'food' },
  { word: 'cake',   zh: '蛋糕',     emoji: '🎂', cat: 'food' },
  { word: 'rice',   zh: '飯',       emoji: '🍚', cat: 'food' },
  { word: 'juice',  zh: '果汁',     emoji: '🧃', cat: 'food' },
  { word: 'ice',    zh: '冰塊',     emoji: '🧊', cat: 'food' },
  { word: 'pear',   zh: '梨子',     emoji: '🍐', cat: 'food' },
  { word: 'grape',  zh: '葡萄',     emoji: '🍇', cat: 'food' },
  { word: 'melon',  zh: '哈密瓜',   emoji: '🍈', cat: 'food' },
  { word: 'lemon',  zh: '檸檬',     emoji: '🍋', cat: 'food' },
  { word: 'jam',    zh: '果醬',     emoji: '🍯', cat: 'food' },
  { word: 'ham',    zh: '火腿',     emoji: '🥓', cat: 'food' },
  // 顏色 color (8)
  { word: 'red',    zh: '紅色',     emoji: '🔴', cat: 'color' },
  { word: 'blue',   zh: '藍色',     emoji: '🔵', cat: 'color' },
  { word: 'green',  zh: '綠色',     emoji: '🟢', cat: 'color' },
  { word: 'pink',   zh: '粉色',     emoji: '🌸', cat: 'color' },
  { word: 'black',  zh: '黑色',     emoji: '⚫', cat: 'color' },
  { word: 'white',  zh: '白色',     emoji: '⚪', cat: 'color' },
  { word: 'gray',   zh: '灰色',     emoji: '🩶', cat: 'color' },
  { word: 'brown',  zh: '棕色',     emoji: '🟫', cat: 'color' },
  // 大自然 nature (12)
  { word: 'sun',    zh: '太陽',     emoji: '☀️', cat: 'nature' },
  { word: 'moon',   zh: '月亮',     emoji: '🌙', cat: 'nature' },
  { word: 'star',   zh: '星星',     emoji: '⭐', cat: 'nature' },
  { word: 'tree',   zh: '樹',       emoji: '🌳', cat: 'nature' },
  { word: 'rain',   zh: '下雨',     emoji: '☔', cat: 'nature' },
  { word: 'snow',   zh: '雪',       emoji: '❄️', cat: 'nature' },
  { word: 'sea',    zh: '海',       emoji: '🌊', cat: 'nature' },
  { word: 'fire',   zh: '火',       emoji: '🔥', cat: 'nature' },
  { word: 'cloud',  zh: '雲',       emoji: '☁️', cat: 'nature' },
  { word: 'wind',   zh: '風',       emoji: '💨', cat: 'nature' },
  { word: 'leaf',   zh: '葉子',     emoji: '🍃', cat: 'nature' },
  { word: 'sky',    zh: '天空',     emoji: '🌌', cat: 'nature' },
  // 物品 thing (15)
  { word: 'car',    zh: '車',       emoji: '🚗', cat: 'thing' },
  { word: 'book',   zh: '書',       emoji: '📚', cat: 'thing' },
  { word: 'hat',    zh: '帽子',     emoji: '🎩', cat: 'thing' },
  { word: 'ball',   zh: '球',       emoji: '⚽', cat: 'thing' },
  { word: 'bag',    zh: '包包',     emoji: '🎒', cat: 'thing' },
  { word: 'cup',    zh: '杯子',     emoji: '☕', cat: 'thing' },
  { word: 'key',    zh: '鑰匙',     emoji: '🔑', cat: 'thing' },
  { word: 'toy',    zh: '玩具',     emoji: '🧸', cat: 'thing' },
  { word: 'bed',    zh: '床',       emoji: '🛏️', cat: 'thing' },
  { word: 'pen',    zh: '筆',       emoji: '🖊️', cat: 'thing' },
  { word: 'map',    zh: '地圖',     emoji: '🗺️', cat: 'thing' },
  { word: 'lamp',   zh: '燈',       emoji: '💡', cat: 'thing' },
  { word: 'doll',   zh: '娃娃',     emoji: '🪆', cat: 'thing' },
  { word: 'kite',   zh: '風箏',     emoji: '🪁', cat: 'thing' },
  { word: 'ring',   zh: '戒指',     emoji: '💍', cat: 'thing' },
  // 身體 body (8)
  { word: 'eye',    zh: '眼睛',     emoji: '👁️', cat: 'body' },
  { word: 'ear',    zh: '耳朵',     emoji: '👂', cat: 'body' },
  { word: 'nose',   zh: '鼻子',     emoji: '👃', cat: 'body' },
  { word: 'hand',   zh: '手',       emoji: '✋', cat: 'body' },
  { word: 'foot',   zh: '腳',       emoji: '🦶', cat: 'body' },
  { word: 'lip',    zh: '嘴唇',     emoji: '👄', cat: 'body' },
  { word: 'arm',    zh: '手臂',     emoji: '💪', cat: 'body' },
  { word: 'leg',    zh: '腿',       emoji: '🦵', cat: 'body' },
  // 動作 action (12)
  { word: 'run',    zh: '跑',       emoji: '🏃', cat: 'action' },
  { word: 'jump',   zh: '跳',       emoji: '🤸', cat: 'action' },
  { word: 'sit',    zh: '坐',       emoji: '🪑', cat: 'action' },
  { word: 'eat',    zh: '吃',       emoji: '🍽️', cat: 'action' },
  { word: 'sleep',  zh: '睡覺',     emoji: '😴', cat: 'action' },
  { word: 'play',   zh: '玩',       emoji: '🎮', cat: 'action' },
  { word: 'read',   zh: '讀',       emoji: '📖', cat: 'action' },
  { word: 'sing',   zh: '唱歌',     emoji: '🎤', cat: 'action' },
  { word: 'dance',  zh: '跳舞',     emoji: '💃', cat: 'action' },
  { word: 'swim',   zh: '游泳',     emoji: '🏊', cat: 'action' },
  { word: 'walk',   zh: '走路',     emoji: '🚶', cat: 'action' },
  { word: 'fly',    zh: '飛',       emoji: '🕊️', cat: 'action' },
  // 家人 family (10)
  { word: 'mom',    zh: '媽媽',     emoji: '👩', cat: 'family' },
  { word: 'dad',    zh: '爸爸',     emoji: '👨', cat: 'family' },
  { word: 'baby',   zh: '寶寶',     emoji: '👶', cat: 'family' },
  { word: 'boy',    zh: '男孩',     emoji: '👦', cat: 'family' },
  { word: 'girl',   zh: '女孩',     emoji: '👧', cat: 'family' },
  { word: 'kid',    zh: '小孩',     emoji: '🧒', cat: 'family' },
  { word: 'twin',   zh: '雙胞胎',   emoji: '👯', cat: 'family' },
  { word: 'aunt',   zh: '阿姨',     emoji: '👵', cat: 'family' },
  { word: 'son',    zh: '兒子',     emoji: '🧑', cat: 'family' },
  { word: 'pet',    zh: '寵物',     emoji: '🐾', cat: 'family' },
];

const EN_CATEGORIES = {
  animal: { label: '動物',   emoji: '🐾', color: 'from-orange-400 to-red-400' },
  food:   { label: '食物',   emoji: '🍴', color: 'from-yellow-400 to-orange-400' },
  color:  { label: '顏色',   emoji: '🎨', color: 'from-pink-400 to-purple-400' },
  nature: { label: '大自然', emoji: '🌳', color: 'from-green-400 to-teal-400' },
  thing:  { label: '物品',   emoji: '🎁', color: 'from-blue-400 to-indigo-400' },
  body:   { label: '身體',   emoji: '👀', color: 'from-rose-400 to-pink-400' },
  action: { label: '動作',   emoji: '🏃', color: 'from-lime-400 to-green-400' },
  family: { label: '家人',   emoji: '👨‍👩‍👧', color: 'from-purple-400 to-indigo-400' },
};

// ============ 寵物系統資料 ============
const PETS = {
  elephant: { emoji: '🐘', image: '/pets/elephant.png', name: '大象', color: 'from-purple-300 to-pink-300' },
  dog:      { emoji: '🐶', image: '/pets/dog.png',      name: '狗狗', color: 'from-amber-300 to-orange-300' },
  cat:      { emoji: '🐱', image: '/pets/cat.png',      name: '貓咪', color: 'from-pink-300 to-rose-300' },
  penguin:  { emoji: '🐧', image: '/pets/penguin.png',  name: '企鵝', color: 'from-blue-300 to-cyan-300' },
};

const PET_NAME_SUGGESTIONS = ['柴柴', '嚕嚕', '橘子', '麻糬', '波波', '糖糖', '布丁', '小白'];

// 顯示寵物(用圖片,沒圖則 fallback emoji),可疊頭飾/玩具
function PetVisual({ type, clothes, toy, feedingEmoji, size = 'md', float = true }) {
  const pet = PETS[type];
  if (!pet) return null;
  const sizes = {
    xs: { box: 'w-14 h-14',   emoji: 'text-5xl', clothes: 'text-2xl', toy: 'text-xl', feed: 'text-3xl' },
    sm: { box: 'w-20 h-20',   emoji: 'text-6xl', clothes: 'text-3xl', toy: 'text-2xl', feed: 'text-4xl' },
    md: { box: 'w-32 h-32',   emoji: 'text-8xl', clothes: 'text-4xl', toy: 'text-3xl', feed: 'text-5xl' },
    lg: { box: 'w-48 h-48',   emoji: 'text-9xl', clothes: 'text-6xl', toy: 'text-4xl', feed: 'text-6xl' },
  };
  const s = sizes[size];
  return (
    <div className={`relative inline-block ${s.box}`}>
      <div className={`w-full h-full ${float ? 'animate-bounce-slow' : ''}`}>
        {pet.image ? (
          <img src={pet.image} alt={pet.name} className="w-full h-full object-contain" draggable="false" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className={s.emoji}>{pet.emoji}</span>
          </div>
        )}
      </div>
      {clothes && (
        <span className={`absolute -top-2 left-1/2 -translate-x-1/2 z-10 ${s.clothes} drop-shadow-lg pointer-events-none`}>
          {clothes.emoji}
        </span>
      )}
      {toy && (
        <span className={`absolute bottom-0 -right-1 ${s.toy} pointer-events-none`}>
          {toy.emoji}
        </span>
      )}
      {feedingEmoji && (
        <span className={`absolute top-1/2 -left-10 ${s.feed} animate-feed pointer-events-none`}>
          {feedingEmoji}
        </span>
      )}
    </div>
  );
}

const SHOP_ITEMS = {
  food: [
    { id: 'food_bone',    emoji: '🦴', name: '骨頭',   cost: 3 },
    { id: 'food_cookie',  emoji: '🍪', name: '餅乾',   cost: 5 },
    { id: 'food_meat',    emoji: '🥩', name: '肉肉',   cost: 10 },
    { id: 'food_chicken', emoji: '🍗', name: '雞腿',   cost: 15 },
    { id: 'food_cake',    emoji: '🎂', name: '蛋糕',   cost: 25 },
  ],
  clothes: [
    { id: 'cloth_bow',     emoji: '🎀', name: '蝴蝶結',  cost: 20 },
    { id: 'cloth_hat',     emoji: '🎩', name: '紳士帽',  cost: 40 },
    { id: 'cloth_glasses', emoji: '🕶️', name: '太陽眼鏡', cost: 60 },
    { id: 'cloth_crown',   emoji: '👑', name: '王冠',    cost: 80 },
    { id: 'cloth_grad',    emoji: '🎓', name: '博士帽',  cost: 100 },
  ],
  toys: [
    { id: 'toy_ball',       emoji: '🎾', name: '網球',      cost: 15 },
    { id: 'toy_yoyo',       emoji: '🪀', name: '溜溜球',    cost: 25 },
    { id: 'toy_teddy',      emoji: '🧸', name: '小熊娃娃',  cost: 30 },
    { id: 'toy_skateboard', emoji: '🛼', name: '滑板',      cost: 50 },
    { id: 'toy_rocket',     emoji: '🚀', name: '火箭',      cost: 80 },
  ],
};

const findItem = (category, id) => SHOP_ITEMS[category]?.find(i => i.id === id);

const DEFAULT_PET_DATA = {
  type: null,
  coins: 0,
  affection: 0,
  ownedClothes: [],
  ownedToys: [],
  foodInventory: {},
  equipped: { clothes: null, toy: null },
};

// ============ 主元件 ============
export default function App() {
  const [screen, setScreen] = useState('home');
  const [appData, setAppData] = useState({ users: [], currentUserId: null });
  const [familyCode, setFamilyCode] = useState(null);
  const [syncStatus, setSyncStatus] = useState('idle'); // 'idle' | 'syncing' | 'error'
  const [synthReady, setSynthReady] = useState(false);
  const [feedingItem, setFeedingItem] = useState(null);
  const synthRef = useRef(null);
  const lastWriteAtRef = useRef(0);  // 用來偵測 Firestore 回音
  const writeTimerRef = useRef(null); // 寫入防抖

  const currentUser = appData.users.find(u => u.id === appData.currentUserId);
  const stars = currentUser?.stars || 0;
  const petData = currentUser?.pet || DEFAULT_PET_DATA;

  useEffect(() => {
    // 載入家庭代碼
    try {
      const code = localStorage.getItem('family_code');
      if (code) setFamilyCode(code);
    } catch (e) {}

    // 1) 新格式
    try {
      const raw = localStorage.getItem('app_data');
      if (raw) {
        const loaded = JSON.parse(raw);
        if (loaded && Array.isArray(loaded.users) && loaded.users.length > 0) {
          // 把舊版的金幣併入星星(一次性遷移)
          let migrated = false;
          loaded.users = loaded.users.map(u => {
            const coins = u.pet?.coins || 0;
            if (coins > 0) {
              migrated = true;
              return { ...u, stars: (u.stars || 0) + coins, pet: { ...u.pet, coins: 0 } };
            }
            return u;
          });
          if (migrated) {
            try { localStorage.setItem('app_data', JSON.stringify(loaded)); } catch (e) {}
          }
          setAppData(loaded);
          setScreen(loaded.currentUserId ? 'home' : 'user-select');
          return;
        }
      }
    } catch (e) {}

    // 2) 從舊單人格式遷移
    try {
      const oldStars = parseInt(localStorage.getItem('zhuyin_stars') || '0');
      const oldPetRaw = localStorage.getItem('pet_data');
      const oldPet = oldPetRaw ? JSON.parse(oldPetRaw) : null;
      if (oldStars > 0 || (oldPet && oldPet.type)) {
        const pet = oldPet?.type ? {
          ...DEFAULT_PET_DATA,
          ...oldPet,
          name: oldPet.name || PETS[oldPet.type].name,
          equipped: { ...DEFAULT_PET_DATA.equipped, ...(oldPet.equipped || {}) },
          foodInventory: oldPet.foodInventory || {},
          ownedClothes: oldPet.ownedClothes || [],
          ownedToys: oldPet.ownedToys || [],
        } : { ...DEFAULT_PET_DATA };
        const migrated = {
          users: [{ id: 'u1', name: '我', stars: oldStars, pet }],
          currentUserId: 'u1',
        };
        setAppData(migrated);
        try { localStorage.setItem('app_data', JSON.stringify(migrated)); } catch (e) {}
        setScreen(pet.type ? 'home' : 'user-select');
        return;
      }
    } catch (e) {}

    // 3) 全新 → 進入選擇/配對畫面(可以新增玩家或用代碼連結現有家庭)
    setScreen('user-select');
  }, []);

  const saveAppData = (next) => {
    setAppData(next);
    try { localStorage.setItem('app_data', JSON.stringify(next)); } catch (e) {}
  };

  // 訂閱 Firestore 變動
  useEffect(() => {
    if (!familyCode) return;
    const unsub = subscribeFamily(familyCode, (remote) => {
      if (!remote || !Array.isArray(remote.users)) return;
      const remoteTime = remote.updatedAt || 0;
      if (remoteTime <= lastWriteAtRef.current) return; // 跳過自己的回音
      lastWriteAtRef.current = remoteTime;
      setAppData(prev => {
        const next = { users: remote.users, currentUserId: prev.currentUserId };
        try { localStorage.setItem('app_data', JSON.stringify(next)); } catch (e) {}
        return next;
      });
    });
    return unsub;
  }, [familyCode]);

  // 寫入 Firestore(防抖 600ms)
  useEffect(() => {
    if (!familyCode || !appData.users || appData.users.length === 0) return;
    if (writeTimerRef.current) clearTimeout(writeTimerRef.current);
    writeTimerRef.current = setTimeout(async () => {
      const t = Date.now();
      lastWriteAtRef.current = t;
      setSyncStatus('syncing');
      const ok = await saveFamily(familyCode, { users: appData.users, updatedAt: t });
      setSyncStatus(ok ? 'idle' : 'error');
    }, 600);
    return () => {
      if (writeTimerRef.current) clearTimeout(writeTimerRef.current);
    };
  }, [appData.users, familyCode]);

  // 用代碼配對(其他裝置)
  const pairWithCode = async (code) => {
    setSyncStatus('syncing');
    const remote = await loadFamily(code);
    if (!remote || !Array.isArray(remote.users) || remote.users.length === 0) {
      setSyncStatus('error');
      return { ok: false, reason: '找不到這個家庭代碼,或還沒有玩家' };
    }
    lastWriteAtRef.current = remote.updatedAt || Date.now();
    setFamilyCode(code);
    try { localStorage.setItem('family_code', code); } catch (e) {}
    const next = { users: remote.users, currentUserId: null };
    setAppData(next);
    try { localStorage.setItem('app_data', JSON.stringify(next)); } catch (e) {}
    setSyncStatus('idle');
    setScreen('user-select');
    return { ok: true };
  };

  // 第一次建立玩家時自動產生家庭代碼
  const ensureFamilyCode = () => {
    if (familyCode) return familyCode;
    const code = generateFamilyCode();
    setFamilyCode(code);
    try { localStorage.setItem('family_code', code); } catch (e) {}
    return code;
  };

  const updateCurrentUser = (updater) => {
    setAppData(prev => {
      if (!prev.currentUserId) return prev;
      const next = {
        ...prev,
        users: prev.users.map(u => u.id === prev.currentUserId
          ? (typeof updater === 'function' ? updater(u) : { ...u, ...updater })
          : u
        ),
      };
      try { localStorage.setItem('app_data', JSON.stringify(next)); } catch (e) {}
      return next;
    });
  };

  const addStars = (n) => updateCurrentUser(u => ({ ...u, stars: u.stars + n }));

  const buyItem = (category, item) => updateCurrentUser(u => {
    const p = u.pet;
    if (u.stars < item.cost) return u;
    let next = { ...p };
    if (category === 'food') {
      next.foodInventory = { ...p.foodInventory, [item.id]: (p.foodInventory[item.id] || 0) + 1 };
    } else if (category === 'clothes') {
      if (p.ownedClothes.includes(item.id)) return u;
      next.ownedClothes = [...p.ownedClothes, item.id];
      next.equipped = { ...p.equipped, clothes: item.id };
    } else if (category === 'toys') {
      if (p.ownedToys.includes(item.id)) return u;
      next.ownedToys = [...p.ownedToys, item.id];
      next.equipped = { ...p.equipped, toy: item.id };
    }
    return { ...u, stars: u.stars - item.cost, pet: next };
  });

  const equipItem = (slot, itemId) => updateCurrentUser(u => ({
    ...u,
    pet: { ...u.pet, equipped: { ...u.pet.equipped, [slot]: u.pet.equipped[slot] === itemId ? null : itemId } },
  }));

  const feedPet = (itemId) => {
    updateCurrentUser(u => {
      const count = u.pet.foodInventory[itemId] || 0;
      if (count <= 0) return u;
      const newInv = { ...u.pet.foodInventory };
      if (count > 1) newInv[itemId] = count - 1;
      else delete newInv[itemId];
      return { ...u, pet: { ...u.pet, foodInventory: newInv, affection: u.pet.affection + 1 } };
    });
    setFeedingItem(itemId);
    setTimeout(() => setFeedingItem(null), 1500);
  };

  const createUser = (name, petType, petName) => {
    ensureFamilyCode(); // 第一次建立玩家自動產生雲端代碼
    const id = 'u' + Date.now();
    const newUser = {
      id,
      name: name.trim() || '玩家',
      stars: 30,
      pet: { ...DEFAULT_PET_DATA, type: petType, name: petName.trim() || PETS[petType].name },
    };
    saveAppData({
      users: [...appData.users, newUser],
      currentUserId: id,
    });
    setScreen('home');
  };

  const selectUser = (id) => {
    saveAppData({ ...appData, currentUserId: id });
    setScreen('home');
  };

  const switchUser = () => {
    saveAppData({ ...appData, currentUserId: null });
    setScreen('user-select');
  };

  const deleteUser = (id) => {
    saveAppData({
      ...appData,
      users: appData.users.filter(u => u.id !== id),
      currentUserId: appData.currentUserId === id ? null : appData.currentUserId,
    });
  };

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

  const goHome = () => setScreen('home');
  const goBack = () => {
    if (screen.startsWith('zhuyin-') && screen !== 'zhuyin-menu') setScreen('zhuyin-menu');
    else if (screen.startsWith('math-') && screen !== 'math-menu') setScreen('math-menu');
    else if (screen.startsWith('en-') && screen !== 'en-menu') setScreen('en-menu');
    else if (screen === 'pet-shop') setScreen('pet-home');
    else if (screen === 'user-setup' && appData.users.length > 0) setScreen('user-select');
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
        {screen !== 'home' && screen !== 'pet-onboarding' && screen !== 'user-setup' && screen !== 'user-select' && (
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

        {screen === 'user-setup' && (
          <UserSetupScreen
            onCreate={createUser}
            onCancel={appData.users.length > 0 ? () => setScreen('user-select') : null}
          />
        )}
        {screen === 'user-select' && (
          <UserSelectScreen
            users={appData.users}
            familyCode={familyCode}
            syncStatus={syncStatus}
            onSelect={selectUser}
            onAddNew={() => setScreen('user-setup')}
            onPair={pairWithCode}
            onDelete={deleteUser}
          />
        )}
        {screen === 'home' && currentUser && (
          <HomeScreen
            user={currentUser}
            stars={stars}
            petData={petData}
            onPick={setScreen}
            onSwitchUser={switchUser}
          />
        )}
        {screen === 'pet-home' && (
          <PetHomeScreen
            user={currentUser}
            petData={petData}
            onShop={() => setScreen('pet-shop')}
            onEquip={equipItem}
            onFeed={feedPet}
            feedingItem={feedingItem}
          />
        )}
        {screen === 'pet-shop' && (
          <PetShopScreen stars={stars} petData={petData} onBuy={buyItem} />
        )}
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
          { id: 'en-first', icon: '🔠', title: '選首字母', desc: '看圖找對應字母', color: 'from-teal-400 to-cyan-400' },
          { id: 'en-missing', icon: '🔡', title: '填中間字母', desc: 'd_g 是哪個?', color: 'from-cyan-400 to-blue-400' },
          { id: 'en-spell', icon: '✏️', title: '拼單字', desc: '把字母拼起來', color: 'from-yellow-400 to-orange-400' },
          { id: 'en-cat', icon: '🗂️', title: '單字分類', desc: 'apple 是動物還是食物?', color: 'from-purple-400 to-pink-400' },
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
        {screen === 'en-first' && <EnFirstLetterGame onCorrect={onCorrect1} onWrong={onWrong} speakEn={speakEn} />}
        {screen === 'en-missing' && <EnMissingLetterGame onCorrect={onCorrect2} onWrong={onWrong} speakEn={speakEn} />}
        {screen === 'en-spell' && <EnSpellGame onCorrect={onCorrect2} onWrong={onWrong} speakEn={speakEn} playSound={playSound} />}
        {screen === 'en-cat' && <EnCategoryGame onCorrect={onCorrect1} onWrong={onWrong} speakEn={speakEn} />}

        <style>{`
          @keyframes pop { 0% { transform: scale(0); } 50% { transform: scale(1.1); } 100% { transform: scale(1); } }
          .animate-pop { animation: pop 0.3s ease-out; }
          @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } }
          .animate-shake { animation: shake 0.3s ease-in-out; }
          @keyframes fade-in { from { opacity: 0; transform: scale(0.5); } to { opacity: 1; transform: scale(1); } }
          .animate-fade-in { animation: fade-in 0.3s ease-out; }
          @keyframes bounce-slow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
          .animate-bounce-slow { animation: bounce-slow 2.5s ease-in-out infinite; }
          @keyframes feed { 0% { transform: translateX(-30px) scale(0.8); opacity: 0; } 30% { opacity: 1; } 80% { transform: translateX(30px) scale(1.1); opacity: 1; } 100% { transform: translateX(40px) scale(0); opacity: 0; } }
          .animate-feed { animation: feed 1.5s ease-out forwards; }
        `}</style>
      </div>
    </div>
  );
}

// ============ 首頁 ============
function HomeScreen({ user, stars, petData, onPick, onSwitchUser }) {
  const clothes = petData.equipped.clothes ? findItem('clothes', petData.equipped.clothes) : null;
  const toy = petData.equipped.toy ? findItem('toys', petData.equipped.toy) : null;
  const pet = PETS[petData.type];

  return (
    <div className="text-center">
      <div className="flex justify-between items-center mt-1 mb-2">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
          學習樂園
        </h1>
        <button
          onClick={onSwitchUser}
          className="bg-white border-2 border-purple-300 text-purple-600 hover:bg-purple-50 rounded-xl px-3 py-1 text-sm font-bold shadow"
        >
          🔄 換玩家
        </button>
      </div>

      {pet && (
        <button
          onClick={() => onPick('pet-home')}
          className={`w-full bg-gradient-to-br ${pet.color} rounded-3xl p-4 mb-4 shadow-xl hover:scale-[1.02] transition transform border-4 border-white`}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex-shrink-0">
              <PetVisual type={petData.type} clothes={clothes} toy={toy} size="sm" />
            </div>
            <div className="flex-1 text-left">
              <div className="text-white text-xs opacity-80 drop-shadow">{user.name} 的</div>
              <div className="text-white text-2xl font-bold drop-shadow">{petData.name}</div>
              <div className="text-white text-xs opacity-90 mt-1">點我去看牠 →</div>
            </div>
            <div className="flex-shrink-0">
              <div className="bg-white/90 rounded-xl px-3 py-2 flex items-center gap-1">
                <Star className="w-5 h-5 text-yellow-700 fill-yellow-500" />
                <span className="font-bold text-yellow-900 text-lg">{stars}</span>
              </div>
            </div>
          </div>
        </button>
      )}

      <div className="grid md:grid-cols-3 gap-3">
        <button onClick={() => onPick('zhuyin-menu')} className="bg-gradient-to-br from-pink-400 to-purple-500 hover:scale-105 transition transform text-white rounded-3xl p-6 shadow-xl">
          <div className="text-6xl mb-2">🎯</div>
          <div className="text-2xl font-bold mb-1">注音</div>
          <div className="text-sm opacity-90">ㄅㄆㄇㄈ</div>
        </button>
        <button onClick={() => onPick('math-menu')} className="bg-gradient-to-br from-blue-400 to-cyan-500 hover:scale-105 transition transform text-white rounded-3xl p-6 shadow-xl">
          <div className="text-6xl mb-2">🔢</div>
          <div className="text-2xl font-bold mb-1">數學</div>
          <div className="text-sm opacity-90">+ − &lt; &gt;</div>
        </button>
        <button onClick={() => onPick('en-menu')} className="bg-gradient-to-br from-green-400 to-emerald-500 hover:scale-105 transition transform text-white rounded-3xl p-6 shadow-xl">
          <div className="text-6xl mb-2">🔤</div>
          <div className="text-2xl font-bold mb-1">英文</div>
          <div className="text-sm opacity-90">ABC abc</div>
        </button>
      </div>

      <div className="mt-6 text-gray-500 text-sm">答對一題:+1 ⭐(難題 +2 ⭐),可花在商店買東西</div>
    </div>
  );
}

// ============ 玩家:第一次設定 / 新增玩家 ============
function UserSetupScreen({ onCreate, onCancel }) {
  const [step, setStep] = useState('name');
  const [userName, setUserName] = useState('');
  const [petType, setPetType] = useState(null);
  const [petName, setPetName] = useState('');

  const finishStep1 = () => {
    if (!userName.trim()) return;
    setStep('pet');
  };
  const pickPetType = (t) => {
    setPetType(t);
    setStep('petname');
  };
  const finish = () => {
    onCreate(userName, petType, petName);
  };

  return (
    <div className="text-center pt-4">
      <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
        {step === 'name' && '歡迎來到學習樂園!'}
        {step === 'pet' && '選一隻你的小夥伴 🌟'}
        {step === 'petname' && '幫牠取個名字 💕'}
      </h1>

      {step === 'name' && (
        <>
          <p className="text-lg text-gray-700 mb-6">先告訴我你是誰?</p>
          <input
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && finishStep1()}
            placeholder="輸入你的名字"
            maxLength={10}
            autoFocus
            className="w-full bg-white border-4 border-purple-300 rounded-2xl px-4 py-4 text-2xl text-center font-bold text-purple-700 shadow-lg outline-none focus:border-purple-500"
          />
          <div className="flex gap-2 justify-center mt-6">
            {onCancel && (
              <button onClick={onCancel} className="bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-2xl px-6 py-3 font-bold">
                取消
              </button>
            )}
            <button
              onClick={finishStep1}
              disabled={!userName.trim()}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:scale-105 transition text-white rounded-2xl px-8 py-3 font-bold text-lg shadow-lg disabled:opacity-40 disabled:cursor-not-allowed"
            >
              下一步 →
            </button>
          </div>
        </>
      )}

      {step === 'pet' && (
        <>
          <p className="text-base text-gray-600 mb-4">嗨 {userName}!選一隻你的寵物</p>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(PETS).map(([key, pet]) => (
              <button
                key={key}
                onClick={() => pickPetType(key)}
                className={`bg-gradient-to-br ${pet.color} hover:scale-105 transition transform rounded-3xl p-3 shadow-xl border-4 border-white`}
              >
                <PetVisual type={key} size="md" float={true} />
                <div className="text-xl font-bold text-white drop-shadow mt-1">{pet.name}</div>
              </button>
            ))}
          </div>
          <button
            onClick={() => setStep('name')}
            className="mt-4 text-gray-500 underline text-sm"
          >
            ← 改名字
          </button>
        </>
      )}

      {step === 'petname' && petType && (
        <>
          <div className={`bg-gradient-to-br ${PETS[petType].color} rounded-3xl p-4 mb-4 inline-block border-4 border-white shadow-xl`}>
            <PetVisual type={petType} size="lg" />
          </div>
          <p className="text-base text-gray-600 mb-3">幫你的{PETS[petType].name}取個名字吧!</p>
          <input
            value={petName}
            onChange={(e) => setPetName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && petName.trim() && finish()}
            placeholder={`例如:${PET_NAME_SUGGESTIONS[0]}`}
            maxLength={8}
            autoFocus
            className="w-full bg-white border-4 border-pink-300 rounded-2xl px-4 py-4 text-2xl text-center font-bold text-pink-700 shadow-lg outline-none focus:border-pink-500"
          />
          <div className="mt-3 flex flex-wrap gap-2 justify-center">
            {PET_NAME_SUGGESTIONS.map(n => (
              <button
                key={n}
                onClick={() => setPetName(n)}
                className="bg-yellow-200 hover:bg-yellow-300 text-yellow-900 rounded-xl px-3 py-1 text-sm font-bold"
              >
                {n}
              </button>
            ))}
          </div>
          <div className="flex gap-2 justify-center mt-6">
            <button onClick={() => setStep('pet')} className="bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-2xl px-6 py-3 font-bold">
              ← 重選寵物
            </button>
            <button
              onClick={finish}
              disabled={!petName.trim()}
              className="bg-gradient-to-r from-pink-500 to-orange-500 hover:scale-105 transition text-white rounded-2xl px-8 py-3 font-bold text-lg shadow-lg disabled:opacity-40 disabled:cursor-not-allowed"
            >
              完成 🎉
            </button>
          </div>
          <div className="mt-4 text-sm text-gray-500">完成後送你 ⭐ 30 顆歡迎星星!</div>
        </>
      )}
    </div>
  );
}

// ============ 玩家:選擇玩家(已建立過的) ============
function UserSelectScreen({ users, familyCode, syncStatus, onSelect, onAddNew, onPair, onDelete }) {
  const [pairMode, setPairMode] = useState(false);
  const [codeInput, setCodeInput] = useState('');
  const [pairError, setPairError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const handlePair = async () => {
    setPairError(null);
    const code = codeInput.trim();
    if (!/^\d{8}$/.test(code)) {
      setPairError('家庭代碼是 8 位數字');
      return;
    }
    const result = await onPair(code);
    if (!result.ok) setPairError(result.reason);
  };

  const copyCode = async () => {
    if (!familyCode) return;
    try {
      await navigator.clipboard.writeText(familyCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {}
  };

  if (pairMode) {
    return (
      <div className="text-center pt-6">
        <h1 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
          🔗 連結現有家庭
        </h1>
        <p className="text-base text-gray-600 mb-6">
          在另一台裝置打開「換玩家」就能看到家庭代碼
        </p>
        <input
          value={codeInput}
          onChange={(e) => setCodeInput(e.target.value.replace(/\D/g, ''))}
          onKeyDown={(e) => e.key === 'Enter' && handlePair()}
          placeholder="輸入 8 位數字代碼"
          maxLength={8}
          inputMode="numeric"
          autoFocus
          className="w-full bg-white border-4 border-purple-300 rounded-2xl px-4 py-4 text-3xl text-center font-bold text-purple-700 shadow-lg outline-none focus:border-purple-500 tracking-widest"
        />
        {pairError && <div className="mt-3 text-red-500 font-bold">{pairError}</div>}
        <div className="flex gap-2 justify-center mt-6">
          <button
            onClick={() => { setPairMode(false); setPairError(null); setCodeInput(''); }}
            className="bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-2xl px-6 py-3 font-bold"
          >
            取消
          </button>
          <button
            onClick={handlePair}
            disabled={codeInput.length !== 8 || syncStatus === 'syncing'}
            className="bg-gradient-to-r from-purple-500 to-blue-500 hover:scale-105 transition text-white rounded-2xl px-8 py-3 font-bold text-lg shadow-lg disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {syncStatus === 'syncing' ? '搜尋中…' : '連結 🔗'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center pt-6">
      <h1 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
        誰要玩? 👀
      </h1>
      {users.length > 0 ? (
        <>
          <div className={`grid gap-4 ${users.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
            {users.map(u => {
              const pet = PETS[u.pet?.type] || PETS.dog;
              const clothes = u.pet?.equipped?.clothes ? findItem('clothes', u.pet.equipped.clothes) : null;
              return (
                <div key={u.id} className="relative">
                  <button
                    onClick={() => editMode ? setConfirmDelete(u) : onSelect(u.id)}
                    className={`w-full bg-gradient-to-br ${pet.color} hover:scale-105 transition transform rounded-3xl p-4 shadow-xl border-4 border-white`}
                  >
                    <PetVisual type={u.pet?.type || 'dog'} clothes={clothes} size="md" />
                    <div className="text-2xl font-bold text-white drop-shadow mt-2">{u.name}</div>
                    <div className="text-sm text-white opacity-90">的 {u.pet?.name || ''}</div>
                    <div className="mt-2 flex justify-center">
                      <span className="bg-white/90 rounded-lg px-3 py-1 text-sm font-bold text-yellow-900">⭐ {u.stars || 0}</span>
                    </div>
                  </button>
                  {editMode && (
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center font-bold shadow-lg text-lg animate-bounce">
                      ✕
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <button
            onClick={() => setEditMode(!editMode)}
            className={`mt-3 ${editMode ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700'} rounded-xl px-4 py-2 font-bold text-sm shadow transition`}
          >
            {editMode ? '✓ 完成編輯' : '⚙ 編輯 / 刪除帳號'}
          </button>
        </>
      ) : (
        <div className="bg-white/70 rounded-2xl p-6 text-gray-500">
          還沒有任何玩家,新增一個或用代碼連結現有家庭
        </div>
      )}

      {confirmDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setConfirmDelete(null)}>
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="text-center">
              <PetVisual type={confirmDelete.pet?.type || 'dog'} size="md" float={false} />
              <h3 className="text-xl font-bold text-gray-800 mt-3 mb-2">
                確定要刪除「{confirmDelete.name}」嗎?
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                {confirmDelete.pet?.name && `${confirmDelete.pet.name} 和 `}
                ⭐ {confirmDelete.stars || 0} 顆星星都會不見,**無法復原**
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-2xl py-3 font-bold"
                >
                  取消
                </button>
                <button
                  onClick={() => { onDelete(confirmDelete.id); setConfirmDelete(null); setEditMode(false); }}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white rounded-2xl py-3 font-bold shadow"
                >
                  確定刪除
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <button
        onClick={onAddNew}
        className="mt-4 bg-white border-4 border-dashed border-purple-400 text-purple-600 hover:bg-purple-50 rounded-2xl px-6 py-4 font-bold shadow w-full"
      >
        ＋ 新增玩家
      </button>
      <button
        onClick={() => setPairMode(true)}
        className="mt-2 bg-white border-2 border-blue-300 text-blue-600 hover:bg-blue-50 rounded-2xl px-6 py-3 font-bold shadow w-full"
      >
        🔗 用家庭代碼連結其他裝置
      </button>

      {familyCode && (
        <div className="mt-6 bg-yellow-50 border-2 border-yellow-300 rounded-2xl p-4">
          <div className="text-xs text-gray-600 mb-1">這台裝置的家庭代碼(在其他裝置輸入即可同步)</div>
          <button
            onClick={copyCode}
            className="bg-white rounded-xl px-4 py-3 shadow-md font-mono text-2xl font-bold text-yellow-900 tracking-widest hover:bg-yellow-100 transition w-full"
          >
            {familyCode}
            <span className="ml-2 text-xs text-gray-500">{copied ? '✓ 已複製' : '(點我複製)'}</span>
          </button>
          <div className="mt-2 text-xs text-gray-500">
            {syncStatus === 'syncing' && '☁ 同步中…'}
            {syncStatus === 'idle' && '✅ 雲端同步已連線'}
            {syncStatus === 'error' && '⚠️ 同步失敗(等網路恢復會重試)'}
          </div>
        </div>
      )}
    </div>
  );
}

// ============ 寵物:主畫面(看寵物、餵食、換裝、玩玩具) ============
function PetHomeScreen({ user, petData, onShop, onEquip, onFeed, feedingItem }) {
  const [tab, setTab] = useState('feed');
  const pet = PETS[petData.type];
  const clothes = petData.equipped.clothes ? findItem('clothes', petData.equipped.clothes) : null;
  const toy = petData.equipped.toy ? findItem('toys', petData.equipped.toy) : null;
  const feedingEmoji = feedingItem ? findItem('food', feedingItem)?.emoji : null;
  const foodList = Object.entries(petData.foodInventory).filter(([, c]) => c > 0);

  return (
    <div>
      <div className={`bg-gradient-to-br ${pet.color} rounded-3xl p-6 mb-4 shadow-xl border-4 border-white text-center relative overflow-hidden`}>
        <div className="text-sm text-white opacity-90 drop-shadow">{user?.name || '我'} 的</div>
        <div className="text-3xl font-bold text-white mb-2 drop-shadow">{petData.name}</div>
        <PetVisual type={petData.type} clothes={clothes} toy={toy} feedingEmoji={feedingEmoji} size="lg" />
        <div className="mt-3 text-white text-sm drop-shadow">陪伴次數:{petData.affection} 次 💕</div>
      </div>

      <button
        onClick={onShop}
        className="w-full bg-gradient-to-r from-amber-400 to-orange-400 text-white rounded-2xl p-3 shadow-lg hover:scale-[1.02] transition font-bold text-xl mb-3 flex items-center justify-center gap-2"
      >
        🛒 去逛商店
      </button>

      <div className="bg-white rounded-2xl p-2 mb-3 shadow-md flex gap-2">
        {[
          { id: 'feed', label: '🍖 餵食', count: foodList.reduce((a, [, c]) => a + c, 0) },
          { id: 'clothes', label: '👕 換衣', count: petData.ownedClothes.length },
          { id: 'toys', label: '🎾 玩具', count: petData.ownedToys.length },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 py-2 rounded-xl font-bold text-sm transition ${
              tab === t.id ? 'bg-purple-400 text-white shadow' : 'bg-gray-100 text-gray-600'
            }`}
          >
            {t.label} <span className="opacity-70">({t.count})</span>
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-3 shadow-md min-h-32">
        {tab === 'feed' && (
          foodList.length === 0 ? (
            <div className="text-gray-400 py-6 text-center">
              還沒有食物喔!去商店買吃的給牠 🛒
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {foodList.map(([id, count]) => {
                const item = findItem('food', id);
                if (!item) return null;
                return (
                  <button
                    key={id}
                    onClick={() => onFeed(id)}
                    className="bg-yellow-50 hover:bg-yellow-100 rounded-2xl p-3 shadow-md border-2 border-yellow-200 active:scale-95 transition"
                  >
                    <div className="text-4xl mb-1">{item.emoji}</div>
                    <div className="text-xs text-gray-600 font-bold">{item.name}</div>
                    <div className="text-xs text-orange-600 font-bold">x {count}</div>
                  </button>
                );
              })}
            </div>
          )
        )}
        {tab === 'clothes' && (
          petData.ownedClothes.length === 0 ? (
            <div className="text-gray-400 py-6 text-center">
              還沒有衣服喔!去商店買漂亮的衣服 🛒
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {petData.ownedClothes.map(id => {
                const item = findItem('clothes', id);
                if (!item) return null;
                const equipped = petData.equipped.clothes === id;
                return (
                  <button
                    key={id}
                    onClick={() => onEquip('clothes', id)}
                    className={`rounded-2xl p-3 shadow-md border-2 active:scale-95 transition ${
                      equipped ? 'bg-purple-200 border-purple-400 ring-2 ring-purple-400' : 'bg-pink-50 hover:bg-pink-100 border-pink-200'
                    }`}
                  >
                    <div className="text-4xl mb-1">{item.emoji}</div>
                    <div className="text-xs text-gray-600 font-bold">{item.name}</div>
                    {equipped && <div className="text-xs text-purple-600 font-bold">穿著中</div>}
                  </button>
                );
              })}
            </div>
          )
        )}
        {tab === 'toys' && (
          petData.ownedToys.length === 0 ? (
            <div className="text-gray-400 py-6 text-center">
              還沒有玩具喔!去商店買好玩的給牠 🛒
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {petData.ownedToys.map(id => {
                const item = findItem('toys', id);
                if (!item) return null;
                const equipped = petData.equipped.toy === id;
                return (
                  <button
                    key={id}
                    onClick={() => onEquip('toy', id)}
                    className={`rounded-2xl p-3 shadow-md border-2 active:scale-95 transition ${
                      equipped ? 'bg-green-200 border-green-400 ring-2 ring-green-400' : 'bg-blue-50 hover:bg-blue-100 border-blue-200'
                    }`}
                  >
                    <div className="text-4xl mb-1">{item.emoji}</div>
                    <div className="text-xs text-gray-600 font-bold">{item.name}</div>
                    {equipped && <div className="text-xs text-green-600 font-bold">在玩</div>}
                  </button>
                );
              })}
            </div>
          )
        )}
      </div>
    </div>
  );
}

// ============ 寵物:商店 ============
function PetShopScreen({ stars, petData, onBuy }) {
  const [tab, setTab] = useState('food');
  const [flash, setFlash] = useState(null);
  const items = SHOP_ITEMS[tab];

  const handleBuy = (item) => {
    if (stars < item.cost) {
      setFlash({ id: item.id, type: 'poor' });
      setTimeout(() => setFlash(null), 800);
      return;
    }
    if (tab === 'clothes' && petData.ownedClothes.includes(item.id)) {
      setFlash({ id: item.id, type: 'owned' });
      setTimeout(() => setFlash(null), 800);
      return;
    }
    if (tab === 'toys' && petData.ownedToys.includes(item.id)) {
      setFlash({ id: item.id, type: 'owned' });
      setTimeout(() => setFlash(null), 800);
      return;
    }
    onBuy(tab, item);
    setFlash({ id: item.id, type: 'bought' });
    setTimeout(() => setFlash(null), 800);
  };

  const isOwned = (item) => {
    if (tab === 'clothes') return petData.ownedClothes.includes(item.id);
    if (tab === 'toys') return petData.ownedToys.includes(item.id);
    return false;
  };

  return (
    <div>
      <div className="bg-gradient-to-r from-amber-300 to-orange-300 rounded-2xl p-4 mb-3 shadow-lg text-center border-4 border-white">
        <h2 className="text-3xl font-bold text-amber-900 drop-shadow">🛒 商店</h2>
        <div className="mt-1 text-lg font-bold text-amber-900">你有 ⭐ {stars}</div>
      </div>

      <div className="bg-white rounded-2xl p-2 mb-3 shadow-md flex gap-2">
        {[
          { id: 'food', label: '🍖 食物' },
          { id: 'clothes', label: '👕 衣服' },
          { id: 'toys', label: '🎾 玩具' },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 py-2 rounded-xl font-bold transition ${
              tab === t.id ? 'bg-amber-400 text-white shadow' : 'bg-gray-100 text-gray-600'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        {items.map(item => {
          const owned = isOwned(item);
          const poor = stars < item.cost;
          const flashing = flash?.id === item.id;
          const flashType = flashing ? flash.type : null;
          let cls = 'bg-white hover:bg-yellow-50';
          if (flashType === 'bought') cls = 'bg-green-200 scale-105';
          else if (flashType === 'poor') cls = 'bg-red-200 animate-shake';
          else if (flashType === 'owned') cls = 'bg-blue-200';
          else if (owned) cls = 'bg-gray-100';
          return (
            <button
              key={item.id}
              onClick={() => handleBuy(item)}
              disabled={owned}
              className={`${cls} rounded-2xl p-4 shadow-md border-2 border-amber-200 transition transform active:scale-95 disabled:cursor-not-allowed`}
            >
              <div className="text-5xl mb-2">{item.emoji}</div>
              <div className="font-bold text-gray-700 mb-1">{item.name}</div>
              {owned ? (
                <div className="text-sm text-gray-500 font-bold">已擁有 ✓</div>
              ) : (
                <div className={`text-sm font-bold ${poor ? 'text-red-500' : 'text-orange-600'}`}>
                  ⭐ {item.cost}
                </div>
              )}
              {flashType === 'bought' && <div className="text-xs text-green-700 font-bold mt-1">買到了!🎉</div>}
              {flashType === 'poor' && <div className="text-xs text-red-700 font-bold mt-1">星星不夠 💦</div>}
            </button>
          );
        })}
      </div>

      <div className="mt-4 text-center text-gray-500 text-sm">
        食物可以買很多次,衣服跟玩具買過就有了 ✨
      </div>
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

// ============ 英文:看圖選首字母 ============
function EnFirstLetterGame({ onCorrect, onWrong, speakEn }) {
  const [target, setTarget] = useState(null);
  const [opts, setOpts] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);

  const newRound = () => {
    const t = EN_WORDS[Math.floor(Math.random() * EN_WORDS.length)];
    const correct = t.word[0];
    const letters = 'abcdefghijklmnopqrstuvwxyz';
    const dist = new Set();
    while (dist.size < 3) {
      const d = letters[Math.floor(Math.random() * 26)];
      if (d !== correct) dist.add(d);
    }
    setTarget(t);
    setOpts([correct, ...dist].sort(() => Math.random() - 0.5));
    setFeedback(null);
    setTimeout(() => speakEn(t.word), 300);
  };

  useEffect(() => { newRound(); }, []);

  const pick = (l) => {
    if (feedback) return;
    if (l === target.word[0]) {
      setFeedback({ type: 'correct', l });
      setScore(s => s + 1);
      onCorrect();
      setTimeout(newRound, 1400);
    } else {
      setFeedback({ type: 'wrong', l });
      onWrong();
      setTimeout(() => setFeedback(null), 900);
    }
  };

  if (!target) return null;
  return (
    <div className="text-center">
      <h2 className="text-3xl font-bold text-teal-600 mb-4">🔠 選首字母</h2>
      <button onClick={() => speakEn(target.word)}
        className="bg-white rounded-3xl p-5 shadow-xl mb-3 w-full hover:scale-105 transition border-4 border-teal-300">
        <div className="text-7xl mb-1">{target.emoji}</div>
        <div className="text-2xl font-bold text-purple-700">{target.zh}</div>
        <div className="text-sm text-teal-500 mt-1 flex items-center justify-center gap-1">
          <Volume2 className="w-4 h-4" />點我聽英文
        </div>
      </button>
      <p className="text-lg text-gray-700 mb-3 font-bold">這個字哪個字母開頭?</p>
      <div className="grid grid-cols-4 gap-2">
        {opts.map((l, i) => {
          const c = feedback?.l === l;
          let bg = 'bg-white hover:bg-yellow-100';
          if (c) bg = feedback.type === 'correct' ? 'bg-green-300 scale-110' : 'bg-red-300 animate-shake';
          return (
            <button key={i} onClick={() => pick(l)}
              className={`${bg} rounded-2xl p-4 shadow-md border-2 border-teal-200 transition`}>
              <span className="text-5xl font-bold text-purple-600 lowercase">{l}</span>
            </button>
          );
        })}
      </div>
      {feedback?.type === 'correct' && <div className="mt-4 text-3xl font-bold text-green-600 animate-bounce">答對了!⭐ {target.word}</div>}
      {feedback?.type === 'wrong' && <div className="mt-4 text-xl font-bold text-red-500">{target.word} 是 「{target.word[0]}」 開頭喔!</div>}
      <div className="mt-3 text-gray-600">答對:{score} 題</div>
    </div>
  );
}

// ============ 英文:填中間字母 ============
function EnMissingLetterGame({ onCorrect, onWrong, speakEn }) {
  const [target, setTarget] = useState(null);
  const [missingIdx, setMissingIdx] = useState(0);
  const [opts, setOpts] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);

  const newRound = () => {
    // 只挑 3-5 字母的單字當題目
    const pool = EN_WORDS.filter(w => w.word.length >= 3 && w.word.length <= 5);
    const t = pool[Math.floor(Math.random() * pool.length)];
    // 挖掉中間,優先挖母音
    const vowels = ['a','e','i','o','u'];
    let mIdx = -1;
    for (let i = 1; i < t.word.length - 1; i++) {
      if (vowels.includes(t.word[i])) { mIdx = i; break; }
    }
    if (mIdx === -1) mIdx = Math.floor(t.word.length / 2);
    const correct = t.word[mIdx];
    // 選項:該母音 + 其他幾個母音 / 接近的字母
    const all = vowels.includes(correct) ? vowels.filter(v => v !== correct).slice(0, 3) : 'abcdefghijklmnopqrstuvwxyz'.split('').filter(c => c !== correct).sort(() => Math.random() - 0.5).slice(0, 3);
    setTarget(t);
    setMissingIdx(mIdx);
    setOpts([correct, ...all].sort(() => Math.random() - 0.5));
    setFeedback(null);
    setTimeout(() => speakEn(t.word), 300);
  };

  useEffect(() => { newRound(); }, []);

  const pick = (l) => {
    if (feedback) return;
    if (l === target.word[missingIdx]) {
      setFeedback({ type: 'correct', l });
      setScore(s => s + 1);
      onCorrect();
      speakEn(target.word);
      setTimeout(newRound, 1600);
    } else {
      setFeedback({ type: 'wrong', l });
      onWrong();
      setTimeout(() => setFeedback(null), 1000);
    }
  };

  if (!target) return null;
  const blanked = target.word.split('').map((c, i) => i === missingIdx ? (feedback?.type === 'correct' ? c : '_') : c).join(' ');
  return (
    <div className="text-center">
      <h2 className="text-3xl font-bold text-cyan-600 mb-4">🔡 填中間字母</h2>
      <button onClick={() => speakEn(target.word)}
        className="bg-white rounded-3xl p-5 shadow-xl mb-3 w-full hover:scale-105 transition border-4 border-cyan-300">
        <div className="text-7xl mb-1">{target.emoji}</div>
        <div className="text-2xl font-bold text-purple-700">{target.zh}</div>
        <div className="text-sm text-cyan-500 mt-1 flex items-center justify-center gap-1">
          <Volume2 className="w-4 h-4" />點我聽英文
        </div>
      </button>
      <div className="bg-yellow-100 rounded-2xl p-4 mb-3 border-4 border-yellow-300">
        <div className={`text-6xl font-bold tracking-widest lowercase ${feedback?.type === 'correct' ? 'text-green-600' : 'text-purple-700'}`}>
          {blanked}
        </div>
      </div>
      <p className="text-base text-gray-600 mb-3">少了哪個字母?</p>
      <div className="grid grid-cols-4 gap-2">
        {opts.map((l, i) => {
          const c = feedback?.l === l;
          let bg = 'bg-white hover:bg-yellow-100';
          if (c) bg = feedback.type === 'correct' ? 'bg-green-300 scale-110' : 'bg-red-300 animate-shake';
          return (
            <button key={i} onClick={() => pick(l)}
              className={`${bg} rounded-2xl p-4 shadow-md border-2 border-cyan-200 transition`}>
              <span className="text-5xl font-bold text-purple-600 lowercase">{l}</span>
            </button>
          );
        })}
      </div>
      {feedback?.type === 'correct' && <div className="mt-4 text-3xl font-bold text-green-600 animate-bounce">答對了!⭐⭐</div>}
      {feedback?.type === 'wrong' && <div className="mt-4 text-xl font-bold text-red-500">正解 {target.word}</div>}
      <div className="mt-3 text-gray-600">答對:{score} 題</div>
    </div>
  );
}

// ============ 英文:單字分類 ============
function EnCategoryGame({ onCorrect, onWrong, speakEn }) {
  const [target, setTarget] = useState(null);
  const [opts, setOpts] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);

  const newRound = () => {
    const t = EN_WORDS[Math.floor(Math.random() * EN_WORDS.length)];
    const allCats = Object.keys(EN_CATEGORIES);
    const distractors = allCats.filter(c => c !== t.cat).sort(() => Math.random() - 0.5).slice(0, 3);
    setTarget(t);
    setOpts([t.cat, ...distractors].sort(() => Math.random() - 0.5));
    setFeedback(null);
    setTimeout(() => speakEn(t.word), 300);
  };

  useEffect(() => { newRound(); }, []);

  const pick = (cat) => {
    if (feedback) return;
    if (cat === target.cat) {
      setFeedback({ type: 'correct', cat });
      setScore(s => s + 1);
      onCorrect();
      setTimeout(newRound, 1500);
    } else {
      setFeedback({ type: 'wrong', cat });
      onWrong();
      setTimeout(() => setFeedback(null), 1000);
    }
  };

  if (!target) return null;
  return (
    <div className="text-center">
      <h2 className="text-3xl font-bold text-purple-600 mb-4">🗂️ 單字分類</h2>
      <button onClick={() => speakEn(target.word)}
        className="bg-white rounded-3xl p-5 shadow-xl mb-3 w-full hover:scale-105 transition border-4 border-purple-300">
        <div className="text-7xl mb-1">{target.emoji}</div>
        <div className="text-3xl font-bold text-purple-700 lowercase">{target.word}</div>
        <div className="text-base text-gray-600 mt-1">{target.zh}</div>
        <div className="text-sm text-purple-500 mt-1 flex items-center justify-center gap-1">
          <Volume2 className="w-4 h-4" />再聽一次
        </div>
      </button>
      <p className="text-lg text-gray-700 mb-3 font-bold">這個字屬於哪一類?</p>
      <div className="grid grid-cols-2 gap-3">
        {opts.map((cat, i) => {
          const c = EN_CATEGORIES[cat];
          const sel = feedback?.cat === cat;
          let extra = '';
          if (sel) extra = feedback.type === 'correct' ? 'scale-110 ring-4 ring-green-500' : 'animate-shake ring-4 ring-red-500';
          return (
            <button key={i} onClick={() => pick(cat)}
              className={`bg-gradient-to-br ${c.color} hover:scale-105 transition transform text-white rounded-3xl p-5 shadow-xl ${extra}`}>
              <div className="text-5xl mb-1">{c.emoji}</div>
              <div className="text-2xl font-bold drop-shadow">{c.label}</div>
            </button>
          );
        })}
      </div>
      {feedback?.type === 'correct' && <div className="mt-4 text-3xl font-bold text-green-600 animate-bounce">答對了!⭐</div>}
      {feedback?.type === 'wrong' && <div className="mt-4 text-xl font-bold text-red-500">{target.word} 是 {EN_CATEGORIES[target.cat].emoji} {EN_CATEGORIES[target.cat].label} 喔!</div>}
      <div className="mt-3 text-gray-600">答對:{score} 題</div>
    </div>
  );
}
