import {Injectable} from '@angular/core';
import {Image} from '~models/image';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';


@Injectable()
export class ImageService {
  baseUrl = 'https://gocyubtzwf.execute-api.eu-west-3.amazonaws.com/prod';

  constructor(
    private http: HttpClient,
  ) {
  }

  uploadImage(image: Image): Observable<any> {
    return this.http.post<any>(this.baseUrl + '/upload-image', image);
  }

  fetchAndUploadImage(url: string, fileName: string) {
    return this.http.post<any>(this.baseUrl + '/fetchupload-image', {'image_url': url, fileName});
  }
}
