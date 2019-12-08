import { Component, OnInit } from '@angular/core';
import { House } from 'src/model/house';
import { ContractService } from '../services/contract.service';
import { Web3Service } from '../services/web3.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-house-info',
  templateUrl: './house-info.component.html',
  styleUrls: ['./house-info.component.scss']
})
export class HouseInfoComponent implements OnInit {

  house: any;

  from: string;

  constructor(
    private contractService: ContractService,
    private web3Service: Web3Service,
    private route: ActivatedRoute
  ) { }


  ngOnInit() {
    this.onReady();
  }

  private onReady() {
    this.web3Service.getAccounts().subscribe(data => {
      this.from = data[0];
      this.getHouse();
    }, error => {
      this.house = null;
    });
  }

  private getHouse() {
    const idHouse = Number(this.route.snapshot.paramMap.get('idHouse'));
    this.getHouseInfo(idHouse, this.from);
  }

  private getHouseInfo(_idHouse: number, account: string) {
    this.contractService.getHouseInfo(_idHouse, account).subscribe(data => {
      this.house = data;
      this.house.creationDate = new Date(this.house.creationDate * 1000);
    }, error => console.log('error getHouseInfo', error));
  }

}
