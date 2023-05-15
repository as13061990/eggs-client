const SWIPE_OFFSET = 100;

class Zone extends Phaser.GameObjects.Zone {
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    width: number,
    height: number
  ) {
    super(scene, x, y, width, height);
    this.scene = scene;
    this.x = x;
    this.y = y;
    this._build();
  }

  public x: number;
  public y: number;
  private _press: boolean;
  private _xDown: number;
  private _yDown: number;
  private _currentX: number;
  private _currentY: number;
  private _graphics: Phaser.GameObjects.Graphics;
  private _pointer: Phaser.Input.Pointer = this.scene.input.activePointer;
  public clickCallback: Function = (): void => {};
  public downCallback: Function = (): void => {};
  public upCallback: Function = (): void => {};
  public downClickCallback: Function = (): void => {};
  public leftSwipe: Function = (): void => {};
  public rightSwipe: Function = (): void => {};
  public topSwipe: Function = (): void => {};
  public bottomSwipe: Function = (): void => {};
  public hoverOn: Function = (): void => {};
  public hoverOff: Function = (): void => {};

  private _build(): void {
    this.scene.add.existing(this);
    this.setInteractive({ cursor: 'pointer' });
    this._сlick();
    // this._setGraphic();
  }

  private _setGraphic(): void {
    this._graphics = this.scene.add.graphics().setDepth(this.y * 5);
    this._graphics.lineStyle(2, 0xFFFF00);
    this._graphics.strokeRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
  }

  private _сlick(): void {
    let moveCounter = 0;
    const maxMoveCounter = 3;
  
    this.on('pointerdown', (e: Phaser.Input.Pointer): void => {
      this.downClickCallback();

      this._xDown = this.x;
      this._yDown = this.y;
      this._press = true;
      this._currentX = e.position.x;
      this._currentY = e.position.y;
    });
    this.on('pointermove', (): void => {
      if (this._press) moveCounter++;
    });
    this.on('pointerout', (): void => {
      if (this._press) {
        moveCounter = 0;
        this._press = false;
      }
      this.hoverOff();
    });
    this.on('pointerover', (): void => {
      this.hoverOn();
    });
    this.on('pointerup', (e: Phaser.Input.Pointer): void => {
      if (this._currentX - e.position.x > SWIPE_OFFSET) {
        this.leftSwipe();
      } else if (this._currentX - e.position.x < -SWIPE_OFFSET) {
        this.rightSwipe();
      } else if (this._currentY - e.position.y > SWIPE_OFFSET) {
        this.topSwipe();
      } else if (this._currentY - e.position.y < -SWIPE_OFFSET) {
        this.bottomSwipe();
      }
      let x: number, y: number;
  
      if (this._xDown >= this.x) x = this._xDown - this.x;
      else x = this.x - this._xDown;
  
      if (this._yDown >= this.y) y = this._yDown - this.y;
      else y = this.y - this._yDown;
      
      if (this._press && moveCounter < maxMoveCounter && x < 5 && y < 5) {
        this._press = false;
        this.clickCallback(e);
      } else if (this._press) {
        this._press = false;
      }
      moveCounter = 0;
    });
  }

  protected preUpdate(): void {
    if (this._pointer.isDown || this.scene.input.pointer1.isDown) {
      this.downCallback();
    } else {
      this.upCallback();
    }
  }

  public destroy(): void {
    this._graphics?.destroy();
    super.destroy();
  }

  public static createFromSprite(sprite: Phaser.GameObjects.Sprite): Zone {
    return new Zone(sprite.scene, sprite.getBounds().centerX, sprite.getBounds().centerY, sprite.displayWidth, sprite.displayHeight);
  }
}

export default Zone;