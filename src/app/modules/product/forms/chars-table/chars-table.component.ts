import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder} from '@angular/forms';


@Component({
  selector: 'app-chars-table',
  templateUrl: './chars-table.component.html',
  styleUrls: ['./chars-table.component.css']
})
export class CharsTableComponent implements OnInit {

  @Input() characteristics: any;

  characteristicsForm;

  constructor(private fb: FormBuilder) {
  }

  ngOnInit(): void {
    // this.buildForm();
    // for (const prop in this.characteristics[0]) {
    //   console.log(prop + ': ');
    //   for (const char in this.characteristics[0][prop]) {
    //     console.log(char + ' : ' + this.characteristics[0][prop][char]);
    //     this.charKeysInputs.push(this.fb.control(char));
    //     this.charValuesInputs.push(this.fb.control(this.characteristics[0][prop][char]));
    //
    //
    //   }
    // }
  }

  // get charKeysInputs() {
  //   return this.characteristicsForm.get('charKeysInputs') as FormArray;
  // }
  //
  // get charValuesInputs() {
  //   return this.characteristicsForm.get('charValuesInputs') as FormArray;
  // }
  //
  // addCharKey() {
  //   this.charKeysInputs.push(this.fb.control(''));
  // }
  //
  // addCharValue() {
  //   this.charValuesInputs.push(this.fb.control(''));
  // }
  //
  // buildForm() {
  //   this.characteristicsForm = this.fb.group({
  //     charKeysInputs: this.fb.array([
  //     ]),
  //     charValuesInputs: this.fb.array([
  //     ])
  //   });
  // }
  //
  // onSubmit() {
  // }

}
