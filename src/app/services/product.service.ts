import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
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

  headers = {
    // 'Authorization': 'JWT ' + localStorage.getItem('token')
    'Access-Control-Allow-Methods': ': GET, POST, OPTIONS, PUT, DELETE'

  };



  getList(
    // sortActive: string, order: string,
    pageSize: number, lastElement: string
    // , search: string
  ): Observable<Product[]> {
    const res = this.http.get<Product[]>(
      CONSTANST.routes.product.list + '/' + pageSize + '/' + lastElement,
      // {headers: this.headers, params: params}
    );
    return res;
  }

  delete(id: string): Observable<Response> {
    return this.http.delete<Response>(
      CONSTANST.routes.product.delete.replace(':id', id), {headers: this.headers}
    );
  }

  getOne(id: number): Observable<Response> {
    return this.http.get<Response>(
      CONSTANST.routes.product.get.replace(':id', String(id)),
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
