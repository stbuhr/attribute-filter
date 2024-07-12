import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AttributePickerComponent } from './controls/attribute-picker/attribute-picker.component';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { CustomerInfo, CustomerService } from './services/customer.service';

@Component({
  selector: 'kode-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    AttributePickerComponent,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  customerService = inject(CustomerService);

  customers = signal<CustomerInfo[]>([]);

  selectedAttributesChanged($event: string[]) {
    console.log('Selected attributes changed:', $event);

    // Load data based on selected attributes
    this.customerService.getCustomersByAttribute($event).subscribe((data) => {
      this.customers.set(data.data);
    });
  }
}
