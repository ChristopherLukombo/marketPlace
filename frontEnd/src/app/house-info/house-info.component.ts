import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
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
    private ipfsService: IpfsService,
    private snackBar: MatSnackBar
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
        this.logger.error(error);
        this.house = null;
      });
  }

  private openSnackBar(message: string) {
    this.snackBar.open(message, null, {
      duration: 4000,
      horizontalPosition: 'right'
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
        this.logger.error('Error during getHouseInfo', error);
        this.openSnackBar('Une erreur s\'est produite durant la récupération des informations');
      });
  }

  private findMaterialsByIdHouse(idHouse: number, account: string): void {
    this.contractService.findMaterialsByIdHouse(idHouse, account)
      .subscribe(data => {
        this.materials = data;
      }, error => {
        this.logger.error(error);
        this.openSnackBar('Pas de matériels');
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
        this.openSnackBar('Une erreur s\'est produite durant le téléchargement');
      });
  }

}
