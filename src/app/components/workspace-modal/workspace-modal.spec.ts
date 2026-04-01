import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkspaceModalComponent } from './workspace-modal';
import { Workspaces } from '../../pages/workspaces/workspaces';

describe('WorkspaceModal', () => {
  let component: WorkspaceModalComponent;
  let fixture: ComponentFixture<WorkspaceModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Workspaces]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkspaceModalComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
