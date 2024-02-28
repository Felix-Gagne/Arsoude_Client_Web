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
  //symbols: string[] = ['🍒', '🍊', '🍋', '🍇', '🍉', '🍓'];
  symbols: string[] = ['🍒'];
  reels: string[][] = [];
  rowStack : string[][] = [];
  compteur: number = 0;
  animationPlayers: AnimationPlayer[] = [];
  connectedSymbols: boolean[][] = [];
  nextRow : string[] = [];
  previousRow : string[] = [];

  constructor(private animationBuilder: AnimationBuilder) { }

  ngOnInit() {
    // Generate a 10x10 grid
    this.reels = this.generateGrid(50, 5);
    this.resetConnectedSymbols();
  }

  resetConnectedSymbols() {
    for (let i = 0; i < this.reels.length; i++) {
      this.connectedSymbols[i] = [];
      for (let j = 0; j < this.reels[i].length; j++) {
        this.connectedSymbols[i][j] = false;
      }
    }
  }

  getSymbolBackgroundColor(i: number, j: number): string {
    return this.connectedSymbols[i][j] ? 'yellow' : 'transparent';
  }

  async spin() {

    var spinDuration = 500;
    const startTime = Date.now();
    this.compteur = 0;
    this.rowStack = [];
    const spinPromises = [];
    this.resetConnectedSymbols();



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
    await this.verifyConnection();
  }

  async verifyConnection(){
        for(let i = 23; i <= 26; i++){
          var row = [];
          for(let j = 0; j <= 4; j++){
              var symbol = this.reels[i][j];
              row.push(symbol);
          }
          this.rowStack.push(row);
        }
        var rowInfo = 0;
        for(let row = 23; row <= 26; row++){
          await this.verifyRow(row, rowInfo)
          rowInfo += 1
          console.log(this.compteur)
        }



  }

  async verifyRow(x : number, rowInfo : number){
    this.exploredSet.clear();
    var row = this.rowStack[rowInfo];
    console.log(row);
    var symbol = row[0];
    const currentPosition = { x: x, y: 0 }
    this.exploredSet.add(currentPosition);
    for(let value = 1; value <= 4; value++){
      var nextSymbol = row[value];
      if(symbol == nextSymbol){
        const newPosition = { x: x, y: value }
        this.exploredSet.add(newPosition);
        this.connectedSymbols[x][value] = true;
        
      }else{
        console.log("on break;")
        break;
      }
    }

    

    if(this.exploredSet.size >= 3){
      const exploredArray = Array.from(this.exploredSet);

      this.compteur += this.exploredSet.size;
      for(let i = 0; i < this.exploredSet.size;i ++){
        const currentPosition = exploredArray[i]
        
        this.connectedSymbols[currentPosition.x][currentPosition.y] = true;
      }
    }
  }

  async verifyRowDiagonal(x : number, rowInfo : number){
    this.exploredSet.clear();
    var row = this.rowStack[rowInfo];
    console.log(row);
    var symbol = row[0];
    const currentPosition = { x: x, y: 0 }
    this.exploredSet.add(currentPosition);
    for(let value = 1; value <= 4; value++){
      
      if(rowInfo != 4 && rowInfo == 0){
        this.nextRow = this.rowStack[rowInfo +1]
      }
      var nextSymbol = this.nextRow[value];
      if(symbol == nextSymbol){
        const newPosition = { x: x, y: value }
        this.exploredSet.add(newPosition);
        this.connectedSymbols[x][value] = true;
        
      }else{
        console.log("on break;")
        break;
      }
    }

    

    

    if(this.exploredSet.size >= 3){
      const exploredArray = Array.from(this.exploredSet);

      this.compteur += this.exploredSet.size;
      for(let i = 0; i < this.exploredSet.size;i ++){
        const currentPosition = exploredArray[i]
        
        this.connectedSymbols[currentPosition.x][currentPosition.y] = true;
      }
    }
  }



  
  exploredSet: Set<{ x: number, y: number }> = new Set();
  currentValue: string = '';
  score = 0;


   /*verifyConnections() : number {
    this.score = 0;
    this.explorationStack = [{ x: 23, y: 0 }];
    this.exploredSet = new Set();
    this.currentValue = this.reels[this.explorationStack[0].x][this.explorationStack[0].y];
    this.explore(this.explorationStack[0].x, this.explorationStack[0].y);
    return this.score;
  }*/

  

  /*async explore(x: number, y: number) {
    const currentPosition = { x: x, y: y };

    if (!this.exploredSet.has(currentPosition)) {
      this.exploredSet.add(currentPosition);
      var rightValue = this.reels[x][y + 1];
      var underValue = this.reels[x + 1][y];
      var leftValue = this.reels[x][y - 1];
      var topValue = this.reels[x - 1][y];
      //verify from right value
      if (this.isBounded(x, y) && rightValue == this.currentValue) {
        this.score++;
        this.connectedSymbols[x][y + 1] = true;
        const newPosition = { x: x, y: y +1};
        this.exploredSet.add(newPosition);

        await this.checkConnectedRight(x, y + 2);
        await this.checkConnectedUnder(x + 1, y + 1);
        if(newPosition.y != 0){
          await this.checkConnectedLeft(x, y - 1);
        };
        await this.checkConnectedTop(x - 1, y);
        
      } 

      if (this.isBounded(x, y) && underValue == this.currentValue) {
        this.score++;

        console.log("Ceci est le score :",this.score)
        console.log("valeur a droite",x,y+1)
        await this.checkConnectedRight(x, y + 2);
        await this.checkConnectedUnder(x + 1, y + 1);
        if(y != 0){
          await this.checkConnectedLeft(x, y - 1);
        };
        await this.checkConnectedTop(x - 1, y);
        
      } 

      if (this.isBounded(x, y) && topValue == this.currentValue) {
        this.score++;

        console.log("Ceci est le score :",this.score)
        console.log("valeur a droite",x,y+1)
        await this.checkConnectedRight(x, y + 2);
        await this.checkConnectedUnder(x + 1, y + 1);
        if(y != 0){
          await this.checkConnectedLeft(x, y - 1);
        };
        await this.checkConnectedTop(x - 1, y);
        
      } 

      if (this.isBounded(x, y) && leftValue == this.currentValue) {
        this.score++;

        console.log("Ceci est le score :",this.score)
        console.log("valeur a droite",x,y+1)
        await this.checkConnectedRight(x, y + 2);
        await this.checkConnectedUnder(x + 1, y + 1);
        if(y != 0){
          await this.checkConnectedLeft(x, y - 1);
        };
        await this.checkConnectedTop(x - 1, y);
        
      }
   
      console.log(this.exploredSet);
    }
  }

  async checkConnectedRight(x: number, y: number) {
    var symboleDroite = this.reels[x][y];
    var currentPosition = { x: x, y: y };

    if (!this.exploredSet.has(currentPosition)) {
        if (this.isBounded(x, y) && symboleDroite == this.currentValue) {
            this.score++;
            this.connectedSymbols[x][y] = true;
            console.log("Ceci est le score :", this.score);
            console.log("valeur a droite", x, y);
            await this.explore(x, y);
        }
    }
}

async checkConnectedUnder(x: number, y: number) {
    var currentPosition = { x: x, y: y };
    var symboleEnDessous = this.reels[x][y];
    if (!this.exploredSet.has(currentPosition)) {
        if (this.isBounded(x, y) && symboleEnDessous == this.currentValue) {
            this.score++;
            this.connectedSymbols[x][y] = true;
            console.log("Ceci est le score :", this.score);
            console.log("valeur en dessous", x, y);
            await this.explore(x, y);
        }
    }
}

async checkConnectedLeft(x: number, y: number) {
  var currentPosition = { x: x, y: y };
  var symboleDroite = this.reels[x][y];
  if (!this.exploredSet.has(currentPosition)) {
      if (this.isBounded(x, y) && symboleDroite == this.currentValue) {
          this.score++;
          this.connectedSymbols[x][y] = true;
          console.log("Ceci est le score :", this.score);
          console.log("valeur a droite", x, y);
          await this.explore(x, y);
      }
  }
}

async checkConnectedTop(x: number, y: number) {
  var currentPosition = { x: x, y: y };
  var symboleDroite = this.reels[x][y];
  if (!this.exploredSet.has(currentPosition)) {
      if (this.isBounded(x, y) && symboleDroite == this.currentValue) {
          this.score++;
          this.connectedSymbols[x][y] = true;
          console.log("Ceci est le score :", this.score);
          console.log("valeur a droite", x, y);
          await this.explore(x, y);
      }
  }
}*/

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
