import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Base } from '../models/base';

export abstract class BaseService<T extends Base> {
  protected readonly httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    protected readonly httpClient: HttpClient,
    protected readonly url: string,
    protected readonly endpoint: string
  ) {}

  get(): Observable<T[]> {
    return this.httpClient
      .get<T[]>(`${this.url}/${this.endpoint}`)
      .pipe(retry(2), catchError(this.handleError.bind(this)));
  }

  getById(id: number): Observable<T> {
    return this.httpClient
      .get<T>(`${this.url}/${this.endpoint}/${id}`)
      .pipe(retry(2), catchError(this.handleError.bind(this)));
  }

  create(item: T): Observable<T> {
    return this.httpClient
      .post<T>(`${this.url}/${this.endpoint}`, JSON.stringify(item), this.httpOptions)
      .pipe(retry(2), catchError(this.handleError.bind(this)));
  }

  update(item: T): Observable<T> {
    return this.httpClient
      .put<T>(`${this.url}/${this.endpoint}/${item.id}`, JSON.stringify(item), this.httpOptions)
      .pipe(retry(2), catchError(this.handleError.bind(this)));
  }

  delete(item: T): Observable<unknown> {
    return this.httpClient
      .delete<unknown>(`${this.url}/${this.endpoint}/${item.id}`, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError.bind(this)));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ocorreu um erro durante a requisição.';

    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else if (error.status) {
      errorMessage = `Código do erro: ${error.status}, mensagem: ${error.message}`;
    }

    return throwError(() => new Error(errorMessage));
  }
}
