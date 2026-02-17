export class Combat {
  constructor(player1, player2) {
    this.p1 = player1;
    this.p2 = player2;
    this.turn = 0;
  }

  attack(attacker, defender, move) {
    let damage = 10;
    if (move.includes('หนัก')) damage = 20;
    // ตรวจสอบสไตล์และความสามารถ
    if (attacker.style?.includes('Iron Fist')) damage += 5;
    defender.stamina -= damage;
    if (defender.stamina < 0) defender.stamina = 0;
    return `${attacker.name} ใช้ ${move} ทำดาเมจ ${damage}`;
  }

  domainAttack(user) {
    user.domain?.expand();
    // เพิ่มเอฟเฟกต์พิเศษ ลดพลังคู่ต่อสู้ ฯลฯ
    this.p2.stamina -= 30;
  }
}
