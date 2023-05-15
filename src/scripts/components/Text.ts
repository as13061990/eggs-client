interface IoptionsText {
  x: number;
  y: number;
  fontMedium?: string;
  fontBold?: string;
  fontSize?: number;
  lineSpacing?: number;
  align?: 'left' | 'center' | 'right';
  originX?: number;
  originY?: number;
  color?: string;
}
interface IoptionsLine {
  text: string;
  style: fontStyle
}
type fontStyle = 'medium' | 'bold';

class Text extends Phaser.GameObjects.Sprite {
  constructor(scene: Phaser.Scene, text: string, {
    x = 0,
    y = 0,
    fontMedium = 'Raleway-Medium',
    fontBold = 'Raleway-Bold',
    fontSize = 26,
    lineSpacing = 6,
    align = 'center',
    originX = 0.5,
    originY = 0.5,
    color = '#000000'
  }: IoptionsText) {
    super(scene, 0, 0, '');
    this._x = x;
    this._y = y;
    this._scene = scene;
    this._text = text;
    this._fontMedium = fontMedium;
    this._fontBold = fontBold;
    this._fontSize = fontSize;
    this._lineSpacing = lineSpacing;
    this._align = align;
    this._originX = originX;
    this._originY = originY;
    this._color = color;
    this._build();
  }

  private _x: number;
  private _y: number;
  private _lines: IoptionsLine[][] = [];
  private _scene: Phaser.Scene;
  private _text: string;
  private _fontMedium: string;
  private _fontBold: string;
  private _fontSize: number;
  private _lineSpacing: number;
  private _align: 'left' | 'center' | 'right';
  private _originX: number;
  private _originY: number;
  private _color: string;
  private _texture: string;

  private _build(): void {
    this._createStructure();
    this._createTexture();
    this._render();
  }

  private _createStructure(): void {
    let style: fontStyle = 'medium';
    const lines = this._text.split('<br />');
    lines.map(line => {
      const lineOptions: IoptionsLine[] = [];
      let pull: string = '';

      for (let i = 0; i < line.length; i++) {
        const start = line[i] + line[i + 1] + line[i + 2] === '<b>';
        const end = line[i] + line[i + 1] + line[i + 2] + line[i + 3] === '</b>';

        if (start || end) {

          if (pull !== '') {
            lineOptions.push({ text: pull, style: style });
            pull = '';
          }
          style = start ? 'bold' : 'medium';
          i = start ? i + 2 : i + 3;
          continue;
        }
        pull += line[i];

        if (line.length - 1 === i) {
          lineOptions.push({ text: pull, style: style });
        }
      }
      this._lines.push(lineOptions);
    });
  }

  private _createTexture(): void {
    let subTexture = 0;
    this._texture = 'text-' + Phaser.Math.Between(1, 100000000);
    const texts: Phaser.GameObjects.Text[][] = [];
    let displayWidth = 0, displayHeight = 0, height = 0;

    this._lines.map((lines, index) => {
      let width = 0
      texts[index] = [];
      const textsLine = texts[index];

      lines.map(line => {
        const text = this._scene.add.text(0, 0, line.text, {
          font: this._fontSize + 'px ' + (line.style === 'bold' ? this._fontBold : this._fontMedium),
          color: this._color
        });
        width += text.getBounds().width;
        height = height > text.getBounds().height ? height : text.getBounds().height;
        textsLine.push(text);
      });

      displayWidth = width > displayWidth ? width : displayWidth;
      displayHeight += (height + this._lineSpacing);
    });

    const texture = this._scene.add.renderTexture(0, 0, displayWidth, displayHeight);
    const subTextures: Phaser.GameObjects.RenderTexture[] = [];

    texts.map(texts => {
      let x = 0, width = 0;
      
      texts.map(text => {
        width += text.getBounds().width;
      });
      const texture = this._scene.add.renderTexture(0, 0, width === 0 ? 1 : width, height + this._lineSpacing);

      texts.map(text => {
        texture.draw(text, x, 0);
        x += text.getBounds().width;
        text.destroy();
      });
      const name = this._texture + '-' + subTexture;
      subTextures.push(texture);
      texture.saveTexture(name);
      texture.destroy();
      subTexture++;
    });
    
    subTextures.map((sub, index) => {
      const sprite = this._scene.add.sprite(0, 0, sub.texture.key).setOrigin(0);
      const x = this._align === 'right' ? displayWidth - sprite.getBounds().width : this._align === 'center' ? displayWidth / 2 - sprite.getBounds().width / 2 : 0;
      const y = index * (height + this._lineSpacing);
      texture.draw(sprite, x, y);
      sprite.destroy();
    });

    texture.saveTexture(this._texture);
    texture.destroy();
  }

  private _render(): void {
    this.setTexture(this._texture);
    this._scene.add.existing(this);
    this.setOrigin(this._originX, this._originY);
    this.setPosition(this._x, this._y);
  }

  public static create(scene: Phaser.Scene, text: string, options: IoptionsText): Text {
    return new Text(scene, text, options);
  }
}

export default Text;