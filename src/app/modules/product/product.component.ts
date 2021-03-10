import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';

import {Product} from '~models/product';
import {ProductService} from '~services/product.service';
import {AuthService} from '~services/auth.service';
import {ConfirmComponent} from '~components/confirm/confirm.component';
import {FormsComponent} from '~modules/product/forms/forms.component';
import {SnackbarComponent} from '~components/snackbar/snackbar.component';


@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
  providers: [ProductService]
})
export class ProductComponent implements AfterViewInit, OnInit {
  public displayedColumns = ['id', 'productId', 'categoryId', 'vendorCode', 'createDate', 'image', 'descriptionDetails', 'personid'];
  public pageSizeOptions = [20, 50, 100, 200, 500];
  public pageSize = 50;
  public dataSource = new MatTableDataSource<any>();
  public page = 1;
  public isLoading = false;
  public isTotalReached = false;
  public totalItems = 99999;
  public search = '';

  public nbPages = 999;

  opened = false;
  private lastElement: Product;
  private previousElements: string[] = [];


  @ViewChild(MatSort, {static: false}) sort: MatSort;

  constructor(
    private productService: ProductService,
    private authService: AuthService,
    private router: Router,
    public dialog: MatDialog,
    public snack: MatSnackBar
  ) {
  }

  ngOnInit() {
    if (!this.authService.loggedIn.getValue()) {
      // this.router.navigate(['/login']);
    }
  }

  ngAfterViewInit() {
    this.getData(10, 'undefined');
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
    });
  }

  // managing pages

  decrementPageIndex() {
    console.log('previous ...');
    this.page--;
    this.getData(this.pageSize, this.previousElements[this.page - 1]);
  }

  incrementPageIndex() {
    this.previousElements[this.page] = this.lastElement.productId;
    this.page = this.page + 1;
    this.getData(this.pageSize, this.lastElement.productId);

    console.log('previous page list ' + this.previousElements);

  }

  pageSizeChanged() {
    this.page = 1;
    this.getData(this.pageSize, 'undefined');
  }

  verifyInputPageIndex() {
  }


  edit(product: Product): void {
    const dialogRef = this.dialog.open(FormsComponent, {
      width: '1800px',
      height: '100%',
      // scrollStrategy:,
      data: {title: 'Update person', action: 'edit', data: product}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // this.paginator._changePageSize(this.paginator.pageSize);
      }
    });
  }

  save(): void {
    const dialogRef = this.dialog.open(FormsComponent, {
      width: '400px',
      data: {title: 'Add person', action: 'save'}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // this.paginator._changePageSize(this.paginator.pageSize);
      }
    });
  }

  delete(product: Product): void {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      width: '250px',
      data: {
        title: 'Delete record',
        message: 'Are you sure you want to delete this record?'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Deleting ' + product.productId);
        this.productService.delete(product.productId).subscribe((data: any) => {
          console.log(JSON.stringify(data));
          this.openSnack(data);
          if (data.success) {
          }
        });
      }
    });
  }


  open(): number {
    if (this.opened) {
      this.opened = true;
      return 999;
    } else {
      this.opened = false;
      return 30;
    }
  }

}
