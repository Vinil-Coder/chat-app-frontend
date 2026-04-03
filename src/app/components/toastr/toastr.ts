import { Component, inject } from '@angular/core';
import { AppUiStateService } from '../../services/ui-state.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-toastr',
  imports: [CommonModule],
  templateUrl: './toastr.html',
  styleUrl: './toastr.scss',
})
export class Toastr {

  appUistate = inject(AppUiStateService);
}
