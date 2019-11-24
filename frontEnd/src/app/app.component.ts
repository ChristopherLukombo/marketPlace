import { Component, NgZone, OnInit } from '@angular/core';
import { ContractService } from './services/contract.service';
import { Web3Service } from './services/web3.service';

declare var window: any;
export interface Section {
  name: string;
  updated: Date;
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  account: any;
  accounts: any;

  balance: number;
  sendingAmount: number;
  recipientAddress: string;
  status: string;

  constructor(
    private ngZone: NgZone,
    private web3Service: Web3Service,
    private contract: ContractService,
  ) {}

  ngOnInit(): void {
    this.onReady();
  }

  onReady() {
    this.web3Service.getAccounts().subscribe(accs => {
      this.accounts = accs;
      this.account = this.accounts[0];

      this.ngZone.run(() =>
        this.refreshBalance()
      );
    }, error => alert(error));
  }

  refreshBalance() {
    this.contract.getBalance(this.account)
      .subscribe(value => {
        this.balance = value;
        alert(value);
      }, error => { this.setStatus('Error getting balance; see log.'); });
  }

  setStatus(message: string) {
    this.status = message;
  }

  sendCoin() {
    this.setStatus('Initiating transaction... (please wait)');

    this.contract.sendCoin(this.account, this.recipientAddress, this.sendingAmount)
      .subscribe(() => {
        this.setStatus('Transaction complete!');
        this.refreshBalance();
      }, error => this.setStatus('Error sending coin; see log.'));
  }

}
