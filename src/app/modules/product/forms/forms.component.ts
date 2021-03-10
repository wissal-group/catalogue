import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

import {ProductService} from '~services/product.service';
import {SnackbarComponent} from '~components/snackbar/snackbar.component';

@Component({
  selector: 'app-forms',
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.scss']
})

export class FormsComponent implements OnInit {
  public frm: FormGroup;
  public mode: string;

  @ViewChild('fileInput') fileInput: ElementRef;

  public displayedImage: string;

  constructor(
    public dialogRef: MatDialogRef<FormsComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: any,
    private fb: FormBuilder,
    private productService: ProductService,
    public snack: MatSnackBar
  ) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
    this.initializeForm();
    this.displayedImage = this.data.data.imgURL[0];
  }

  changeImage(url: string) {
    this.displayedImage = url;
  }

  openSnack(data: any) {
    this.snack.openFromComponent(SnackbarComponent, {
      data: {data: data},
      duration: 3000
    });
  }

  private initializeForm() {
    this.mode = this.data.action;
    const data = this.data.data;

    this.frm = this.fb.group({
      title: new FormControl(data.title),
      categoryId: new FormControl(data.categoryId, [Validators.required, Validators.minLength(3)]),
      productId: new FormControl(data.productId, [Validators.required, Validators.minLength(3)]),
      descriptionDetails: new FormControl(data.descriptionDetails, [Validators.required]),
      vendorCode: new FormControl(data.VendorCode),

    });
  }

  public save(form: FormGroup) {
    this.productService.save(form.value).subscribe((data: any) => {
      this.openSnack(data);

      if (data.success) {
        this.dialogRef.close(true);
      }
    });
  }


  chooseImage() {
    this.fileInput.nativeElement.click();
  }

  public getNameErrorMessage() {
    return this.frm.controls.first_name.hasError('required') ? 'First name is required' :
      this.frm.controls.name.hasError('minlength') ? 'min length is 2' : '';
  }

  public getLastNameErrorMessage() {
    return this.frm.controls.last_name.hasError('required') ? 'Last name is required' :
      this.frm.controls.name.hasError('minlength') ? 'min length is 2' : '';
  }

  public getAgeErrorMessage() {
    return this.frm.controls.age.hasError('required') ? 'Age is required' :
      this.frm.controls.age.hasError('minlength') ? 'Min lenght is 2' : '';
  }

  public getGenderErrorMessage() {
    return this.frm.controls.gender.hasError('required') ? '' : '';
  }

}
