import { Component, ViewChild, ViewContainerRef, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-modal-host',
  standalone: true,
  imports: [CommonModule],
  template: `<ng-template #vc></ng-template>`,
  styleUrls: ['./modal-host.scss']
})
export class ModalHost {

  @ViewChild('vc', { read: ViewContainerRef, static: true })
  vc!: ViewContainerRef;

  private closeResolver?: (value: any) => void;

  constructor(private modal: ModalService) {
    this.modal.register(this);
  }

  attachComponent(component: Type<any>, data: any) {
    this.vc.clear();

    const ref = this.vc.createComponent(component);

    Object.assign(ref.instance as any, data);
  }
  
  setCloseResolver(fn: (value: any) => void) {
    this.closeResolver = fn;
  }

  detach() {
    this.vc.clear();
  }
}