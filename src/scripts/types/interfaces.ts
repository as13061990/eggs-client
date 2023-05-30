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
  leftUp: Phaser.GameObjects.Sprite
  leftDown: Phaser.GameObjects.Sprite
  rightUp: Phaser.GameObjects.Sprite
  rightDown: Phaser.GameObjects.Sprite
}

interface IgetRatingsUser {
  place: number
}

interface IgetRatingsUsersObject {
  score: number 
  name: string
}


interface IgetRatings {
  user: IgetRatingsUser
  users: IgetRatingsUsersObject[]
}