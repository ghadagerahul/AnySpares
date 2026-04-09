import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent, MatDialogActions, MatDialogTitle } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

export interface DialogData {
  title: string;
  message: string;
  confirmBtnText?: string;
  cancelBtnText?: string;
}

@Component({
  selector: 'app-confirm-dialog-component',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatDialogContent, MatDialogActions, MatDialogTitle],
  templateUrl: './confirm-dialog-component.html',
  styleUrl: './confirm-dialog-component.css',
})
export class ConfirmDialogComponent {
  confirmBtnText: string;
  cancelBtnText: string;

  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.confirmBtnText = data.confirmBtnText || 'Confirm';
    this.cancelBtnText = data.cancelBtnText || 'Cancel';
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}