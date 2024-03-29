import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { NGXLogger } from 'ngx-logger';
import { House } from 'src/model/house';
import { environment } from '../../environments/environment';
import { Material } from '../../model/model.material';
import { HouseDialogSuccessComponent } from '../house-dialog-success/house-dialog-success.component';
import { ContractService } from '../services/contract.service';
import { IpfsService } from '../services/ipfs.service';
import { Web3Service } from '../services/web3.service';

const WIDTH = '50%';
const HEIGHT = '15%';
@Component({
  selector: 'app-create-house',
  templateUrl: './create-house.component.html',
  styleUrls: ['./create-house.component.scss']
})
export class CreateHouseComponent implements OnInit {

  errorMessage: string;

  accounts: any;

  balance: number;
  sendingAmount: number;
  recipientAddress: string;
  status: string;
  from: string;

  submitted: boolean;

  createHouseForm: FormGroup;
  importForm: FormGroup;

  owners: string[];

  selectedFiles: FileList;
  files = new Map<number, File>();
  filesNumber: number[];

  constructor(
    private logger: NGXLogger,
    private web3Service: Web3Service,
    private contractService: ContractService,
    private router: Router,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private ipfsService: IpfsService,
    private snackBar: MatSnackBar
  ) {
  }

  ngOnInit() {
    this.createForm();
    this.onReady();
    this.initNumberOfFiles();
  }

  private initNumberOfFiles() {
    this.filesNumber = Array(environment.filesNumber).fill(0)
      .map((x, i) => i);
  }

  private createForm(): void {
    const config = {
      title: ['', [Validators.required]],
      addressHouse: ['', [Validators.required]],
      price: ['', [Validators.required]],
      surface: ['', [Validators.required]],
      description: ['', [Validators.required]],
      roomCount: ['', [Validators.required]],
      creationDate: ['', [Validators.required]],
      owner: ['', [Validators.required]],
    };

    this.createHouseForm = this.formBuilder.group(config);
  }

  selectFile(event: any, index: number): void {
    this.selectedFiles = event.target.files;
    this.files.set(index, this.selectedFiles.item(0));
  }

  private openSnackBar(message: string) {
    this.snackBar.open(message, null, {
      duration: 4000,
      horizontalPosition: 'right'
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.createHouseForm.controls; }

  onReady(): void {
    this.web3Service.getAccounts()
      .subscribe(data => {
        this.accounts = data;
        this.from = this.accounts[0];
        this.initOwners();
      }, error => {
        this.logger.error(error);
        this.openSnackBar(error);
      });
  }

  private initOwners(): void {
    this.owners = this.accounts.filter((a: string, i: number) => i > 0);
  }

  public addHouse(): void {
    this.submitted = true;

    if (this.createHouseForm.invalid) {
      return;
    }

    const house = this.buildHouse();

    this.contractService.addHouse(house, this.from)
      .subscribe(data => {
        this.getHouseLastHouse();
      }, error => {
        this.logger.error(error);
        this.submitted = false;
        this.errorMessage = 'Une erreur s\'est produite';
        this.openSnackBar(this.errorMessage);
      });
  }

  private buildHouse(): House {
    const house = new House();
    house.title = this.createHouseForm.controls.title.value;
    house.addressHouse = this.createHouseForm.controls.addressHouse.value;
    house.price = this.createHouseForm.controls.price.value;
    house.surface = this.createHouseForm.controls.surface.value;
    house.description = this.createHouseForm.controls.description.value;
    house.roomCount = this.createHouseForm.controls.roomCount.value;
    house.creationDate = this.toTimeStamp(this.createHouseForm.controls.creationDate.value);
    house.owner = this.createHouseForm.controls.owner.value;
    return house;
  }

  private getHouseLastHouse(): void {
    this.contractService.getSaleHouses(this.from)
      .subscribe(house => {
        const idHouse = house[house.length - 1].idHouse;
        // Sends files selected
        for (const [key, value] of this.files) {
          if (!value) {
            continue;
          }
          const reader = new FileReader();
          reader.onload = (e) => {
            this.uploadFile(value.name, reader.result, idHouse);
          };
          reader.readAsArrayBuffer(value);
        }
        this.openDialogSuccess();
        this.resetForm();
        this.submitted = false;
        //  redirection on list of houses
        setTimeout(() => {
          this.router.navigate(['houses']);
          this.dialog.closeAll();
        }, 3000);
      }, error => {
        this.logger.error(error);
      });
  }

  private uploadFile(fileName: string, content: any, idHouse: number): void {
    this.uploadFileToIpfs(fileName, content, idHouse);
  }

  private uploadFileToIpfs(fileName: string, content: string, idHouse: number): void {
    this.ipfsService.addFile({
      path: fileName,
      content: Buffer.from(content)
    }).subscribe(data => {
      const material = this.buildMaterial(fileName, data[0].hash, idHouse);

      // If file is uploaded to ipfs, we send data to Ganache
      this.sendMaterialToGanache(material);
    }, error => {
      this.logger.error(error);
      this.openSnackBar('Une erreur s\'est produite durant l\'upload');
    });
  }

  private sendMaterialToGanache(material: Material): void {
    this.contractService.sendMaterial(material, this.from)
      .subscribe(() => {
        this.logger.log('success');
      }, error => {
        this.logger.error(error);
        this.openSnackBar('Une erreur s\'est produite durant l\'upload');
      });
  }

  private buildMaterial(fileName: string, fileHash: string, idHouse: number): Material {
    const material = new Material();
    material.fileName = fileName;
    material.fileHash = fileHash;
    material.idHouse = idHouse;
    return material;
  }

  public openDialogSuccess(): void {
    this.dialog.open(
      HouseDialogSuccessComponent,
      {
        width: WIDTH,
        height: HEIGHT
      }
    );
  }

  private resetForm(): void {
    this.createHouseForm.reset();
    for (const key in this.createHouseForm.controls) {
      if (!this.createHouseForm.controls[key]) {
        continue;
      }
      this.createHouseForm.controls[key].setErrors(null);
    }
  }

  private toTimeStamp(date: Date): number {
    return Math.round(date.getTime() / 1000);
  }

}
