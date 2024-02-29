import { Component, OnInit } from '@angular/core';
import { trigger, transition, style, animate, state, AnimationPlayer, AnimationBuilder } from '@angular/animations';
import { Symbols } from 'src/app/models/symbole';

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
  symbols: string[] = ['🍒', '🍊', '🍋'];
  reels: Symbols[][] = [];
  rowStack : Symbols[][] = [];
  compteur: number = 0;
  animationPlayers: AnimationPlayer[] = [];
  connectedSymbols: boolean[][] = [];
  nextRow : Symbols[] = [];
  previousRow : Symbols[] = [];
  sameRow : Symbols[] = [];
  goUp : Symbols[] = [];
  goDown : Symbols[] = [];
  symbolList: Symbols[] = [
    new Symbols(1, "Symbol 1","felix.png"),
    new Symbols(2, "Symbol 2","mathieu.png"),
    new Symbols(3, "Symbol 3","maxime.png"),
    new Symbols(4, "Symbol 4","simeon.png"),
    new Symbols(5, "Symbol 5","vlad.png"),
    new Symbols(6, "wild","wild.png")
  ];



  constructor(private animationBuilder: AnimationBuilder) { }

  ngOnInit() {
    // Generate a 10x10 grid
    this.reels = this.generateGrid(50, 5);
    console.log(this.reels);
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
           this.verifyRow(row)
           this.verifyRowDiagonalUp(row)
           this.verifyRowDiagonalDown(row)
           this.verifyTriangleFormBottom(row)
           this.verifyTriangleFormTop(row)
          rowInfo += 1
          console.log(this.compteur)
        }



  }

  async verifyRow(x : number){
    this.exploredSet.clear();
    
    const currentPosition = { x: x, y: 0 }
    this.exploredSet.add(currentPosition);
    var symbol = this.reels[x][0];
    for(let i = 1; i <= 4; i++){
      var nextSymbol = this.reels[x][i];
      if(symbol.name == nextSymbol.name){
        const newPosition = { x: x, y: i }
        this.exploredSet.add(newPosition);
      }else{
        break;
      }
    }
  
    this.calculeScore();
  }

  async verifyTriangleFormBottom(x : number){
    this.exploredSet.clear();
    
    const currentPosition = { x: x, y: 0 }
    this.exploredSet.add(currentPosition);
    var symbol = this.reels[x][0];
    for(let i = 1; i <= 4; i++){
      var nextSymbol = this.goDownToNext(x,i);
      if(nextSymbol != undefined && symbol.name == nextSymbol.name){
        const newPosition = { x: nextSymbol.x, y: nextSymbol.y }
        this.exploredSet.add(newPosition);
        var trianglCompletion = this.goUpToNext(newPosition.x,newPosition.y);
        if(trianglCompletion != undefined  && trianglCompletion.name == symbol.name){
          this.exploredSet.add({ x: trianglCompletion.x, y: trianglCompletion.y });
          i++;
        }
        else{
          break;
        }
      }else{
        break;
      }
    }
  
    this.calculeScore();
  }

  async verifyTriangleFormTop(x : number){
    this.exploredSet.clear();
    
    const currentPosition = { x: x, y: 0 }
    this.exploredSet.add(currentPosition);
    var symbol = this.reels[x][0];
    for(let i = 1; i <= 4; i++){
      var nextSymbol = this.goUpToNext2(x,i);
      if(nextSymbol != undefined && symbol.name == nextSymbol.name){
        const newPosition = { x: nextSymbol.x, y: nextSymbol.y }
        this.exploredSet.add(newPosition);
        var trianglCompletion = this.goDownToNext2(newPosition.x,newPosition.y);
        if(trianglCompletion != undefined  && trianglCompletion.name == symbol.name){
          this.exploredSet.add({ x: trianglCompletion.x, y: trianglCompletion.y });
          i++;
        }
        else{
          break;
        }
      }else{
        break;
      }
    }
  
    this.calculeScore();
  }

  goDownToNext(x : number, y: number){
    if(x < 26){
      var nextSymbol = this.reels[x +1][y];
      return nextSymbol;
    }
    return;
  }
  goUpToNext(x : number, y: number){
    if(x >23){
      var nextSymbol = this.reels[x - 1][y+1];
      return nextSymbol;
    }
    return;
  }

  goDownToNext2(x : number, y: number){
    if(x < 26){
      var nextSymbol = this.reels[x + 1][y +1];
      return nextSymbol;
    }
    return;
  }
  goUpToNext2(x : number, y: number){
    if(x >23){
      var nextSymbol = this.reels[x - 1][y];
      return nextSymbol;
    }
    return;
  }
  

  goRight(x: number, y: number) {
    if(y < 4){
      var currentSymbol = this.reels[x][y];
      var nextSymbol = this.reels[x][y + 1];
      if(currentSymbol.name == nextSymbol.name){
        const newPosition = { x: x, y: y + 1 }
        this.exploredSet.add(newPosition);
      }
    }
  }

  searchOneDiagonalDown(xCurrentPosition: number, yCurrentPosition: number){
    var nextSymbolDiagonalDown = this.reels[xCurrentPosition][yCurrentPosition];
    return nextSymbolDiagonalDown;
  }
  searchOneDiagonalUp(xCurrentPosition: number, yCurrentPosition: number){
    var nextSymbolDiagonalDown = this.reels[xCurrentPosition][yCurrentPosition];
    return nextSymbolDiagonalDown;
  }

  searchDiagonalUp(xCurrentPosition:number, yCurrentPosition: number) {
    var currentSymbol = this.reels[xCurrentPosition][0];
    var nextSymbolUp;
    if(yCurrentPosition != 4){
      if(xCurrentPosition != 23){
        nextSymbolUp = this.reels[xCurrentPosition - 1][yCurrentPosition];
        if(currentSymbol.name == nextSymbolUp.name){
         this.exploredSet.add({ x: nextSymbolUp.x, y: nextSymbolUp.y });
         return true;
       }
       else{
         return false;
       }
     }
     return false; 
    }
    else{
      var symbolDown = this.searchOneDiagonalDown(xCurrentPosition, yCurrentPosition);
      var symbolUp = this.searchOneDiagonalUp(xCurrentPosition - 2, yCurrentPosition);

      if(symbolDown.name == currentSymbol.name){
        this.exploredSet.add({ x: symbolDown.x, y: symbolDown.y });
      }
      if(symbolUp.name == currentSymbol.name){
        this.exploredSet.add({ x: symbolUp.x, y: symbolUp.y });
      }

      return false;
    }
          
  }

  searchDiagonalDown(xCurrentPosition:number, yCurrentPosition: number) {
    var currentSymbol = this.reels[xCurrentPosition][0];
    var nextSymbolDown;
    if(yCurrentPosition != 4){
      if(xCurrentPosition != 26){
        nextSymbolDown = this.reels[xCurrentPosition + 1][yCurrentPosition];
        if(currentSymbol.name == nextSymbolDown.name){
         this.exploredSet.add({ x: nextSymbolDown.x, y: nextSymbolDown.y });
         return true;
       }
       else{
         return false;
       }
     }
     return false;     
    }
    else{
      var symbolDown = this.searchOneDiagonalDown(xCurrentPosition, yCurrentPosition);
      var symbolUp = this.searchOneDiagonalUp(xCurrentPosition + 2, yCurrentPosition);

      if(symbolDown.name == currentSymbol.name){
        this.exploredSet.add({ x: symbolDown.x, y: symbolDown.y });
      }
      if(symbolUp.name == currentSymbol.name){
        this.exploredSet.add({ x: symbolUp.x, y: symbolUp.y });
      }

      return false;
    }
     
  }

  

  async verifyRowDiagonalUp(x : number){
    
    this.exploredSet.clear();
    const currentPosition = { x: x, y: 0 }
    this.exploredSet.add(currentPosition);
    var symbol = this.reels[x][0];
    for(let i = 1; i <= 4; i++){
      
      var result = this.searchDiagonalUp(x,i);
      if (!result) {
        // If both searches return false, break the loop
        break;
      }
      
      console.log(this.exploredSet)
    }
   
    this.calculeScore()
    
  }

  async verifyRowDiagonalDown(x : number){
    
    this.exploredSet.clear();
    const currentPosition = { x: x, y: 0 }
    this.exploredSet.add(currentPosition);
    var symbol = this.reels[x][0];
    for(let i = 1; i <= 4; i++){
      
      var result = this.searchDiagonalDown(x,i);
      if (!result) {
        // If both searches return false, break the loop
        break;
      }
      
      console.log(this.exploredSet)
    }
   
    this.calculeScore()
    
  }

  calculeScore(){
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


   

  isBounded(x: number, y: number): boolean {
    return x >= 23 && x <= 26 && y >= 0 && y <= 4;
  }

  async spinColumn(columnIndex: number) {


    // Spin the symbols in the current column
    for (let i = 0; i < this.reels.length; i++) {
      this.reels[i][columnIndex] = this.getRandomSymbol(); // Update symbol
    }

    for(let i = 0; i < this.reels.length; i++){
      this.reels[i][columnIndex].x = i;
      this.reels[i][columnIndex].y = columnIndex;

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

  getRandomSymbol(): Symbols {
    const index = Math.floor(Math.random() * this.symbolList.length);
    var symbolInfo = this.symbolList[index];
    var newSymbol = new Symbols(symbolInfo.id, symbolInfo.name, symbolInfo.image)
    return newSymbol;
  }

  generateGrid(rows: number, columns: number): Symbols[][] {
    const grid: Symbols[][] = [];
    for (let i = 0; i < rows; i++) {
      grid[i] = [];
      for (let j = 0; j < columns; j++) {
        var symbol = this.getRandomSymbol();
        symbol.x = i;
        symbol.y = j;
        grid[i][j] = symbol;
        
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
