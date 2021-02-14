import { Product } from '~app/models/product';
import { Response } from '~app/models/response';
import { Observable } from 'rxjs';

export abstract class Provider {

  constructor() { }

  abstract getList(sortActive: string, order: string, pageSize: number, page: number, search: string): Observable<Response>;

  abstract getOne(id: number): Observable<Response>;

  abstract save(product: Product): Observable<Response>;

  abstract delete(id: number): Observable<Response>;

}
