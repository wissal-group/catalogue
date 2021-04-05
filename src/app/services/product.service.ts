import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {CONSTANST} from '~utils/constanst';
import {Product} from '~app/models/product';
import {Response} from '~app/models/response';

import {Observable} from 'rxjs';
import {environment} from '~environments';

@Injectable()
export class ProductService {
  loading = true;

  constructor(
    private http: HttpClient,
  ) {
  }


  getList(pageSize: number, lastElement: string): Observable<Product[]> {
    const res = this.http.get<Product[]>(
      CONSTANST.routes.product.list + '/' + pageSize + '/' + lastElement,
    );
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

  getOne(id: number): Observable<Product> {
    return this.http.get<Product>(
      CONSTANST.routes.product.get.replace(':id', String(id)));
  }

  save(product: Product): Observable<Response> {
    return this.http.post<Response>(
      // CONSTANST.routes.product.save,
      environment.postProductUrl,
      product
    );
  }

  update(product: Product): Observable<Response> {
    return this.http.put<Response>(
      CONSTANST.routes.product.get.replace(':id', String(product.productId)),
      product);
  }

  search(label: string): Observable<Response> {
    return this.http.get<Response>(
      CONSTANST.routes.product.search.concat(label));
  }
}
