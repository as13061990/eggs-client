interface Iposition {
  x: number;
  y: number;
}
interface Isounds {
  resumeMusic: () => void;
  pauseMusic: () => void;
  playMusic: (sound: string) => void;
  stopMusic: () => void;
  play: (sound: string) => void;
  mute: () => void;
  unmute: () => void;
  getVolume: () => number;
}

interface IwoodElements {
  leftUp: Phaser.Physics.Arcade.Sprite
  leftDown: Phaser.Physics.Arcade.Sprite
  rightUp: Phaser.Physics.Arcade.Sprite
  rightDown: Phaser.Physics.Arcade.Sprite
}