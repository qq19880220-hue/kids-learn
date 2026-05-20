// Firebase 設定 + Firestore 工具
// API key 公開沒關係,真正的安全在 Firestore Rules 上
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCFeU3EB_-Gov5BZ8rH57iNKyvLqL4_bHk",
  authDomain: "kids-learn-c9b27.firebaseapp.com",
  projectId: "kids-learn-c9b27",
  storageBucket: "kids-learn-c9b27.firebasestorage.app",
  messagingSenderId: "292714182199",
  appId: "1:292714182199:web:0b6fee775432f9e76431b2",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const familyRef = (code) => doc(db, 'families', code.toString());

// 嘗試讀取某家庭資料
export async function loadFamily(code) {
  try {
    const snap = await getDoc(familyRef(code));
    return snap.exists() ? snap.data() : null;
  } catch (e) {
    console.error('loadFamily error:', e);
    return null;
  }
}

// 把資料寫到雲端,caller 自己決定 updatedAt(用來判斷回音)
export async function saveFamily(code, data) {
  try {
    await setDoc(familyRef(code), data);
    return true;
  } catch (e) {
    console.error('saveFamily error:', e);
    return false;
  }
}

// 訂閱家庭資料變動,callback 收到最新資料
export function subscribeFamily(code, callback) {
  return onSnapshot(
    familyRef(code),
    (snap) => {
      if (snap.exists()) callback(snap.data());
    },
    (err) => console.error('subscribeFamily error:', err)
  );
}

// 產生 8 位數字家庭代碼(iPad/手機都好打)
export function generateFamilyCode() {
  return String(Math.floor(10000000 + Math.random() * 90000000));
}
