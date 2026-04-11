import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Toastr } from './components/toastr/toastr';
import { AppStateService } from './services/appstate.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Toastr, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('chat-app-frontend');

  constructor(
     public app: AppStateService
  ) {}
}