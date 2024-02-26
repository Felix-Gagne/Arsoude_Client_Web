import { Component, OnInit } from '@angular/core';
import { trigger, transition, style, animate, state } from '@angular/animations';

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

  constructor() {}

  ngOnInit() {
    // Generate a 10x10 grid
    this.reels = this.generateGrid(3, 5);
  }

  async spin() {
    var spinDuration = 1000; // Spin duration in milliseconds
    const startTime = Date.now();
  
    const spinPromises = [];
  
    // Start spinning all columns simultaneously
    for (let i = 0; i < this.reels[0].length; i++) {
      spinDuration += 500;
      spinPromises.push(this.spinColumn(i, startTime, spinDuration));
    }
  
    // Wait for all columns to finish spinning
    await Promise.all(spinPromises);
  }
  
  async spinColumn(columnIndex: number, startTime: number, spinDuration: number) {
    const endTime = startTime + spinDuration;
  
    while (Date.now() < endTime) {
      // Spin the symbols in the current column
      for (let i = 0; i < this.reels.length; i++) {
        await this.spinSymbol(columnIndex, i);
      }
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

  info(row: number, column: number){
    console.log(`Clicked symbol at row ${row}, column ${column}`);

  }
}
