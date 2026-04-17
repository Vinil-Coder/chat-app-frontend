import { Component, OnInit, signal } from '@angular/core';
import { AppStateService } from '../../services/appstate.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile implements OnInit {

  user = signal<any | null>(null);
  isOnline = true;
  isDarkMode = false;
  showChangePassword = false;
  password = {
    current: '',
    new: ''
  };



  constructor(public appState: AppStateService) {

  }

  ngOnInit() {
    this.user.set(this.appState.getUser());
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    document.body.classList.toggle('dark');
  }


  onImageUpload(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        // update signal/user state here
      };
      reader.readAsDataURL(file);
    }
  }
}
