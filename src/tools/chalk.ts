import * as chalkLib from 'chalk';

export type Color = 'red' | 'green' | 'blue' | 'yellow' | 'magenta' | 'cyan' | 'orange' | 'cherry' | 'lime';

class Chalk {

    public red(message: string): void {
        console.log(chalkLib.rgb(255, 0, 0)(message));
    }

    public green(message: string): void {
        console.log(chalkLib.rgb(0, 255, 0)(message));
    }

    public blue(message: string): void {
        console.log(chalkLib.rgb(0, 0, 255)(message));
    }

    public yellow(message: string): void {
        console.log(chalkLib.rgb(255, 255, 0)(message));
    }

    public magenta(message: string): void {
        console.log(chalkLib.rgb(255, 0, 255)(message));
    }

    public cyan(message: string): void {
        console.log(chalkLib.rgb(0, 255, 255)(message));
    }

    public orange(message: string): void {
        console.log(chalkLib.rgb(255, 160, 0)(message));
    }

    public rust(message: string): void {
        console.log(chalkLib.rgb(255, 80, 50)(message));
    }

    public lime(message: string): void {
        console.log(chalkLib.rgb(75, 255, 75)(message));
    }

    public sky(message: string): void {
        console.log(chalkLib.rgb(50, 183, 255)(message));
    }

    public print(message: string, color: Color): void {
        switch(color) {
            case 'red':
                this.red(message);
                break;
            case 'green':
                this.green(message);
                break;
            case 'blue':
                this.blue(message);
                break;
            case 'yellow':
                this.yellow(message);
                break;
            case 'magenta':
                this.magenta(message);
                break;
            case 'cyan':
                this.cyan(message);
                break;
            case 'orange':
                this.orange(message);
                break;
            case 'cherry':
                this.rust(message);
                break;
            default:
                console.log(message);
        }
    }
}

export const chalk = new Chalk();