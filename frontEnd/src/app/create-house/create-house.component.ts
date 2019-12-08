import { Component, OnInit, NgZone } from '@angular/core';
import { Web3Service } from '../services/web3.service';
import { ContractService } from '../services/contract.service';
import { House } from 'src/model/house';
import { Router } from '@angular/router';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';

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

  constructor(
    private web3Service: Web3Service,
    private contract: ContractService,
    private router: Router,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.createForm();
    this.onReady();
  }


  private createForm() {
    const target = {
      addressHouse: ['', [Validators.required]],
      price: ['', [Validators.required]],
      surface: ['', [Validators.required]],
      description: ['', [Validators.required]],
      documents: ['', []],
      salesman: ['', []],
      roomCount: ['', []],
      creationDate: ['', []],
      owner: ['', []],
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

    const house = new House();
    house.addressHouse = this.createHouseForm.controls.addressHouse.value;
    house.price = this.createHouseForm.controls.price.value;
    house.surface = this.createHouseForm.controls.surface.value;
    house.description = this.createHouseForm.controls.description.value;
    house.documents = ['0xFc72D387b7c15d09856e4423719867d35Eab4C86'];
    house.salesman = '0xFc72D387b7c15d09856e4423719867d35Eab4C86';
    house.roomCount = this.createHouseForm.controls.roomCount.value;
    house.creationDate = this.toTimeStamp(this.createHouseForm.controls.creationDate.value);
    house.owner = this.createHouseForm.controls.owner.value;

    if (this.createHouseForm.invalid) {
      return;
    }


    this.contract.addHouse(house, this.from).subscribe(() => {
      // redirection sur la liste des maisons
      this.resetForm();
      this.router.navigate(['houses']);
      alert('success');
      this.submitted = true;
    }, error => {
      alert('error add House' + error);
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
