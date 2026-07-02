import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import {
  getAuth,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  signInAnonymously,
  signOut
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import {
  getFirestore,
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  doc,
  updateDoc,
  increment
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

// TODO: Firebase Console > Project settings > Web app から取得した値に置き換える。
// この値を設定しない限り、投稿は端末内 localStorage にしか保存されない。
export const firebaseConfig = {
  apiKey: '',
  authDomain: '',
  projectId: '',
  appId: ''
};

const LOCAL_POSTS_KEY = 'haikugo.localPosts';

let app;
let auth;
let db;
let currentUser = null;
let unsubscribePosts = null;

export function isFirebaseConfigured() {
  return Boolean(firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId && firebaseConfig.appId);
}

export async function initPersistence({ onUserChange, onPostsChange, onError }) {
  if (!isFirebaseConfigured()) {
    onError?.('Firebase未設定です。投稿はこの端末内にのみ保存されます。');
    onPostsChange?.(loadLocalPosts());
    return { mode: 'local' };
  }

  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);

  await setPersistence(auth, browserLocalPersistence);

  onAuthStateChanged(auth, async (user) => {
    currentUser = user;
    onUserChange?.(user);

    if (!user) {
      await signInAnonymously(auth);
      return;
    }

    if (unsubscribePosts) unsubscribePosts();
    const q = query(collection(db, 'haikuPosts'), orderBy('createdAt', 'desc'));
    unsubscribePosts = onSnapshot(
      q,
      (snapshot) => onPostsChange?.(snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))),
      (error) => onError?.(error.message)
    );
  });

  return { mode: 'firebase' };
}

export async function saveHaiku(post) {
  const payload = normalizePost(post);

  if (!db || !currentUser) {
    const local = loadLocalPosts();
    local.unshift({ ...payload, id: crypto.randomUUID(), createdAtLocal: new Date().toISOString() });
    localStorage.setItem(LOCAL_POSTS_KEY, JSON.stringify(local));
    return { mode: 'local' };
  }

  await addDoc(collection(db, 'haikuPosts'), {
    ...payload,
    authorId: currentUser.uid,
    authorName: currentUser.isAnonymous ? '匿名ユーザー' : currentUser.email,
    okashi: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  return { mode: 'firebase' };
}

export async function addOkashi(postId) {
  if (!db || !postId) return;
  await updateDoc(doc(db, 'haikuPosts', postId), {
    okashi: increment(1),
    updatedAt: serverTimestamp()
  });
}

export async function logoutPersistence() {
  if (auth) await signOut(auth);
}

function normalizePost(post) {
  const poem = String(post.poem || '').trim();
  const place = String(post.place || '').trim();
  const lat = Number(post.lat);
  const lng = Number(post.lng);
  const category = String(post.category || '未分類');

  if (!poem) throw new Error('俳句が空です。');
  if (!place) throw new Error('場所名が空です。');
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) throw new Error('緯度・経度が不正です。');

  return { poem, place, lat, lng, category };
}

function loadLocalPosts() {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_POSTS_KEY) || '[]');
  } catch {
    return [];
  }
}
