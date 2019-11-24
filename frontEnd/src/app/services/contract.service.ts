import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import contract from 'truffle-contract';
import { Web3Service } from './web3.service';

declare var require: any;
const tokenAbi = require('../../../../backEnd/build/contracts/MarketplaceEngine.json');

@Injectable({
  providedIn: 'root'
})
export class ContractService {

  MetaCoin = contract(tokenAbi);

  constructor(
    private web3Service: Web3Service,
  ) {
    this.MetaCoin.setProvider(web3Service.web3.currentProvider);
  }

  getBalance(account): Observable<number> {
    let meta;

    return Observable.create(observer => {
      this.MetaCoin
        .deployed()
        .then(instance => {
          meta = instance;
          return meta.getBalance.call(account, {
            from: account
          });
        })
        .then(value => {
          observer.next(value)
          observer.complete();
        })
        .catch(error => {
          console.log(error);
          observer.error(error);
        });
    });
  }

  sendCoin(from, to, amount): Observable<any> {
    let meta;

    return Observable.create(observer => {
      this.MetaCoin
        .deployed()
        .then(instance => {
          meta = instance;
          return meta.sendCoin(to, amount, {
            from: from
          });
        })
        .then(() => {
          observer.next();
          observer.next();
        })
        .catch(e => {
          console.log(e);
          observer.error(e);
        });
    });
  }

}
