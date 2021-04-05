import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';

import {Product} from '~models/product';
import {ProductService} from '~services/product.service';
import {AuthService} from '~services/auth.service';
import {ConfirmComponent} from '~components/confirm/confirm.component';
import {FormsComponent} from '~modules/product/forms/forms.component';
import {SnackbarComponent} from '~components/snackbar/snackbar.component';
import {categories} from '~base/config';
import {debounceTime, distinctUntilChanged, mergeMap} from 'rxjs/operators';
import {Subject} from 'rxjs';


@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
  providers: [ProductService]
})
export class ProductComponent implements AfterViewInit, OnInit {
  public displayedColumns = [
    'id',
    'productId',
    'categoryId',
    'vendorCode',
    'brand',
    'createDate',
    'image',
    'descriptionDetails',
    'actions'];
  public pageSizeOptions = [20, 50, 100, 200, 500];
  public pageSize = 20;
  public dataSource = new MatTableDataSource<any>();
  public page = 1;
  public isLoading = true;
  public isTotalReached = false;
  public paginationActivated = true;
  opened = false;
  private lastElement: Product;
  private previousElements: string[] = [];

  searchTextChanged = new Subject<string>();
  searchResults = [];


  public searchByEANCODE: string;
  public categories: { name: string, categories: { value: string, viewValue: string }[] }[] = categories;

  @ViewChild(MatSort, {static: false}) sort: MatSort;

  constructor(
    private productService: ProductService,
    private authService: AuthService,
    // private router: Router,
    public dialog: MatDialog,
    public snack: MatSnackBar
  ) {
  }

  ngOnInit() {
    if (!this.authService.loggedIn.getValue()) {
      this.isLoading = true;
    }
    this.searchTextChanged.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      mergeMap(search => this.productService.search(search)))
      .subscribe(res => {
        console.log(JSON.stringify(res));
        this.searchResults = res['hits'].hits;
      });
  }

  ngAfterViewInit() {
    this.getData(this.pageSize, 'undefined');
    this.previousElements[0] = 'undefined';
  }

  ngAfterViewChecked() {
  }

  private openSnack(data: any): void {
    this.snack.openFromComponent(SnackbarComponent, {
      data: {data: data},
      duration: 3000
    });
  }

  public onPaginateChange(event: any): void {
    this.page = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.getData(this.pageSize, this.lastElement.productId);
  }

  getData(pageSize: number, lastIndex: string) {
    this.isLoading = true;
    this.productService.getList(pageSize, lastIndex).subscribe(res => {
      this.dataSource.data = res;
      this.lastElement = res.pop();
      this.isLoading = false;
    }, error => {
      this.openSnack({message: 'Oops Something went wrong ! :' + error.message});
      this.isLoading = false;
    });
  }

  getProduct(id: string) {
    this.isLoading = true;
    this.productService.getOne(Number(id)).subscribe(res => {
        this.isLoading = false;
        this.edit(res);
      },
      error => {
        this.openSnack({message: 'Product not found ! '});
        this.isLoading = false;
      });
  }

  getByCategory(category: string) {
    if (category === undefined) {
      this.getData(this.pageSize, 'undefined');
      this.paginationActivated = true;
    } else {
      this.isLoading = true;
      this.productService.getByCategory(category).subscribe(res => {
        this.dataSource.data = res;
        // this.lastElement = res.pop();
        this.isLoading = false;
        this.paginationActivated = false;
      }, error => {
        this.openSnack({message: 'Oops Something went wrong ! :' + error.message});
        this.isLoading = false;
      });
    }
  }

  // managing pages

  decrementPageIndex() {
    this.page--;
    this.getData(this.pageSize, this.previousElements[this.page - 1]);
  }

  incrementPageIndex() {
    this.previousElements[this.page] = this.lastElement.productId;
    this.page = this.page + 1;
    this.getData(this.pageSize, this.lastElement.productId);


  }

  pageSizeChanged() {
    this.page = 1;
    this.getData(this.pageSize, 'undefined');
  }

  edit(product: Product): void {
    const dialogRef = this.dialog.open(FormsComponent, {
      width: '1800px',
      height: '100%',
      data: {title: 'Update person', action: 'edit', data: product}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
      }
    });
  }

  create(): void {
    const dialogRef = this.dialog.open(FormsComponent, {
      width: '1800px',
      height: '100%',
      data: {title: 'Create Product', action: 'create', data: null}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
      }
    });
  }

  search(label: string) {
    console.log('Searching :' + label);
    this.searchTextChanged.next(label);
  }

  delete(product: Product): void {
    console.log(this.dataSource.data);
    const dialogRef = this.dialog.open(ConfirmComponent, {
      width: '250px',
      data: {
        title: 'Delete record',
        message: 'Are you sure you want to delete this record?'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.productService.delete(product.productId).subscribe((data: any) => {
          this.openSnack({message: 'Product Deleted Successfully !'});
          this.dataSource.data = this.dataSource.data.filter(res => res.productId !== product.productId);
        });
      }
    });
  }

}
