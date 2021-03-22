import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {FormArray, FormBuilder, Validators} from '@angular/forms';
import {SnackbarComponent} from '~components/snackbar/snackbar.component';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-chars-table',
  templateUrl: './chars-table.component.html',
  styleUrls: ['./chars-table.component.css']
})
export class CharsTableComponent implements OnInit {

  @Input() characteristics: any;

  @Output() savedCharacteristics = new EventEmitter<any>();


  charFormList = [];

  constructor(
    private fb: FormBuilder,
    public snack: MatSnackBar
  ) {

  }

  // GETTERS
  getCharKeys(formGroupIndex: number) {
    return this.charFormList[formGroupIndex].get('charKeys') as FormArray;
  }

  getCharValues(formGroupIndex: number) {
    return this.charFormList[formGroupIndex].get('charValues') as FormArray;
  }

  // add to form
  addGroup() {
    this.charFormList.push(this.fb.group({
      charType: ['', Validators.required],
      charKeys: this.fb.array([], [Validators.required]),
      charValues: this.fb.array([], [Validators.required])
    }));
    this.addKeyValue(this.charFormList.length - 1);
  }

  // add to form
  addGroupFromChar(name: string) {
    this.charFormList.push(this.fb.group({
      charType: [name, Validators.required],
      charKeys: this.fb.array([]),
      charValues: this.fb.array([])
    }));
    this.addKeyValue(this.charFormList.length - 1);
  }

  addKeyValue(formGroupIndex: number) {
    this.getCharKeys(formGroupIndex).push(this.fb.control('', Validators.required));
    this.getCharValues(formGroupIndex).push(this.fb.control('', Validators.required));

  }

  addKey(formGroupIndex: number, key: string) {
    this.getCharKeys(formGroupIndex).push(this.fb.control(key, Validators.required));
  }

  addValue(formGroupIndex: number, value: string) {
    this.getCharValues(formGroupIndex).push(this.fb.control(value, Validators.required));
  }

  removeKeyValue(formGroupIndex: number, rowNumber: number) {
    this.getCharKeys(formGroupIndex).removeAt(rowNumber);
    this.getCharValues(formGroupIndex).removeAt(rowNumber);

  }

  removeGroup(formGroupIndex: number) {
    this.charFormList.splice(formGroupIndex, 1);
  }


  ngOnInit() {
    this.getCharacteristicsForms();
  }


  getCharacteristicsForms() {
    let typeIndex = 0;
    let nameIndex = 0;
    // let valueIndex = 0;
    for (const prop in this.characteristics[0]) {
      this.addGroupFromChar(prop);
      for (const char in this.characteristics[0][prop]) {
        this.addKey(typeIndex, char);
        this.addValue(typeIndex, this.characteristics[0][prop][char]);
        nameIndex++;
      }
      this.removeKeyValue(typeIndex, 0);
      typeIndex++;
    }
  }

  private openSnack(data: any): void {
    this.snack.openFromComponent(SnackbarComponent, {
      data: {data: data},
      duration: 3000
    });
  }

  saveCharacteristics() {
    let _result = [];
    const item = {} ;
    this.charFormList.forEach(form => {
      const controls = form.controls;

      if (form.invalid) {
        Object.keys(controls).forEach(controlName => {
            controls[controlName].markAsTouched();
          }
        );
        this.openSnack({message: 'Error : Some Values are empty !'});
        return;
      }
      let _obj = {};
      let i = 0;

      controls['charKeys'].value.forEach(char => {
        _obj[char] = controls['charValues'].value[i];
        i++;
      });
      const type = form.controls.charType.value;
      item[type] = _obj;
    });
    _result.push(item);
    this.savedCharacteristics.emit(_result);
    this.openSnack({message: 'Characteristics Saved '});


  }
}
