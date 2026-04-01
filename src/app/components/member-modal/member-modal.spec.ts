import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberModal } from './member-modal';

describe('MemberModal', () => {
  let component: MemberModal;
  let fixture: ComponentFixture<MemberModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MemberModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MemberModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
