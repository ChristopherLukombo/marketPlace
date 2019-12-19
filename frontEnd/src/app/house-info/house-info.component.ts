import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { saveAs } from 'file-saver';
import { NGXLogger } from 'ngx-logger';
import { Material } from 'src/model/model.material';
import { ContractService } from '../services/contract.service';
import { IpfsService } from '../services/ipfs.service';
import { Web3Service } from '../services/web3.service';

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
    private logger: NGXLogger,
    private contractService: ContractService,
    private web3Service: Web3Service,
    private route: ActivatedRoute,
    private ipfsService: IpfsService
  ) { }

  ngOnInit() {
    this.onReady();
  }

  private onReady(): void {
    this.web3Service.getAccounts()
      .subscribe(data => {
        this.from = data[0];
        this.getHouse();
      }, error => {
        this.house = null;
      });
  }

  private getHouse(): void {
    const idHouse = Number(this.route.snapshot.paramMap.get('idHouse'));
    this.getHouseInfo(idHouse, this.from);
  }

  private getHouseInfo(idHouse: number, account: string): void {
    this.contractService.getHouseInfo(idHouse, account)
      .subscribe(data => {
        this.house = data;
        this.house.creationDate = new Date(this.house.creationDate * 1000);
        this.findMaterialsByIdHouse(this.house.idHouse, this.from);
      }, error => {
        this.logger.error('error getHouseInfo', error);
      });
  }

  private findMaterialsByIdHouse(idHouse: number, account: string): void {
    this.contractService.findMaterialsByIdHouse(idHouse, account)
      .subscribe(data => {
        this.materials = data;
      }, error => {
        this.logger.error(error);
        alert('error download');
      });
  }

  public downloadMaterial(fileName: string, fileHash: string): void {
    this.ipfsService.getFile(fileHash)
      .subscribe(data => {
        // create a blob
        const blob = new Blob([data[0].content.buffer]);
        // download the document
        saveAs(blob, fileName);
      }, error => {
        this.logger.error(error);
        alert('Une erreur s\'est produite durant le téléchargement');
      });
  }

}
