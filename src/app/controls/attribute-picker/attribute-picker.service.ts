import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  catchError,
  delay,
  Observable,
  of,
  Subject,
  switchMap,
  tap,
} from 'rxjs';

export interface AttributeDto {
  id: string;
  name: string;
}

export interface AttributePickerItem {
  id: string;
  name: string;
  selected: boolean;
}

export interface AttributePickerState {
  isLoading: boolean;
  attributes: AttributePickerItem[];
  error: string | null;
}

const NO_ATTRIBUTE = { id: '', name: '- Kein Attribut -', selected: true };

@Injectable({
  providedIn: 'root',
})
export class AttributePickerService {
  attributesUrl = 'http://localhost:5064/api/customer/allattributes';

  http = inject(HttpClient);

  // State
  private state = signal<AttributePickerState>({
    isLoading: false,
    attributes: [],
    error: null,
  });

  // Selectors
  isLoading = computed(() => this.state().isLoading);
  attributes = computed(() => this.state().attributes);
  error = computed(() => this.state().error);
  selection = computed(() =>
    this.state()
      .attributes.filter((a) => a.selected)
      .map((a) => a.name)
      .join(', ')
  );
  all = computed(() => this.state().attributes.every((a) => a.selected));
  none = computed(() =>
    this.state().attributes.every(
      (a) => a.id === NO_ATTRIBUTE.id || !a.selected
    )
  );

  private loadedAttributesSubject = new Subject<void>();
  private loadedAttributes$ = this.loadedAttributesSubject.asObservable();

  constructor() {
    this.loadedAttributes$
      .pipe(
        tap(() => this.setLoadingIndicator(true)),
        switchMap(() => this.loadAttributesFromServer()),
        takeUntilDestroyed()
      )
      .subscribe((attributes) => this.setAttributes(attributes));
  }

  private setLoadingIndicator(isLoading: boolean) {
    this.state.update((state) => ({ ...state, isLoading }));
  }

  private setError(err: HttpErrorResponse): Observable<AttributeDto[]> {
    this.state.update((state) => ({
      ...state,
      isLoading: false,
      error: setErrorMessage(err),
    }));
    return of([]);
  }

  private setAttributes(atts: AttributeDto[]) {
    this.state.update((state) => ({
      ...state,
      attributes: [
        NO_ATTRIBUTE,
        ...atts.map((a) => ({ id: a.id, name: a.name, selected: true })),
      ],
      isLoading: false,
    }));
  }

  private loadAttributesFromServer() {
    return this.http
      .get<AttributeDto[]>(this.attributesUrl)
      .pipe(catchError((err) => this.setError(err)));
  }

  loadAttributes() {
    this.loadedAttributesSubject.next();
  }

  selectAttribute(attributeId: string, selected: boolean) {
    this.state.update((state) => {
      const none =
        selected || attributeId === NO_ATTRIBUTE.id
          ? false
          : state.attributes.every((a) =>
              a.id == attributeId ? selected : !a.selected
            );
      console.log('none', none);
      return {
        ...state,
        attributes: state.attributes.map((a) =>
          a.id === NO_ATTRIBUTE.id && none
            ? { ...a, selected: true }
            : a.id === attributeId
            ? { ...a, selected }
            : a
        ),
      };
    });
  }

  selectAll() {
    this.state.update((state) => ({
      ...state,
      attributes: state.attributes.map((a) => ({ ...a, selected: true })),
    }));
  }

  selectNone() {
    this.state.update((state) => ({
      ...state,
      attributes: state.attributes.map((a) => ({
        ...a,
        selected: a.id === NO_ATTRIBUTE.id,
      })),
    }));
  }
}

export function setErrorMessage(err: HttpErrorResponse): string {
  let errorMessage: string;
  if (err.error instanceof ErrorEvent) {
    errorMessage = `An error occurred: ${err.error.message}`;
  } else {
    errorMessage = `Server returned code ${err.status}, error message is: ${err.message}`;
  }
  return errorMessage;
}
