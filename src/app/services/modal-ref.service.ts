export class ModalRef<T = any> {
  constructor(private closeFn: (result?: T) => void) {}

  close(result?: T) {
    this.closeFn(result);
  }
}