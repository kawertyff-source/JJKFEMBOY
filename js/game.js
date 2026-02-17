import { auth, db } from './firebaseConfig.js';
import { onAuthStateChanged } from 'firebase/auth';
import { ref, onValue, update } from 'firebase/database';
import { getUserData, updateUserData } from './auth.js';
import { loadStyles, displayStyles } from './gacha.js';
import { Combat } from '../modules/combatEngine.js';
import { domains } from '../modules/domainManager.js';

let currentUser = null;
let userData = null;

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = 'index.html';
    return;
  }
  currentUser = user;
  userData = await getUserData(user.uid);
  updateUI();
  setupTabs();
  setupGacha();
  setupVS();
  setupQuests();
});

function updateUI() {
  document.getElementById('player-name').textContent = userData.username;
  document.getElementById('bobux').textContent = userData.bobux;
  document.getElementById('spins-count').textContent = userData.spins;
  document.getElementById('pity-count').textContent = `${userData.pity || 0}/100`;
  displayStyles(userData.styles); // แสดงสไตล์ในแท็บ styles
}

function setupTabs() {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(btn.dataset.tab + '-tab').classList.add('active');
    });
  });
}

// ส่วนกาชา (เรียกใช้ gacha.js)
function setupGacha() {
  document.getElementById('spin-btn').addEventListener('click', async () => {
    if (userData.spins <= 0) {
      alert('ไม่มีสปินเหลือแล้ว!');
      return;
    }
    // ลดสปิน และสุ่ม
    const { style, isPity } = await spin(currentUser.uid);
    if (style) {
      userData.spins--;
      userData.pity = isPity ? 0 : (userData.pity + 1);
      await updateUserData(currentUser.uid, { spins: userData.spins, pity: userData.pity });
      updateUI();
      showSpinResult(style);
    }
  });
}

function showSpinResult(style) {
  const resultDiv = document.getElementById('spin-result');
  resultDiv.innerHTML = `🎉 ได้รับสไตล์: ${style.name} (${style.rarity})`;
}

// ระบบ VS
function setupVS() {
  const canvas = document.getElementById('fight-canvas');
  const ctx = canvas.getContext('2d');
  const combat = new Combat(
    { name: 'ผู้เล่น', stamina: 100, style: userData.styles?.[0] },
    { name: 'CPU', stamina: 100, style: 'Iron Fist' }
  );

  document.getElementById('attack-light').addEventListener('click', () => {
    const result = combat.attack(combat.p1, combat.p2, 'หมัดเบา');
    drawFight(ctx, combat);
    console.log(result);
  });

  document.getElementById('domain-expand').addEventListener('click', () => {
    // หาอาณาเขตที่ผู้เล่นมี
    const domain = domains.find(d => d.name === 'Iron Doom'); // ตัวอย่าง
    if (domain) {
      domain.expand();
      combat.domainAttack(combat.p1);
    }
  });

  document.getElementById('find-match').addEventListener('click', () => {
    alert('กำลังค้นหาคู่ต่อสู้... (ใช้ Firebase Realtime)');
    // เรียก multiplayer.findMatch(currentUser.uid)
  });
}

function drawFight(ctx, combat) {
  // วาดสถานะการต่อสู้แบบ 2.5D (พิกเซล) ตามภาพ IMG_4255,4256
  ctx.clearRect(0, 0, 800, 400);
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, 800, 400);
  ctx.font = '16px "Press Start 2P"';
  ctx.fillStyle = '#fff';
  ctx.fillText(`${combat.p1.name} HP: ${combat.p1.stamina}`, 50, 50);
  ctx.fillText(`${combat.p2.name} HP: ${combat.p2.stamina}`, 500, 50);
  // เพิ่มสไปรท์ตัวละคร ฯลฯ
}

// เควส
function setupQuests() {
  loadQuests(currentUser.uid).then(quests => {
    const list = document.getElementById('quest-list');
    quests.forEach(q => {
      const li = document.createElement('li');
      li.textContent = `${q.desc} (${q.progress}/${q.target}) - รางวัล ${q.reward} Bobux`;
      list.appendChild(li);
    });
  });
}
// เพิ่มฟังก์ชันปรับขนาด Canvas ตามหน้าจอ
function resizeCanvas() {
    const canvas = document.getElementById('fight-canvas');
    const container = canvas.parentElement;
    const containerWidth = container.clientWidth;
    
    // คงอัตราส่วน 2:1 (800x400)
    canvas.width = Math.min(800, containerWidth);
    canvas.height = canvas.width / 2;
    
    // วาดใหม่ถ้ามีข้อมูลการต่อสู้
    if (window.currentCombat) {
        drawFight(canvas.getContext('2d'), window.currentCombat);
    }
}

// เรียกเมื่อโหลดหน้าและเมื่อหมุนจอ
window.addEventListener('load', resizeCanvas);
window.addEventListener('resize', resizeCanvas);

// ตรวจจับการหมุนจอบนมือถือ
screen.orientation?.addEventListener('change', resizeCanvas);
 });
  });
}
