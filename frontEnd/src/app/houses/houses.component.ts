import { Component, NgZone, OnInit } from '@angular/core';
import { House } from 'src/model/house';
import { ContractService } from '../services/contract.service';
import { Web3Service } from './../services/web3.service';

export interface PeriodicElement {
  idHouse: number;
  price: number;
  owner: string;
}

@Component({
  selector: 'app-houses',
  templateUrl: './houses.component.html',
  styleUrls: ['./houses.component.scss']
})
export class HousesComponent implements OnInit {

  houses: House[];

  balance: number;
  from: string;

  displayedColumns: string[] = ['idHouse', 'title', 'price', 'actions'];
  dataSource;

  errorMessage: string;

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
    }, error => this.errorMessage = 'Une erreur s\'est produite');
  }

  private refreshBalance() {
    this.web3Service.getAccountInfo().subscribe(data => {
      this.balance = data.balance;
      this.web3Service.balance.next(this.balance);
      this.getSaleHouses(this.from);
    }, error => this.errorMessage = 'Une erreur s\'est produite');
  }


  private getSaleHouses(account: string) {
    this.contractService.getSaleHouses(account).subscribe(data => {
      this.houses = data;
      const dataSource = [];
      data.forEach(house => {
        dataSource.push({
          idHouse: house.idHouse,
          title: house.title,
          price: house.price,
          isSold: house.isSold
        });
      });
      this.dataSource = dataSource;
    }, error => this.dataSource = []);
  }

  public buyHouse(idHouse: number, price: number) {
    const house = new House();
    house.idHouse = idHouse;
    house.price = price;
    this.contractService.buyHouse(
      this.from,
      house
    ).subscribe(data => {
      this.errorMessage = null;
      this.callBackSuccess(idHouse);
    }, error => this.errorMessage = 'Une erreur s\'est produite durant l\'achat. Vous ne disposez peut-être pas de suffisament de fond');
  }

  private callBackSuccess(idHouse: number) {
    for (const house of this.dataSource) {
      if (house.idHouse === idHouse) {
        house.isSold = true;
        break;
      }
    }
    setTimeout(() => {
       this.refreshBalance();
    }, 1000);
  }

}
