import { ref, get, update } from 'firebase/database';
import { db } from './firebaseConfig.js';

export const dailyQuests = [
  { id: 'q1', desc: 'ชนะ 3 แมตช์', target: 3, reward: 100 },
  { id: 'q2', desc: 'กาชา 5 ครั้ง', target: 5, reward: 50 },
  { id: 'q3', desc: 'กางอาณาเขต 1 ครั้ง', target: 1, reward: 80 }
];

export async function loadQuests(uid) {
  const snap = await get(ref(db, `users/${uid}/quests`));
  const userQuests = snap.val() || {};
  // รวมกับ dailyQuests
  return dailyQuests.map(q => ({
    ...q,
    progress: userQuests[q.id]?.progress || 0,
    completed: userQuests[q.id]?.completed || false
  }));
}

export async function updateQuestProgress(uid, questId, progress) {
  const questRef = ref(db, `users/${uid}/quests/${questId}`);
  const target = dailyQuests.find(q => q.id === questId)?.target;
  const completed = progress >= target;
  await update(questRef, { progress, completed });
  if (completed) {
    // ให้รางวัล
    const reward = dailyQuests.find(q => q.id === questId)?.reward;
    const userRef = ref(db, `users/${uid}`);
    const userSnap = await get(userRef);
    const bobux = userSnap.val().bobux + reward;
    await update(userRef, { bobux });
  }
}
