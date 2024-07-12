import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  output,
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
  providers: [AttributePickerService],
  templateUrl: './attribute-picker.component.html',
  styleUrl: './attribute-picker.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AttributePickerComponent {
  attributePickerService = inject(AttributePickerService);

  change = output<string[]>();

  popupIsOpen = signal(false);

  selection = this.attributePickerService.selection;
  isLoading = this.attributePickerService.isLoading;
  attributes = this.attributePickerService.attributes;
  all = this.attributePickerService.all;
  none = this.attributePickerService.none;

  lastAttributeIds: string[] = [];

  constructor() {
    this.attributePickerService.loadAttributes();

    effect(() => {
      if (this.attributeIdsHaveChanged(this.attributes().map((a) => a.id))) {
        this.emitChange();
      }
    });
  }

  attributeIdsHaveChanged(attributeIds: string[]): boolean {
    if (attributeIds.length !== this.lastAttributeIds.length) {
      this.lastAttributeIds = attributeIds;
      return true;
    }

    for (let i = 0; i < attributeIds.length; i++) {
      if (attributeIds[i] !== this.lastAttributeIds[i]) {
        this.lastAttributeIds = attributeIds;
        return true;
      }
    }

    return false;
  }

  openPopup() {
    this.popupIsOpen.set(true);
  }

  closePopup() {
    this.popupIsOpen.set(false);
    this.emitChange();
  }

  selectionChanged(attributeId: string, checked: boolean) {
    this.attributePickerService.selectAttribute(attributeId, checked);
  }

  selectAll() {
    this.attributePickerService.selectAll();
  }

  selectNone() {
    this.attributePickerService.selectNone();
  }

  emitChange() {
    this.change.emit(
      this.attributePickerService
        .attributes()
        .filter((a) => a.selected)
        .map((a) => a.id)
    );
  }
}
