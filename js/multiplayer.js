import { ref, set, push, onValue, update } from 'firebase/database';
import { db } from './firebaseConfig.js';

export function createRoom(uid) {
  const roomRef = push(ref(db, 'rooms'));
  const roomId = roomRef.key;
  set(roomRef, {
    player1: uid,
    player2: null,
    status: 'waiting',
    createdAt: Date.now()
  });
  return roomId;
}

export function joinRoom(roomId, uid) {
  const roomRef = ref(db, `rooms/${roomId}`);
  update(roomRef, { player2: uid, status: 'ready' });
}

export function onRoomUpdate(roomId, callback) {
  return onValue(ref(db, `rooms/${roomId}`), (snapshot) => {
    callback(snapshot.val());
  });
}

export async function findMatch(uid) {
  // ค้นหาห้องที่รออยู่
  const roomsSnap = await get(ref(db, 'rooms'));
  const rooms = roomsSnap.val();
  if (!rooms) return createRoom(uid);
  const waitingRoom = Object.entries(rooms).find(([id, data]) => data.status === 'waiting' && data.player1 !== uid);
  if (waitingRoom) {
    joinRoom(waitingRoom[0], uid);
    return waitingRoom[0];
  } else {
    return createRoom(uid);
  }
}
