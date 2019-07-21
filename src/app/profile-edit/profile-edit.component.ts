import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.scss']
})
export class ProfileEditComponent implements OnInit {
  form: FormGroup;

  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.initForm();
  }

  initForm(): void {
    this.form = this.fb.group({
      firstName: ['Igor'],
      lastName: ['Garnik'],
      country: ['Ukraine'],
      age: ['35']
    });
  }

  submit(){
    console.log(this.form.value.email);
  }

}
