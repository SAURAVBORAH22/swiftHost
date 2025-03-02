import { Component, Input } from '@angular/core';

@Component({
  selector: 'file-viewer',
  templateUrl: './file-viewer.component.html',
  styleUrls: ['./file-viewer.component.css']
})
export class FileViewerComponent {
  @Input() file!: File;
  isOpen = false;
  fileUrl!: string;

  openModal(): void {
    if (this.file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.fileUrl = reader.result as string;
        this.isOpen = true;
      };
      reader.readAsDataURL(this.file);
    }
  }

  closeModal(): void {
    this.isOpen = false;
  }
}
