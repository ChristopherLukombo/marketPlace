import { Component, OnInit } from '@angular/core';
import { House } from 'src/model/house';
import { ContractService } from '../services/contract.service';
import { Web3Service } from '../services/web3.service';
import { ActivatedRoute } from '@angular/router';
import { saveAs } from 'file-saver';
import { IpfsService } from '../services/ipfs.service';
import { Material } from 'src/model/model.material';

@Component({
  selector: 'app-house-info',
  templateUrl: './house-info.component.html',
  styleUrls: ['./house-info.component.scss']
})
export class HouseInfoComponent implements OnInit {

  from: string;

  house: any;
  materials: Array<Material>;

  constructor(
    private contractService: ContractService,
    private web3Service: Web3Service,
    private route: ActivatedRoute,
    private ipfsService: IpfsService
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
    this.contractService.getHouseInfo(_idHouse, account)
      .subscribe(data => {
        this.house = data;
        this.house.creationDate = new Date(this.house.creationDate * 1000);
        this.findMaterialsByIdHouse(this.house.idHouse, this.from);
      }, error => console.log('error getHouseInfo', error));
  }

  private findMaterialsByIdHouse(_idHouse: number, account: string) {
    this.contractService.findMaterialsByIdHouse(_idHouse, account)
      .subscribe(data => {
        this.materials = data;
      }, error => alert('error download'));
  }

  public downloadMaterial(fileName: string, fileHash: string): void {
    this.ipfsService.getFile(fileHash)
      .subscribe(data => {
        // create a blob
        const blob = new Blob([data[0].content.buffer]);
        // download the document
        saveAs(blob, fileName);
      }, error => {
        alert('Une erreur s\'est produite durant le téléchargement');
      });
  }

}
