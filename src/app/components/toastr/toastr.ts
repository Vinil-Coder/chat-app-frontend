import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppStateService } from '../../services/appstate.service';

@Component({
  selector: 'app-toastr',
  imports: [CommonModule],
  templateUrl: './toastr.html',
  styleUrl: './toastr.scss',
})
export class Toastr {

  app = inject(AppStateService);
}
