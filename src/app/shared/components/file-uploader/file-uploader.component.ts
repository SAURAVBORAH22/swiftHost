import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ToastService } from '../../toast.service';

@Component({
  selector: 'file-uploader',
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.css']
})
export class FileUploaderComponent {
  @Input() allowedTypes: string[] = ['image/png', 'image/jpeg', 'application/pdf', 'text/plain'];
  @Input() maxFileSize: number = 5 * 1024 * 1024; // Default: 5MB
  @Input() maxFiles: number = 5; // Default: 5 files
  @Input() allowMultiple: boolean = false;
  @Input() dropZoneClass: string = '';

  @Output() filesUploaded = new EventEmitter<File[]>();

  selectedFiles: File[] = [];
  dragging = false;

  constructor(
    private toastService: ToastService
  ) { }

  onFileSelected(event: any): void {
    this.handleFiles(event.target.files);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.dragging = false;
    if (event.dataTransfer) {
      this.handleFiles(event.dataTransfer.files);
    }
  }

  handleFiles(files: FileList): void {
    if (files.length + this.selectedFiles.length > this.maxFiles) {
      this.toastService.showToast(`You can only upload up to ${this.maxFiles} files.`, 'error');
      return;
    }

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (!this.allowedTypes.includes(file.type)) {
        this.toastService.showToast(`File type not allowed: ${file.name}`, 'error');
        continue;
      }

      if (file.size > this.maxFileSize) {
        this.toastService.showToast(`File is too large: ${file.name} (Max: ${this.maxFileSize / 1024 / 1024} MB)`, 'error');
        continue;
      }

      this.selectedFiles.push(file);
    }
  }

  removeFile(index: number): void {
    this.selectedFiles.splice(index, 1);
  }

  uploadFiles(): void {
    if (this.selectedFiles.length === 0) {
      this.toastService.showToast('Please select at least one file!', 'error');
      return;
    }

    this.filesUploaded.emit(this.selectedFiles);
  }
}
