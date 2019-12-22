import { Inject, Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { IPFS } from '../ipfs';

@Injectable({
  providedIn: 'root'
})
export class IpfsService {

  constructor(@Inject(IPFS) private ipfs) {
  }

  addFile(file): Observable<any> {
    return new Observable((observer: Observer<any>) => {
      this.ipfs.add(file)
        .then(data => {
          observer.next(data);
        }).catch(error => {
          observer.error(error);
        });
    });
  }

  getFile(hash: string): Observable<any> {
    return new Observable((observer: Observer<any>) => {
      this.ipfs.get(hash)
        .then(data => {
          observer.next(data);
        }).catch(error => {
          observer.error(error);
        });
    });
  }

}
