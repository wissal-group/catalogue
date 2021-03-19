import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
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

  headersdd = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  };

  headers = new HttpHeaders({
    'Authorization': 'Bearer ' + localStorage.getItem('token'),
    'Access-Control-Allow-Origin' : '*',
    'Access-Control-Allow-Headers' : 'Content-Type, Authorization',
    'Content-Type': 'application/json; charset=utf-8',
     'Access-Control-Allow-Methods': ': GET, POST, OPTIONS, PUT, DELETE',
    'Access-Control-Allow-Credentials': 'true',
  });


  getList(pageSize: number, lastElement: string): Observable<Product[]> {
    const res = this.http.get<Product[]>(
      CONSTANST.routes.product.list + '/' + pageSize + '/' + lastElement,
      {headers: this.headers}
    );
    return res;
  }


  getByCategory(category: string): Observable<Product[]> {
    const params = new HttpParams().set('categoryId', category);
    const res = this.http.get<Product[]>(
      CONSTANST.routes.product.category,
      {headers: this.headers, params: params}
    );
    return res;
  }

  delete(id: string): Observable<Response> {
    return this.http.delete<Response>(
      CONSTANST.routes.product.delete.replace(':id', id), {headers: this.headers}
    );
  }

  getOne(id: number): Observable<Product> {
    return this.http.get<Product>(
      CONSTANST.routes.product.get.replace(':id', String(id)), {headers: this.headers}
    );
  }

  save(product: Product): Observable<Response> {
    return this.http.post<Response>(
      CONSTANST.routes.product.save,
      {
        productId: product.productId,
        // todo compelete this shit

        // txtLastName: product.last_name,
        // txtAge: product.age,
        // txtGender: product.gender,
        // id: product.id
      },
      // {headers: this.headers}
    );
  }

}
