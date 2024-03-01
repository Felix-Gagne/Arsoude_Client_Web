export class Symbols {
    id: number;
    name: string;
    image: string;
    value : number;
    x: number;
    y: number;
  
    constructor(id: number, name: string, image: string, value: number) {
      this.id = id;
      this.name = name;
      this.image = image;
      this.value = value;
      this.x = 0; // Initialize x position
      this.y = 0; // Initialize y position
    }
  }
  