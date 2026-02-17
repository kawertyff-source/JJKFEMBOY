export const stylesDatabase = [
  // UNCOMMON
  { id: 1, name: 'Slugger', rarity: 'uncommon', domain: 'Slugger Field', atk: 10, def: 5 },
  { id: 2, name: 'Shotgun', rarity: 'uncommon', domain: 'Blast Zone', atk: 12, def: 3 },
  // RARE
  { id: 3, name: 'Iron Fist', rarity: 'rare', domain: 'Iron Doom', atk: 15, def: 10 },
  { id: 4, name: 'Hawk', rarity: 'rare', domain: 'Sky Prison', atk: 14, def: 8 },
  // MYTHIC
  { id: 5, name: 'Ghost', rarity: 'mythic', domain: 'Phantom Void', atk: 20, def: 12 },
  { id: 6, name: 'Chronos', rarity: 'mythic', domain: 'Time Stop', atk: 18, def: 15 },
  { id: 7, name: 'Supernova', rarity: 'mythic', domain: 'Star Burst', atk: 25, def: 10 },
  // LEGENDARY
  { id: 8, name: 'Freedom', rarity: 'legendary', domain: 'Liberty Realm', atk: 30, def: 20 },
  { id: 9, name: 'White Ash', rarity: 'legendary', domain: 'Ashen Grave', atk: 28, def: 22 },
  // SHINY (หายาก)
  { id: 10, name: 'SHINY Iron Fist', rarity: 'shiny', domain: 'Iron Doom', atk: 50, def: 40 }
];

export function getStyleById(id) {
  return stylesDatabase.find(s => s.id === id);
}

export function getStylesByRarity(rarity) {
  return stylesDatabase.filter(s => s.rarity === rarity);
}
