import { Component, NgZone, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NGXLogger } from 'ngx-logger';
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
    private logger: NGXLogger,
    private web3Service: Web3Service,
    private ngZone: NgZone
  ) { }

  ngOnInit() {
    this.onReady();
  }

  private onReady() {
    this.web3Service.getAccounts()
      .subscribe(data => {
        this.from = data[0];
        this.ngZone.run(() =>
          this.refreshBalance()
        );
      }, error => {
        this.logger.error(error);
      });
  }

  private refreshBalance() {
    this.web3Service.getAccountInfo()
      .subscribe(data => {
        this.balance = data.balance;
      }, error => {
        this.logger.error(error);
      });

    this.web3Service.balance
      .subscribe(value => {
        this.balance = value;
      });
  }
}
