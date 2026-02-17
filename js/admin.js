import { auth, db } from './firebaseConfig.js';
import { onAuthStateChanged } from 'firebase/auth';
import { ref, get, set } from 'firebase/database';

// ตรวจสอบว่า uid นี้เป็น admin หรือไม่ (อาจเก็บรายการ admins ในฐานข้อมูล)
async function isAdmin(uid) {
  const snap = await get(ref(db, `admins/${uid}`));
  return snap.exists();
}

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = 'index.html';
    return;
  }
  if (!(await isAdmin(user.uid))) {
    alert('คุณไม่มีสิทธิ์เข้าใช้งานหน้านี้');
    window.location.href = 'game.html';
    return;
  }
  loadAdminPanel();
});

async function loadAdminPanel() {
  const content = document.getElementById('admin-content');
  // แสดงรายชื่อผู้ใช้
  const usersSnap = await get(ref(db, 'users'));
  const users = usersSnap.val();
  let html = '<h3>รายชื่อผู้ใช้</h3><ul>';
  for (const [uid, data] of Object.entries(users)) {
    html += `<li>${data.username} - Bobux: ${data.bobux} <button onclick="giveBobux('${uid}')">ให้ Bobux</button></li>`;
  }
  html += '</ul>';
  content.innerHTML = html;

  // ฟังก์ชันให้ Bobux (ต้องผูกกับ window)
  window.giveBobux = async (uid) => {
    const amount = prompt('จำนวน Bobux ที่ต้องการให้:');
    if (!amount) return;
    const userRef = ref(db, `users/${uid}/bobux`);
    const snap = await get(userRef);
    const current = snap.val() || 0;
    await set(userRef, current + parseInt(amount));
    alert('ให้เรียบร้อย');
    loadAdminPanel(); // โหลดใหม่
  };
}

document.getElementById('logout-admin').addEventListener('click', () => {
  auth.signOut();
});
