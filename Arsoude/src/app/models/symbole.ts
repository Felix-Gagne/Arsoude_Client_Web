export class Symbols {
    id: number;
    name: string;
    image: string;
    x: number;
    y: number;
  
    constructor(id: number, name: string, image: string) {
      this.id = id;
      this.name = name;
      this.image = image;
      this.x = 0; // Initialize x position
      this.y = 0; // Initialize y position
    }
  }
  