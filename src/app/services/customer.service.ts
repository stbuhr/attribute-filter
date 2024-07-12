import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface CustomersFilter {
  filter: string;
  attributeIds: string[];
  sortColumn: string;
  sortOrder: string;
  pageNumber: number;
  pageSize: number;
}

export interface CustomerInfo {
  id: string;
  name: string;
  attributes: string[];
  lastLicense: Date | null;
  amountLastYear: number;
}

export interface LoadedCustomers {
  data: CustomerInfo[];
  total: number;
}

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  customersUrl = 'http://localhost:5064/api/customer/filter';

  http = inject(HttpClient);

  constructor() {}

  getCustomersByAttribute(attributeIds: string[]) {
    return this.getCustomers({
      filter: '*',
      attributeIds,
      sortColumn: 'Name',
      sortOrder: 'asc',
      pageNumber: 1,
      pageSize: 10,
    });
  }

  getCustomers(filter: CustomersFilter): Observable<LoadedCustomers> {
    return this.http.post<LoadedCustomers>(this.customersUrl, filter);
  }
}
