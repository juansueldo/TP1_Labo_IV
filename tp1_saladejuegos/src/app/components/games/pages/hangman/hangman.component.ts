import { Component, OnInit } from '@angular/core';
import { Results } from 'src/app/models/results.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { ResultsService } from 'src/app/services/results.service';
import { worlds } from 'src/app/models/worlds.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-hangman',
  templateUrl: './hangman.component.html',
  styleUrls: ['./hangman.component.scss']
})

export class HangmanComponent {
  letters:string[]=[];
  lettersUsed : string[]=[];
  worldList:string[] = worlds;
  maxErrors:number = 0;  
  worldRandom:string = '';
  worldSelected:string[]=[];
  codedWorld:string='';
  countLetter:number = 0;
  points : number = 0;
  times : number = 0;
  usuario : any;
  resultGame !: Results;
  head: string;
  bodyUp: string;
  bodyDown: string;
  legLeft: string;
  legRight: string;
  handLeft: string;
  handRight: string;
  
  constructor(private resServ : ResultsService,private auth : FirebaseService) {
    this.auth.getUserLogged().subscribe(
      user=>{
        console.log(user);
        this.usuario = user;
      }
    )
    
  }

  ngOnInit(): void {
    this.loadGame();
  }

  loadLetters(){
    this.letters = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","Ñ","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
    this.lettersUsed = [];
  }

  loadGame(){
    
    this.loadLetters();
    this.maxErrors = 6;
    const index = Math.floor(Math.random() * (this.worldList.length -1));
    
    this.worldRandom = this.worldList[index];
    this.countLetter = this.worldRandom.length;
    for (let i = 0; i < this.worldRandom.length; i++) {
      this.worldSelected.push('_')
    }
    this.codedWorld = this.worldSelected.join(' ');
    setTimeout(()=>{
      this.head = "";
    this.bodyUp= "";
    this.bodyDown= "";
    this.legLeft= "";
    this.legRight= "";
    this.handLeft= "";
    this.handRight= "";
    },1500);
  }

  verifyLetter(letter:string){
    this.lettersUsed.push(letter);
    this.letters = this.letters.filter(item => item !== letter);
    if(this.worldRandom.includes(letter)){
      for (let i = 0; i < this.worldRandom.length; i++) {
        if(this.worldRandom[i] == letter){
          this.worldSelected[i] = letter;
          this.countLetter--;
        }
      } 
      this.codedWorld = this.worldSelected.join(' ');     
    }else{
      this.maxErrors--;
      this.draw(this.maxErrors);
    }
    
    if(this.countLetter == 0)  this.winner();
    if(this.maxErrors == 0)  this.loser();
  }
  draw(error: number){
    switch(error){
      case 0:
        this.legLeft = "../../../../../assets/hangman/leght-left.png"
        break;
      case 1:
        this.legRight = "../../../../../assets/hangman/leght-right.png"
        break;
      case 2:
        this.handLeft = "../../../../../assets/hangman/hand-left.png"
        break;
      case 3:
        this.handRight = "../../../../../assets/hangman/hand-right.png"
        break;
      case 4:
        this.bodyUp = "../../../../../assets/hangman/camisa.png";
        this.bodyDown= "../../../../../assets/hangman/jersey.png";
        break;
      case 5:
        this.head = "../../../../../assets/hangman/head.png";
        break;
    }
  }
  loser(){
    this.times++;
    this.points -=1;
    if(this.points < 0) this.points = 0;
    Swal.fire({
      title: 'Perdiste, la palabra era: '+this.worldRandom+'\n <hr>',
      text: 'Querés seguir jugando?',
      icon: 'error',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Si',
      cancelButtonColor: '#d33',
      showCancelButton: true,
      cancelButtonText: 'No',
      background: '#7c1ca4',
      color: '#fff'
    }).then((result) => {
      if (!result.isConfirmed) {
        this.saveResults();
      }
    })
    this.worldRandom = '';
    this.worldSelected=[];
    this.codedWorld='';    
    this.countLetter = 0;
    this.loadGame();
  }
  winner(){
    this.times++;
    this.points += 3;
    Swal.fire({
      title: 'Ganaste!! La palabra era: '+this.worldRandom+'\n <hr>',
      text: 'Querés seguir jugando?',
      icon: 'success',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Si',
      cancelButtonColor: '#d33',      
      showCancelButton: true,
      cancelButtonText: 'No',
      background: '#7c1ca4',
      color: '#fff'
    }).then((result) => {
      if (!result.isConfirmed) {
        this.saveResults();
      }
    });
    this.worldRandom = '';
    this.worldSelected=[];
    this.codedWorld='';    
    this.countLetter = 0;
    this.loadGame();
  }

  saveResults(){
    let date = new Date();
    let dateString = date.toString();
    this.resultGame = {
      uid: this.usuario.uid,
      mail: this.usuario.email,
      date: dateString,
      game: 'Ahorcado',
      points: this.points,
      rounds: this.times
    }
    this.resServ.saveResults(this.resultGame);
  }
  
}
