import { Component, OnInit, NgZone } from '@angular/core';
import { Web3Service } from '../services/web3.service';
import { ContractService } from '../services/contract.service';
import { House } from 'src/model/house';
import { Router } from '@angular/router';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { HouseDialogSuccessComponent } from '../house-dialog-success/house-dialog-success.component';
import { MatDialog } from '@angular/material/dialog';

const WIDTH = '50%';
const HEIGHT = '15%';

@Component({
  selector: 'app-create-house',
  templateUrl: './create-house.component.html',
  styleUrls: ['./create-house.component.scss']
})
export class CreateHouseComponent implements OnInit {

  accounts: any;

  balance: number;
  sendingAmount: number;
  recipientAddress: string;
  status: string;
  from: string;

  submitted: boolean;

  createHouseForm: FormGroup;

  owners: string[];

  errorMessage: string;

  constructor(
    private web3Service: Web3Service,
    private contract: ContractService,
    private router: Router,
    private formBuilder: FormBuilder,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.createForm();
    this.onReady();
  }


  private createForm() {
    const target = {
      title: ['', [Validators.required]],
      addressHouse: ['', [Validators.required]],
      price: ['', [Validators.required]],
      surface: ['', [Validators.required]],
      description: ['', [Validators.required]],
      roomCount: ['', [Validators.required]],
      creationDate: ['', [Validators.required]],
      owner: ['', [Validators.required]],
    };

    this.createHouseForm = this.formBuilder.group(target);
  }

  // convenience getter for easy access to form fields
  get f() { return this.createHouseForm.controls; }

  onReady() {
    this.web3Service.getAccounts().subscribe(data => {
      this.accounts = data;
      this.from = this.accounts[0];
      this.initOwners();
    }, error => alert(error));
  }


  private initOwners() {
    this.owners = [];
    for (let i = 1; i < this.accounts.length; i++) {
      this.owners.push(this.accounts[i]);
    }
  }

  public addHouse() {

    this.submitted = true;

    if (this.createHouseForm.invalid) {
      return;
    }

    const house = new House();
    house.title = this.createHouseForm.controls.title.value;
    house.addressHouse = this.createHouseForm.controls.addressHouse.value;
    house.price = this.createHouseForm.controls.price.value;
    house.surface = this.createHouseForm.controls.surface.value;
    house.description = this.createHouseForm.controls.description.value;
    house.roomCount = this.createHouseForm.controls.roomCount.value;
    house.creationDate = this.toTimeStamp(this.createHouseForm.controls.creationDate.value);
    house.owner = this.createHouseForm.controls.owner.value;

    this.contract.addHouse(house, this.from).subscribe(() => {
      this.resetForm();
      this.openDialogSuccess();
      this.submitted = false;
      // redirection sur la liste des maisons
      setTimeout(() => {
          this.router.navigate(['houses']);
          this.dialog.closeAll();
        }, 3000);
    }, error => {
      this.submitted = false;
      this.errorMessage = 'Une erreur s\'est produite';
    }
    );
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

  private resetForm() {
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
