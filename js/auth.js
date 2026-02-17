import { auth, db } from './firebaseConfig.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { ref, set, get, update } from 'firebase/database';

// สมัครสมาชิก
export async function register(email, password, username) {
  const userCred = await createUserWithEmailAndPassword(auth, email, password);
  await set(ref(db, 'users/' + userCred.user.uid), {
    username: username,
    bobux: 1000,         // เงินเริ่มต้น
    spins: 3,             // สปินเริ่มต้น
    styles: {},           // { styleId: { equipped: false, count: 1 } }
    pity: 0,              // ระบบ pity กาชา
    quests: {},           // ความคืบหน้าเควส
    createdAt: Date.now()
  });
  return userCred.user;
}

// เข้าสู่ระบบ
export async function login(email, password) {
  return await signInWithEmailAndPassword(auth, email, password);
}

// ออกจากระบบ
export function logout() {
  signOut(auth);
}

// ดึงข้อมูลผู้ใช้
export async function getUserData(uid) {
  const snap = await get(ref(db, `users/${uid}`));
  return snap.val();
}

// อัปเดตข้อมูลผู้ใช้
export function updateUserData(uid, data) {
  return update(ref(db, `users/${uid}`), data);
}
