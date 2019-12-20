import { Injectable } from '@angular/core';
import { Observable, Observer, BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';

declare let require: any;
const Web3 = require('web3');
declare let window: any;

@Injectable()
export class Web3Service {

  public web3: any;

  private resourceUrl = environment.serverUrl;

  public balance: BehaviorSubject<number> = new BehaviorSubject<number>(0);

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

  getAccountInfo() {
    return new Observable((observer: Observer<any>) => {
      this.web3.eth.getCoinbase((err: string, account: string) => {
        if (err === null) {
          this.web3.eth.getBalance(account, (err: string, balance) => {
            if (err === null) {
              observer.next({ fromAccount: account, balance : window.web3.toWei(balance, 'ether') });
              observer.complete();
            } else {
              observer.error('error');
            }
          });
        }
      });
    });
  }

}
