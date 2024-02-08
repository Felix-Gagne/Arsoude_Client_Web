import { Component } from '@angular/core';

@Component({
  selector: 'app-help-page',
  templateUrl: './help-page.component.html',
  styleUrls: ['./help-page.component.css']
})
export class HelpPageComponent {
  // ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
  // Variables pour le fonctionnement du jeu
  // ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀
  jeuActif : boolean = false;
  slots = [
    ["felix", "mathieu", "maxime", "po", "simeon", "vlad"],
    ["po", "vlad", "maxime", "mathieu", "felix", "simeon"],
    ["maxime", "simeon", "felix", "vlad", "po", "mathieu"]
  ];
  intervals : any[] = [];

  ngOnInit(){
    this.setSlotImages();
  }

  // ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
  // Lancer le jeu avec le bouton jouer
  // ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀
  jouer(){
    this.jeuActif = true;
    this.startSlots();
  }

  // ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
  // Mettre fin au jeu avec le bouton stop
  // ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀
  stop(){
    let n1 = 300 + Math.floor(Math.random() * 1200);
    let n2 = 300 + Math.floor(Math.random() * 1200);
    let n3 = 300 + Math.floor(Math.random() * 1200);

    setTimeout(this.stopSlot.bind(this), n1, 1);
    setTimeout(this.stopSlot.bind(this), n2, 2);
    setTimeout(this.stopSlot.bind(this), n3, 3);
    setTimeout(this.end.bind(this), Math.max(n1, n2, n3) + 250);
  }

  // ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
  // Démarrer les trois roulettes
  // ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀
  startSlots(){
    let n1 = 150 + Math.floor(Math.random() * 100);
    let n2 = 150 + Math.floor(Math.random() * 100);
    let n3 = 150 + Math.floor(Math.random() * 100);

    this.intervals[0] = setInterval(this.scrambleSlots.bind(this), n1, 1);
    this.intervals[1] = setInterval(this.scrambleSlots.bind(this), n2, 2);
    this.intervals[2] = setInterval(this.scrambleSlots.bind(this), n3, 3);
  }

  // ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
  // Vérifier si le joueur a gagné
  // ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀
  end(){
    this.jeuActif = false;
    if(this.slots[0][2] == this.slots[1][2] && this.slots[1][2] == this.slots[2][2]){

      // ▄▀▄▀▄ Personnaliser le code pour la victoire ici ▄▀▄▀▄
      alert("Victoire");

    }
    else{

      // ▄▀▄▀▄ Personnaliser le code pour la défaite ici ▄▀▄▀▄
      alert("Perdu !");

    }
  }

  // ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
  // Afficher les images
  // ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀
  setSlotImages(){
    for(let i = 1; i < 6; i++){
      for(let j = 1; j < 4; j++){
        document.querySelector("#col" + j + "row" + i)?.setAttribute("src", "/assets/images/" + this.slots[j - 1][i - 1] + ".png");
      }
    }
  }

  // ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
  // Arrêter une des trois roulettes
  // ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀
  stopSlot(colNum : number){
    clearInterval(this.intervals[colNum - 1]);
  }

  // ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
  // Faire tourner une roulette
  // ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀
  scrambleSlots(colNum : number){
    let firstImg = this.slots[colNum - 1][0];
    this.slots[colNum - 1].splice(0, 1);
    this.slots[colNum - 1].push(firstImg);
    for(let i = 1; i < 6; i++){
      document.querySelector("#col" + colNum + "row" + i)?.setAttribute("src", "/assets/images/" + this.slots[colNum - 1][i - 1] + ".png");
    }
  }
}
