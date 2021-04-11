import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {CONSTANST} from '~utils/constanst';
import {Product} from '~app/models/product';
import {Response} from '~app/models/response';

import {Observable} from 'rxjs';

@Injectable()
export class ProductService {
  loading = true;

  constructor(
    private http: HttpClient,
  ) {
  }


  getList(pageSize: number, lastElement: string): Observable<Product[]> {
    const params = new HttpParams().set('startkey', lastElement);
    const res = this.http.get<Product[]>(
      CONSTANST.routes.product.list + '/' + pageSize, {params: params});
    return res;
  }


  getByCategory(category: string): Observable<Product[]> {
    const params = new HttpParams().set('categoryId', category);
    const res = this.http.get<Product[]>(
      CONSTANST.routes.product.category,
      {params: params}
    );
    return res;
  }

  delete(id: string): Observable<Response> {
    return this.http.delete<Response>(
      CONSTANST.routes.product.delete.replace(':id', id)
    );
  }

  getOne(id: string): Observable<Product> {
    const params = new HttpParams().set('productId', id);
    return this.http.get<Product>(
      CONSTANST.routes.product.get, {params: params});
  }

  save(product: Product): Observable<Response> {
    return this.http.post<Response>(
      CONSTANST.routes.product.save,
      product
    );
  }

  update(product: Product): Observable<Response> {
    const params = new HttpParams().set('productId', product.productId);
    return this.http.put<Response>(
      CONSTANST.routes.product.update,
      product, {params: params});
  }

  search(label: string): Observable<Response> {
    const params = new HttpParams().set('label', label);
    return this.http.get<Response>(
      CONSTANST.routes.product.search, {params: params});
  }
}
