import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AttributePickerService } from './attribute-picker.service';

@Component({
  selector: 'kode-attribute-picker',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    OverlayModule,
    MatDividerModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './attribute-picker.component.html',
  styleUrl: './attribute-picker.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AttributePickerComponent {
  attributePickerService = inject(AttributePickerService);

  popupIsOpen = signal(false);
  filterAll = signal(false);

  selection = this.attributePickerService.selection;
  isLoading = this.attributePickerService.isLoading;
  attributes = this.attributePickerService.attributes;

  constructor() {
    this.attributePickerService.loadAttributes();
  }

  openPopup() {
    this.popupIsOpen.set(true);
  }

  closePopup() {
    this.popupIsOpen.set(false);
  }

  selectionChanged(attributeId: string, checked: boolean) {
    this.attributePickerService.selectAttribute(attributeId, checked);
  }

  selectAll() {}

  selectNone() {}
}
