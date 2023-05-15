class Utils {

  public static getStretchPoint(height: number, rows: number, position: number): number {
    const piece = height / rows;
    return piece * position - piece / 2;
  }

  public static convertTime(time: number): string {
    const hours = Math.floor(time / (60 * 60));
    const minutes = Math.floor((time - (hours * 60 * 60)) / 60);
    const seconds = time - (hours * 60 * 60) - minutes * 60;
    return hours + ':' + (minutes.toString().length === 1 ? '0' + minutes : minutes) + ':' + (seconds.toString().length === 1 ? '0' + seconds : seconds);
  }

  public static link(link: string): void {
    const a = document.createElement('a');
    a.setAttribute('target', '_blank');
    document.body.appendChild(a);
    a.href = link;
    a.click();
    document.body.removeChild(a);
  }

  public static gcd(num1: number, num2: number): number {
    while (num1 && num2) num1 > num2 ? num1 %= num2 : num2 %= num1;
    num1 += num2;
    return num1;
  }
}

export default Utils;