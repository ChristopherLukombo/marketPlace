import { Injectable } from '@angular/core';
import ipfs from 'ipfs';
import { Observable, Observer } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IpfsService {

  ipfs: ipfs;

  constructor() {
    this.ipfs = new ipfs();
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
