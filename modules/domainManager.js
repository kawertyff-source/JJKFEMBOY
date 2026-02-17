export class Domain {
  constructor(name, audioSrc) {
    this.name = name;
    this.audio = new Audio(audioSrc);
  }

  expand() {
    this.audio.play();
    console.log(`🔥 ${this.name} ถูกกางออก! 🔥`);
  }
}

export const domains = [
  new Domain('Slugger Field', '../assets/sounds/slugger.mp3'),
  new Domain('Iron Doom', '../assets/sounds/iron.mp3'),
  new Domain('Sky Prison', '../assets/sounds/sky.mp3'),
  new Domain('Phantom Void', '../assets/sounds/phantom.mp3'),
  new Domain('Liberty Realm', '../assets/sounds/liberty.mp3')
];
