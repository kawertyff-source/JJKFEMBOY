import { ref, update, get } from 'firebase/database';
import { db } from './firebaseConfig.js';
import { stylesDatabase } from '../modules/styleData.js';

// โอกาสตาม rarity (รวม 100%)
const probabilities = {
  uncommon: 0.63,
  rare: 0.27,
  mythic: 0.09,
  legendary: 0.00985,   // ปรับให้รวมกับ shiny แล้วได้ 1%
  shiny: 0.00015
};

// สุ่มสไตล์ตาม rarity
function randomStyleByRarity(rarity) {
  const pool = stylesDatabase.filter(s => s.rarity === rarity);
  if (pool.length === 0) return null;
  return pool[Math.floor(Math.random() * pool.length)];
}

export async function spin(uid) {
  const userRef = ref(db, `users/${uid}`);
  const userSnap = await get(userRef);
  const userData = userSnap.val();

  // ตรวจสอบ pity (ทุก 100 ครั้งได้ Legendary)
  let isPity = false;
  if (userData.pity >= 99) {  // 99 เพราะครั้งที่ 100 จะได้
    isPity = true;
    const legendaryStyle = randomStyleByRarity('legendary');
    await update(userRef, { pity: 0 });
    return { style: legendaryStyle, isPity: true };
  }

  // สุ่มปกติ
  const rand = Math.random();
  let accumulated = 0;
  for (const [rarity, prob] of Object.entries(probabilities)) {
    accumulated += prob;
    if (rand < accumulated) {
      const style = randomStyleByRarity(rarity);
      return { style, isPity: false };
    }
  }
  // fallback
  return { style: stylesDatabase[0], isPity: false };
}

export function displayStyles(userStyles) {
  // userStyles = { '1': { equipped: false, count: 1 }, ... }
  const container = document.getElementById('style-list');
  if (!container) return;
  container.innerHTML = '';
  for (const [idStr, data] of Object.entries(userStyles)) {
    const style = stylesDatabase.find(s => s.id === parseInt(idStr));
    if (!style) continue;
    const div = document.createElement('div');
    div.className = `style-card rarity-${style.rarity}`;
    div.innerHTML = `
      <h3>${style.name}</h3>
      <p>อาณาเขต: ${style.domain}</p>
      <p>ATK: ${style.atk} DEF: ${style.def}</p>
      <button class="equip-btn" data-id="${style.id}">สวมใส่</button>
    `;
    if (data.equipped) div.classList.add('equipped');
    container.appendChild(div);
  }
}
