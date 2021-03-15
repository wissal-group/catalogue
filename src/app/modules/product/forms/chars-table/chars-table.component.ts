import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder} from '@angular/forms';


@Component({
  selector: 'app-chars-table',
  templateUrl: './chars-table.component.html',
  styleUrls: ['./chars-table.component.css']
})
export class CharsTableComponent implements OnInit {

  @Input() characteristics: any;

  charNamesForm;
  charValuesForm;
  charTypesForm;

  positions = new Array(new Array(2));
  constructor(private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.buildForm();

    let typeIndex = 0;
    let nameIndex = 0;
    // let valueIndex = 0;
    for (const prop in this.characteristics[0]) {
      this.charTypes.push(this.fb.control(prop));
      for (const char in this.characteristics[0][prop]) {
        console.log('key ' + nameIndex);
        // console.log(char + ' : ' + this.characteristics[0][prop][char]);
        this.charNames.push(this.fb.control(char));
        this.charValues.push(this.fb.control(this.characteristics[0][prop][char]));
        this.positions[nameIndex] = [];
        this.positions[nameIndex][0] = nameIndex;
        // this.positions[nameIndex][1] = typeIndex;
        console.log(this.positions);
        nameIndex++;
      }
      this.positions[nameIndex -1][1] = prop;
      console.log(this.positions);

      typeIndex++;

    }

    console.log('positions : ' + this.positions);
  }

  get charNames() {
    return this.charNamesForm.get('charNames') as FormArray;
  }

  get charValues() {
    return this.charValuesForm.get('charValues') as FormArray;
  }

  get charTypes() {
    return this.charTypesForm.get('charTypes') as FormArray;
  }

  addCharName() {
    this.charNames.push(this.fb.control(''));
    this.addCharValue();
  }

  addCharValue() {
    this.charValues.push(this.fb.control(''));
  }

  buildForm() {
    this.charNamesForm = this.fb.group({
      charNames: this.fb.array([]),
    });

    this.charValuesForm = this.fb.group({
      charValues: this.fb.array([]),
    });

    this.charTypesForm = this.fb.group({
      charTypes: this.fb.array([]),
    });
  }

  onSubmit() {
  }

}
