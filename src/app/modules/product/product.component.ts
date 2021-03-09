import {AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
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
import {ScrollStrategyOptions} from '@angular/cdk/overlay';


@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
  providers: [ProductService]
})
export class ProductComponent implements AfterViewInit, OnInit {
  public displayedColumns = ['id', 'productId', 'categoryId', 'vendorCode', 'createDate', 'image', 'descriptionDetails', 'personid'];
  public pageSizeOptions = [20, 50, 100, 200, 500];
  public pageSize = 500;
  public dataSource = new MatTableDataSource<any>();
  public pageEvent: PageEvent;
  public resultsLength = 999999;
  public page = 1;
  public isLoading = false;
  public isTotalReached = false;
  public totalItems = 99999;
  public search = '';

  opened = false;
  private lastElement: Product;


  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
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
  }

  ngAfterViewChecked() {
    this.changeDetectorRef.detectChanges();
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
    this.productService.getList(pageSize, lastIndex).subscribe(res => {
      this.dataSource.data = res;
      this.lastElement = res.pop();
    });
  }

  // getData(): void {
  //   this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
  //
  //   console.log('Getting data');
  //   merge(this.sort.sortChange, this.paginator.page)
  //     .pipe(
  //       startWith({}),
  //       switchMap(() => {
  //         this.isLoading = true;
  //         return this.productService.getList(
  //           this.pageSize,
  //           this.lastElement.productId
  //         );
  //       }),
  //       map(data => {
  //         this.isLoading = false;
  //         this.isTotalReached = false;
  //         // this.totalItems = data.total;
  //         return data;
  //       }),
  //       catchError(() => {
  //         this.isLoading = false;
  //         this.isTotalReached = true;
  //         return observableOf([]);
  //       })
  //     ).subscribe(data => {
  //     this.dataSource['data'] = data;
  //     this.lastElement = data.pop();
  //   });
  // }

  edit(product: Product): void {
    console.log('product' + JSON.stringify(product));

    // this.productService.getOne(product.productId).subscribe((data: any) => {
    //   if (data.success) {
        const dialogRef = this.dialog.open(FormsComponent, {
          width: '1800px',
          height: '100%',
          // scrollStrategy:,
          data: {title: 'Update person', action: 'edit', data: product}
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.paginator._changePageSize(this.paginator.pageSize);
          }
        });
      // }
    // });
  }

  save(): void {
    const dialogRef = this.dialog.open(FormsComponent, {
      width: '400px',
      data: {title: 'Add person', action: 'save'}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.paginator._changePageSize(this.paginator.pageSize);
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
        // this.productService.delete(product.productId).subscribe((data: any) => {
        //   this.openSnack(data);
        //   if (data.success) {
        //     this.paginator._changePageSize(this.paginator.pageSize);
        //   }
        // });
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

  fixThumb(url: string): string {
    if (url) {
      url = url.replace('.com', '.com/');

      return url;
    }

  }

}
