import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { GameCardsComponent } from '../game-cards/game-cards.component'; // Importa el componente del juego
import { ChatComponent } from '../chat/chat.component';
import { HangmanComponent } from '../hangman/hangman.component';
const homeRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'game', component: GameCardsComponent },  // Ruta para el componente de juego
  { path: 'chat', component: ChatComponent },
  { path: 'hangman', component: HangmanComponent },
];

@NgModule({
  imports: [RouterModule.forChild(homeRoutes)],  // Utiliza forChild() para las rutas de módulos secundarios
  exports: [RouterModule]
})
export class HomeRoutingModule { }
