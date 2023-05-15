class Sounds implements Isounds {
  constructor(scene: Phaser.Scene) {
    this._scene = scene;
  }

  private _scene: Phaser.Scene;
  private _track: string;
  private _music: Phaser.Sound.BaseSound;
  private _volume: number = 1;

  public resumeMusic(): void {
    if (this._scene.sound.get(this._track)) {
      this._music.resume();
    }
  }

  public playMusic(sound: string): void {
    if (this._scene.sound.get(this._track) && this._track === sound) {
      return;
    }
    
    if (this._track !== sound) {
      this._music?.destroy();
    }
    this._track = sound;
    this._music = this._scene.sound.add(this._track, {
      volume: this._volume,
      loop: true
    });
    this._music.play();
  }

  public pauseMusic(): void {
    if (this._scene.sound.get(this._track)) {
      this._music.pause();
    }
  }

  public stopMusic(): void {
    if (this._scene.sound.get(this._track)) {
      this._music.destroy();
    }
  }

  public play(sound: string): void {
    this._scene.sound.add(sound, {
      volume: this._volume,
      loop: false
    }).play();
  }

  public mute(): void {
    this._volume = 0;
    // @ts-ignore
    this._music.setVolume(this._volume);
  }

  public unmute(): void {
    this._volume = 1;
    // @ts-ignore
    this._music.setVolume(this._volume);
  }

  public getVolume(): number {
    return this._volume;
  }
}

export default Sounds;