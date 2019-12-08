import { Component, NgZone, OnInit } from '@angular/core';
import { House } from 'src/model/house';
import { ContractService } from '../services/contract.service';
import { Web3Service } from './../services/web3.service';

@Component({
  selector: 'app-houses',
  templateUrl: './houses.component.html',
  styleUrls: ['./houses.component.scss']
})
export class HousesComponent implements OnInit {

  houses: House[];

  balance: number;
  from: string;

  constructor(
    private contractService: ContractService,
    private web3Service: Web3Service,
    private ngZone: NgZone
  ) { }

  ngOnInit() {
    this.onReady();
  }

  private onReady() {
    this.web3Service.getAccounts().subscribe(data => {
      this.from = data[0];
      this.ngZone.run(() =>
        this.refreshBalance()
      );
    }, error => alert(error));
  }

  private refreshBalance() {
    this.web3Service.getAccountInfo().subscribe(data => {
      this.balance = data.balance;
      this.web3Service.balance.next(this.balance);
      this.getSaleHouses(this.from);
    }, error => alert(error));
  }


  private getSaleHouses(account) {
    this.contractService.getSaleHouses(account).subscribe(data => {
      this.houses = data;
    }, error => console.log('error', error));
  }

  public buyHouse(house: House) {
    this.contractService.buyHouse(
      this.from,
      house
    ).subscribe(data => {
      console.log(data);
      this.refreshBalance();
    }, error => console.log('error buy House', error));
  }

}
