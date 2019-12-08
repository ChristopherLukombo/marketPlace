import { Component, OnInit, NgZone } from '@angular/core';
import { ContractService } from '../services/contract.service';
import { Web3Service } from '../services/web3.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  balance: number;
  from: string;

  constructor(
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
    }, error => alert(error));

    this.web3Service.balance.subscribe(value => {
      this.balance = value;
    });
  }
}
