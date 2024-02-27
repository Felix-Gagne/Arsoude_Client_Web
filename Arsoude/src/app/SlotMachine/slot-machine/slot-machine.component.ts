import { Component, OnInit } from '@angular/core';
import { trigger, transition, style, animate, state, AnimationPlayer, AnimationBuilder } from '@angular/animations';

@Component({
  selector: 'app-slot-machine',
  templateUrl: './slot-machine.component.html',
  styleUrls: ['./slot-machine.component.css'],
  animations: [
    trigger("boxAnimation", [
      transition(":enter", [
        style({ transform: "translateY(-100%)", opacity: 0 }),
        animate("1s ease-out", style({ transform: "translateY(0%)", opacity: 1 }))
      ]),
      transition(":leave", [
        animate("1s ease-in", style({ transform: "translateY(100%)", opacity: 0 }))
      ])
    ])
  ]
})
export class SlotMachineComponent implements OnInit {
  symbols: string[] = ['🍒', '🍊', '🍋', '🍇', '🍉', '🍓'];
  reels: string[][] = [];
  compteur: number = 0;
  animationPlayers: AnimationPlayer[] = [];

  constructor(private animationBuilder: AnimationBuilder) { }

  ngOnInit() {
    // Generate a 10x10 grid
    this.reels = this.generateGrid(50, 5);
  }

  async spin() {

    var spinDuration = 500;
    const startTime = Date.now();

    const spinPromises = [];



    for (let i = 0; i < this.reels[0].length; i++) {
      spinDuration += 1000;

      const reelElement = document.querySelector(`.reel:nth-child(${i + 1})`);
      if (reelElement) {
        const animation = this.animationBuilder.build([
          style({ transform: "translateY(-100%)", opacity: 0 }),
          animate(`${spinDuration}ms ease-out`, style({ transform: "translateY(0%)", opacity: 1 }))
        ]);
        const player = animation.create(document.querySelector(`.reel:nth-child(${i + 1})`));
        this.animationPlayers.push(player);
        player.play();
      }
      spinPromises.push(this.spinColumn(i));
    }
    console.log(this.reels);
    await Promise.all(spinPromises);
     console.log(this.verifyConnections())


  }

  /*async verifyConnections(){
    let score = 0;
    var connexionWork = true;
    var collumn = 1;
    const reels = this.reels;

    reels.forEach((rowArray, row) => {
        if (row >= 23 && row <= 27) {
            rowArray.forEach(async (symbol, column) => {
                if (column < rowArray.length - 1) {
                    while (connexionWork) {
                        if (symbol === reels[row][collumn]) {
                            score++;
                            if(collumn < 5){
                              collumn++;
                            }
                        }
                        if (symbol === reels[row + 1][column]) {
                            score++;
                        }
                        // Assuming some condition breaks the while loop
                    }
                }
            });
        }
    });

    for (let row = 23; row <= 27; row++) {
      for (let column = 0; column < this.reels[row].length - 1; column++) {
        // Comparaison des symboles adjacents horizontalement
        while(connexionWork){
          if (this.reels[row][column] === this.reels[row][column + 1]) {
            score++;
          }
          //verify vertical
          if(this.reels[row][column] === this.reels[row+1][column]){
            score++;
          }
        }
        
      }
    }
  }*/

  explorationStack: { x: number, y: number }[] = [];
  exploredSet: Set<{ x: number, y: number }> = new Set();
  currentValue: string = '';
  score = 0;


   verifyConnections() : number {
    this.score = 0;
    this.explorationStack = [{ x: 23, y: 0 }];
    this.exploredSet = new Set();
    this.currentValue = this.reels[this.explorationStack[0].x][this.explorationStack[0].y];
    this.explore(this.explorationStack[0].x, this.explorationStack[0].y);
    return this.score;
  }


  explore(x: number, y: number) {
    if (!this.exploredSet.has({ x: x, y: y })) {
      this.exploredSet.add({x: x, y: y})
      if (this.isBounded(x, y + 1) && this.reels[x][y + 1] == this.currentValue) {
        this.score++;
        console.log(x,y+1)
        console.log(this.isBounded(x, y + 1))
        if(this.isBounded(x, y+1) && this.reels[x][y +2] == this.currentValue){
          this.score ++
          this.explore(x, y+2)
        }
        if(this.isBounded(x, y+1) && this.reels[x + 1][y +1] == this.currentValue){
          this.score ++
          this.explore(x, y+2)
        }
      
      } else if (this.isBounded(x + 1, y) && this.reels[x + 1][y] == this.currentValue) {
        this.score++;
        console.log(x+1,y)
        console.log(this.isBounded(x, y + 1))

        
      } else if (this.isBounded(x - 1, y) && this.reels[x - 1][y] == this.currentValue) {
        this.score++;
        console.log(x-1,y)
        console.log(this.isBounded(x, y + 1))

        
      } else if (this.isBounded(x, y - 1) && this.reels[x][y - 1] == this.currentValue) {
        this.score++;
        console.log(x,y-1)
        console.log(this.isBounded(x, y + 1))
      
      }

    }
  }

  isBounded(x: number, y: number): boolean {
    return x >= 23 && x <= 26 && y >= 0 && y <= 4;
  }

  async spinColumn(columnIndex: number) {


    // Spin the symbols in the current column
    for (let i = 0; i < this.reels.length; i++) {
      this.reels[i][columnIndex] = this.getRandomSymbol(); // Update symbol
    }

  }

  async spinSymbol(columnIndex: number, rowIndex: number) {
    const delay = 50; // Adjust delay as needed
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        this.reels[rowIndex][columnIndex] = this.getRandomSymbol();
        resolve();
      }, delay);
    });
  }

  getRandomSymbol() {
    const index = Math.floor(Math.random() * this.symbols.length);
    return this.symbols[index];
  }

  generateGrid(rows: number, columns: number): string[][] {
    const grid: string[][] = [];
    for (let i = 0; i < rows; i++) {
      grid[i] = [];
      for (let j = 0; j < columns; j++) {
        grid[i][j] = this.getRandomSymbol();
      }
    }
    return grid;
  }

  sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  info(row: number, column: number) {
    console.log(`Clicked symbol at row ${row}, column ${column}`);

  }
}
