import { Injectable, Type } from '@angular/core';
import { ModalHost } from '../components/modal-host/modal-host';
import { ModalRef } from './modal-ref.service';

@Injectable({ providedIn: 'root' })
export class ModalService {

  private host!: ModalHost;
  private resolver!: (value: any) => void;

  register(host: ModalHost) {
    this.host = host;
  }

  open<T, R = any>(component: Type<T>, data?: any): Promise<R> {

    return new Promise<R>((resolve) => {
      this.resolver = resolve;

      const modalRef = new ModalRef<R>((result?: R) => {
        this.host.detach();
        resolve(result as R);
      });

      this.host.attachComponent(component, {
        ...data,
        modalRef
      });
    });
  }

  close(result?: any) {
    this.host.detach();
    this.resolver?.(result);
  }
}