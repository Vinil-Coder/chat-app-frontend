import { Component, signal } from '@angular/core';
import { ModalService } from '../../services/modal.service';
import { WorkspaceModalComponent } from '../../components/workspace-modal/workspace-modal';
import { MemberModal } from '../../components/member-modal/member-modal';
import { CommonModule } from '@angular/common';
import { WorkSpaceService } from '../../services/workspace.service';
import { Workspace } from '../../interfaces/workspace.interface';
import { AppUiStateService, ToastrType } from '../../services/ui-state.service';
import { User } from '../../interfaces/user.interface';

@Component({
  selector: 'app-workspaces',
  templateUrl: './workspaces.html',
  styleUrl: './workspaces.scss',
  imports: [CommonModule],
})
export class Workspaces {

  workspaces = signal<Workspace[]>([]);
  members = signal([]);

  selectedWorkspace = signal<Workspace>({} as Workspace);
  selectedWorkspaceMembers = signal([]);

  constructor(
    private modal: ModalService,
    private workspaceService: WorkSpaceService,
    public appUiStateService: AppUiStateService
  ) { }

  ngOnInit() {
    this.getWorkSpaces();
  }

  async getWorkSpaces() {
    try {
      this.appUiStateService.startLoader();

      const res = await this.workspaceService.getWorkspaces();

      this.workspaces.set(res.workspaces || []);

    } catch (err: any) {
      this.appUiStateService.showToastr(
        err.error?.message || 'Failed to get workspaces',
        ToastrType.ERROR
      );
    } finally {
      this.appUiStateService.stopLoader();
    }
  }

  async createWorkspace() {
    try {
      const result = await this.modal.open(WorkspaceModalComponent, {
        mode: 'create'
      });

      if (result) {
        this.appUiStateService.startLoader();

        const res = await this.workspaceService.createWorkspace(result);

        this.workspaces.set([
          ...this.workspaces(),
          res.workspace
        ]);

         this.appUiStateService.showToastr(
          res.message || 'Workspace created successfully',
          ToastrType.SUCCESS
        );

      }
    } catch (err: any) {
      this.appUiStateService.showToastr(
        err.error?.message || 'Failed to create workspace',
        ToastrType.ERROR
      );
    } finally {
      this.appUiStateService.stopLoader();
    }
  }

  async editWorkspace(workspace: Workspace) {
    try {

      const result = await this.modal.open(WorkspaceModalComponent, {
        mode: 'edit',
        formData: workspace
      });

      if (!result) return;

      this.appUiStateService.startLoader();

      const res = await this.workspaceService.updateWorkspace(workspace._id, result);

      this.getWorkSpaces();

      this.appUiStateService.showToastr(
        res.message || 'Workspace updated successfully',
        ToastrType.SUCCESS
      );

    } catch (err: any) {
      this.appUiStateService.showToastr(
        err.error?.message || 'Failed to update workspace',
        ToastrType.ERROR
      );
    } finally {
      this.appUiStateService.stopLoader();
    }
  }

  async deleteWorkspace(workspace: Workspace) {
    try {

      const result = await this.modal.open(WorkspaceModalComponent, {
        mode: 'delete',
        formData: workspace
      });

      if (!result) return;

      this.appUiStateService.startLoader();

      const res = await this.workspaceService.deleteWorkspace(workspace._id);

      this.workspaces.set(
        this.workspaces().filter(w => w._id !== workspace._id)
      );

       this.appUiStateService.showToastr(
        res.message || 'Workspace deleted successfully',
        ToastrType.SUCCESS
      );

    } catch (err: any) {
      this.appUiStateService.showToastr(
        err.error?.message || 'Failed to delete workspace',
        ToastrType.ERROR
      );
    } finally {
      this.appUiStateService.stopLoader();
    }
  }
}
