import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

import {ProductService} from '~services/product.service';
import {SnackbarComponent} from '~components/snackbar/snackbar.component';
import {Product} from '~models/product';
import {ImageService} from '~services/image.service';

@Component({
  selector: 'app-forms',
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.scss']
})

export class FormsComponent implements OnInit {
  public frm: FormGroup;
  public mode: string;

  public product: Product;
  public uploadedImages: string[] = [];
  public uploadedThumbs: string[] = [];

  @ViewChild('fileInput') fileInput: ElementRef;

  public displayedImage: string;

  constructor(
    public dialogRef: MatDialogRef<FormsComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: any,
    private fb: FormBuilder,
    private productService: ProductService,
    public snack: MatSnackBar,
    private imageService: ImageService,
  ) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
    if (!this.data.data) {
      this.data.data = {
        productId: '',
        categoryId: '',
        characteristics: [{'': {'': ''}}],
        createDate: '',
        descriptionDetails: '',
        brand: '',
        VendorCode: '',
        imgURL: '',
        modifyDate: '',
        thumbURL: [],
        timestamp: '',
        title: '',
      };
    }
    this.initializeForm();
    this.displayedImage = this.data.data.imgURL[0];
    this.product = this.data.data;

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
    const data: Product = this.data.data;
    this.frm = this.fb.group({
      title: new FormControl(data.title),
      categoryId: new FormControl(data.categoryId, [Validators.required, Validators.minLength(3)]),
      productId: new FormControl(data.productId, [Validators.required, Validators.minLength(3)]),
      descriptionDetails: new FormControl(data.descriptionDetails, [Validators.required]),
      brand: new FormControl(data.brand, [Validators.required]),
      EanCode: new FormControl(data.EanCode),

    });
  }

  public save(form: FormGroup) {

    Object.keys(form.value).forEach(key => {
      this.product[key] = form.controls[key].value;
    });
    this.product.modifyDate = Date.now().toString();
    console.log(this.product);

    if (this.mode === 'create') {
      this.product.createDate = Date.now().toString();
      this.product.imgURL = this.uploadedImages;
      this.product.thumbURL = this.uploadedThumbs;
      this.uploadedThumbs = [];
      this.uploadedImages = [];
      this.productService.save(this.product).subscribe((data: any) => {
        this.openSnack({message: 'Product Added Successfully !'});
        if (data.success) {
          this.dialogRef.close(true);
        }
      });
    } else {
      console.log(this.product.imgURL);
      this.product.imgURL = this.product.imgURL.concat(this.uploadedImages);
      this.product.thumbURL = this.product.thumbURL.concat(this.uploadedThumbs);
      this.uploadedThumbs = [];
      this.uploadedImages = [];
      this.productService.update(this.product).subscribe((data: any) => {
        this.openSnack({message: 'Product Updated Successfully !'});
        if (data.success) {
          this.dialogRef.close(true);
        }
      });
    }

  }


  saveCharacteristics(event) {
    this.product.characteristics = event;
  }


  chooseImage() {
    this.fileInput.nativeElement.click();
  }

  getBase64(event) {
    const me = this;
    const file = event.target.files[0];
    const reader = new FileReader();
    console.log(file.name);
    reader.readAsDataURL(file);

    reader.onload = (evenlt: any) => {
      this.imageService.uploadImage({fileName: file.name, image: reader.result}).subscribe(result => {
        console.log(result);
        this.displayedImage = result.imageUrl;
        // this.data.data.imgURL.push(result.imageUrl);
        // this.data.data.thumbURL.push(result.thumbUrl);
        this.uploadedImages.push(result.imageUrl);
        this.uploadedThumbs.push(result.thumbUrl);

      }, error => console.log(error));

    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
  }


  public getErrorMessage() {
    return this.frm.controls.productId.hasError('required') ? 'This Field is required' :
      this.frm.controls.productId.hasError('minlength') ? 'min length is 2' : '';
  }


}
