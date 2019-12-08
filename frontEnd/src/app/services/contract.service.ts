import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import contract from 'truffle-contract';
import { Web3Service } from './web3.service';
import { House } from 'src/model/house';

declare let window: any;

declare let require: any;
const tokenAbi = require('../../../../backEnd/build/contracts/MarketplaceEngine.json');

@Injectable({
  providedIn: 'root'
})
export class ContractService {

  MetaCoin = contract(tokenAbi);

  constructor(private web3Service: Web3Service) {
    this.MetaCoin.setProvider(web3Service.web3.currentProvider);
  }

  addHouse(house: House, from: string): Observable<any> {
    return new Observable((observer: Observer<any>) => {
      this.MetaCoin
        .deployed()
        .then(instance => {
          return instance.addHouse(
            house.title,
            house.addressHouse,
            house.price,
            house.surface,
            house.description,
            house.roomCount,
            house.creationDate,
            house.owner,
            { from });
        }).then(data => {
          observer.next(data);
        }).catch(error => {
          observer.error(error);
        });
    });
  }

  buyHouse(from: string, house: House): Observable<any> {
    return new Observable((observer: Observer<any>) => {
      this.MetaCoin
        .deployed()
        .then(instance => {
          return instance.buyHouse(
            house.idHouse,
            {
              from,
              value: window.web3.toWei(house.price, 'ether')
            });
        }).then(data => {
          observer.next(data);
        }).catch(error => {
          observer.error(error);
        });
    });
  }

  getHouseInfo(_idHouse: number, from: string) {
    return new Observable((observer: Observer<any>) => {
      this.MetaCoin
        .deployed()
        .then(instance => {
          return instance.getHouseInfo(
            _idHouse, {
            from
          });
        })
        .then(data => {
          observer.next(data);
        }).catch(error => {
          observer.error(error);
        });
    });
  }

  getSaleHouses(from: string) {
    return new Observable((observer: Observer<any>) => {
      this.MetaCoin
        .deployed()
        .then(instance => {
          return instance.getSaleHouses({ from });
        }).then(data => {
          observer.next(data);
        }).catch(error => {
          observer.error(error);
        });
    });
  }

}
