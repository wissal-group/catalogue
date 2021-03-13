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
  public isLoading: boolean;
  public isTotalReached = false;
  public totalItems = 99999;
  public search = '';

  public paginationActivated = true;

  opened = false;
  private lastElement: Product;
  private previousElements: string[] = [];

  public searchByEANCODE: string;
  public categories: { name: string, categories: { value: string, viewValue: string }[] }[] =
    [
      {
        name: 'Computers',
        categories: [
          {viewValue: 'Laptops', value: 'Hardware>Computers>Computers>Laptops'},
          {viewValue: 'Desktops', value: 'Hardware>Computers>Computers>Desktops'},
          {viewValue: 'Power Supply Adapters', value: 'Hardware>Computers>Accessoires>Voedingadapters'},
          {viewValue: 'Keyboard and mouse', value: 'Hardware>Computers>Randapparatuur>Toetsenbord_en_muis_sets'},
          {viewValue: 'Batteries', value: 'Hardware>Computers>Accessoires>Opladers_en_batterijen'},
          {viewValue: 'POS Terminals', value: 'Hardware>Computers>Computers>POS_terminals'},
          {viewValue: 'Sleeves and covers', value: 'Hardware>Computers>Accessoires>Sleeves_en_hoezen'},
          {viewValue: 'Pen', value: 'Hardware>Computers>Randapparatuur>Pennen'},
          {viewValue: 'mouse', value: 'Hardware>Computers>Randapparatuur>Muizen'},
          {viewValue: 'Keyboards', value: 'Hardware>Computers>Randapparatuur>Toetsenborden'},
          {viewValue: 'koffers', value: 'Hardware>Computers>Accessoires>Koffers_en_tassen'},
          {viewValue: 'Tablet Keyboards', value: 'Hardware>Computers>Accessoires>Tablet_toetsenborden'},
        ]
      },
      {
        name: 'Printers',
        categories: [
            {viewValue: 'laser Printers', value: 'Hardware>Printers_en_scanners>Printers>Laser_printers'},
            {viewValue: 'Label Printers', value: 'Hardware>Printers_en_scanners>Printers>Labelprinters'},
        ]
      },
      {
        name: 'Monitors',
        categories: [
            {viewValue: 'Monitor', value: 'Hardware>Beeld_en_geluid>Monitoren>Televisies'},
            {viewValue: 'Desktop Monitors', value: 'Hardware>Beeld_en_geluid>Monitoren>Desktop_monitoren'},
            {viewValue: 'Video Splitters', value: 'Hardware>Beeld_en_geluid>Beeld_accessoires>Video_splitters'},
            {viewValue: 'Monitors accessories', value: 'Hardware>Beeld_en_geluid>Beeld_accessoires>Beeld_accessoires'},
            {viewValue: 'Cables adapters', value: 'Hardware>Beeld_en_geluid>Kabels>Adapters'},
            {viewValue: 'Wall brackets', value: 'Hardware>Beeld_en_geluid>Beeld_accessoires>Muursteunen'},
        ]
      },
      {
        name: 'Servers and Storage',
        categories: [
            {viewValue: 'Backup and storage ', value: 'Hardware>Servers_en_storage>Backup_en_storage>UPS'},
            {viewValue: 'Montage kits ', value: 'Hardware>Servers_en_storage>Accessoires>Montagekits'},
            {viewValue: 'Servers batteries', value: 'Hardware>Servers_en_storage>Server_en_back-up_onderdelen>Accu\'s_en_batterijen'},
        ]
      },
    ];

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
      // this.router.navigate(['/login']);
    }
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
        this.lastElement = res.pop();
        this.isLoading = false;
        this.paginationActivated = false;
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
        this.productService.delete(product.productId).subscribe((data: any) => {
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
