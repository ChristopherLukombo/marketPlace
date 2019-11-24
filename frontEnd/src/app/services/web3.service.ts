import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { environment } from '../../environments/environment';

declare var require: any;
const Web3 = require('web3');

@Injectable()
export class Web3Service {

  public web3: any;

  private resourceUrl = environment.serverUrl;

  constructor() {
    this.checkAndInstantiateWeb3();
  }

  checkAndInstantiateWeb3 = () => {
    this.web3 = new Web3(
      new Web3.providers.HttpProvider(this.resourceUrl)
    );
  }

  getAccounts(): Observable<any> {
    return new Observable((observer: Observer<any>) => {
      this.web3.eth.getAccounts((error: string, accs) => {
        if (null != error) {
          observer.error('There was an error fetching your accounts.');
        }

        if (0 === accs.length) {
          observer.error('Couldn\'t get any accounts! Make sure your Ethereum client is configured correctly.');
        }

        observer.next(accs);
        observer.complete();
      });
    });
  }

}
