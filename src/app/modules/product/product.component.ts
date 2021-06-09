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

import * as XLSX from 'xlsx';
import {ImageService} from '~services/image.service';


@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
  providers: [ProductService]
})
export class ProductComponent implements AfterViewInit, OnInit {
  // XLSX
  title = 'XlsRead';
  file: File;
  arrayBuffer: any;
  filelist: any;
  progress = 0;
  uploadProgress = 0;
  productsNumber = 1;
  loadingProducts = false;


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
    private imageService: ImageService,
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
      duration: 5000
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
    this.productService.getOne(id).subscribe(res => {
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
    this.searchTextChanged.next(label);
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
          this.openSnack({message: 'Product Deleted Successfully !'});
          this.dataSource.data = this.dataSource.data.filter(res => res.productId !== product.productId);
        });
      }
    });
  }

  // XLSX
  addfile(event) {
    this.loadingProducts = true;
    this.file = event.target.files[0];
    const fileReader = new FileReader();
    fileReader.readAsArrayBuffer(this.file);
    fileReader.onload = async (e) => {
      this.arrayBuffer = fileReader.result;
      const data = new Uint8Array(this.arrayBuffer);
      const arr = new Array();
      for (let i = 0; i !== data.length; ++i) {
        arr[i] = String.fromCharCode(data[i]);
      }
      const bstr = arr.join('');
      const workbook = XLSX.read(bstr, {type: 'binary'});
      const first_sheet_name = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[first_sheet_name];
      const arraylist = XLSX.utils.sheet_to_json(worksheet, {raw: true});

      this.productsNumber = arraylist.length;
      console.log('uploading images ...');
      const updatedArrayList = await this.getStuff(arraylist);
      updatedArrayList.forEach(elem => {
        if (elem['characteristics'] != null) {
          try {
            elem['characteristics'] = JSON.parse(elem['characteristics']);
          } catch (e) {
            this.openSnack({message: 'Erreur de Syntax characteristiques ! Produit :' + elem.productId});
          }
        }
      });
      console.log('savint products ...');
      updatedArrayList.forEach(element => {
        let i = 0;
        this.productService.save(element).subscribe(res => {
          i++;
          this.uploadProgress++;
          console.log('upload progress' + this.uploadProgress);
          console.log('saved ' + element.productId);
        }, error => {
          i++;
          this.uploadProgress++;
          console.log('upload progress' + this.uploadProgress);
          console.log('failed to save ' + element.productId + ' reason : ' + error.error);
        });
      });
      const saved = XLSX.utils.json_to_sheet(updatedArrayList);
      const newbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(newbook, saved);
      XLSX.writeFile(newbook, 'uploaded' + Date.now() + '.xlsx');
    };
  }


  async uploadUrls(urls: string[], productName: string) {
    let images = [];
    let thumbs = [];
    let i = 1;
    for (const url of urls) {
      if (url.length > 10) {
        const data = await this.imageService.fetchAndUploadImage(url, productName + i).toPromise();
        console.log(data);
        images.push(data['imageUrl']);
        thumbs.push(data['thumbUrl']);
        i++;
      }
    }
    return {images, thumbs};
  }

  async getStuff(arraylist) {
    let updatedArrayList = [];
    let imageUrl: [];
    for (const product of arraylist) {
      if (product['imgURL']) {
        try {
          imageUrl = JSON.parse(product['imgURL']);
        } catch (e) {
          this.openSnack({message: 'Erreur Champ images invalid ! Produit :' + product.productId});

        }
        if (imageUrl !== []) {
          const uploadedStuff = await this.uploadUrls(imageUrl, product['productId']);
          product.imageURL = uploadedStuff.images;
          product.thumbURL = uploadedStuff.thumbs;
        }
      }
      updatedArrayList.push(product);
      this.progress = updatedArrayList.length / this.productsNumber;
      console.log('progress: ' + this.progress * 100);
    }
    return updatedArrayList;
  }

  test() {
    const test = {
      'brand': 'SonicWall',
      'categoryId': 'Hardware>Netwerk>Netwerken>Firewalls',
      'characteristics': `[
      {
        "Caractéristiques physiques": {
          "Indicateurs LED": "Oui"
        },
        "Certificat": {
          "La certification": "FCC, ICES, CE, LVD, RoHS, C-Tick, VCCI, UL, cUL, TUV/GS, CB, CoC, WEEE, REACH, BSMI"
        },
        "Connexions": {
          "Ports ethernet (Gigabit)": "8",
          "Ports ethernet (RJ-45)": "9",
          "Ports USB (2.0)": "2"
        },
        "LAN virtuel": {
          "Nombre de VLAN": "50"
        },
        "Poids et dimensions": {
          "Dimensions (LxPxH)": "225 x 150 x 35 mm",
          "Poids": "915 g"
        },
        "Protocoles": {
          "Back Light Compensation (BLC)": "PPPoE, L2TP, PPT, VoIP, TCP/IP, UDP, ICMP, HTTP, HTTPS, IPSec, ISAKMP/IKE, SNMP, RADIUS",
          "Front panel audio connector": "SNMP v2/v3",
          "Protocoles de routage": "BGP,OSPF,RIP-1,RIP-2",
          "Serveur DHCP": "Oui"
        },
        "Puissance": {
          "Consommation d'énergie": "13,47 W",
          "Courant d'entrée": "1 A",
          "Fréquence d'entrée": "50 - 60 Hz",
          "Source de courant": "36 W",
          "Tension d'entrée": "100-240 V"
        },
        "représentation / réalisation": {
          "Fréquence du processeur": "1000 MHz",
          "Mémoire flash": "64 Mo",
          "Mémoire interne": "1024 Mo",
          "Nombre maximal de connexions au pare-feu": "125000"
        },
        "Réseau & communication": {
          "Connectivité": "Avec fil &sans fil",
          "Norme réseau": "IEEE 802.11a,IEEE 802.11ac,IEEE 802.11n",
          "Quantité de tunnels VPN": "20",
          "Support Quality of Service (QoS)": "Oui",
          "Taux de transfert maximum": "1000 Mbit/s"
        },
        "Sans fil": {
          "Standards Wi-Fi": "802.11a,Wi-Fi 5 (802.11ac),Wi-Fi 4 (802.11n)",
          "Wi-Fi": "Oui"
        },
        "Sécurité": {
          "Algorithmes de sécurité": "128-bit AES,192-bit AES,256-bit AES,3DES,AES,DES,MD5,SHA-1"
        }
      }
    ]`,
      'createDate': '2021-04-08T13:39:59.189856',
      'descriptionDetails': 'SonicWall TZ500. Débit du pare-feu: 1400 Mbit/s, Débit de transfert des données maximum: 1000 Mbit/s, Débit du VPN: 1000 Mbit/s. Fréquence du processeur: 1000 MHz, Certification: FCC, ICES, CE, LVD, RoHS, C-Tick, VCCI, UL, cUL, TUV/GS, CB, CoC, WEEE, REACH, BSMI. Standards wifi: 802.11a,Wi-Fi 5 (802.11ac),Wi-Fi 4 (802.11n), Standards réseau: IEEE 802.11a,IEEE 802.11ac,IEEE 802.11n. Algorithme de sécurité soutenu: 128-bit AES,192-bit AES,256-bit AES,3DES,AES,DES,MD5,SHA-1. Protocoles de gestion: SNMP v2/v3, Protocoles réseau pris en charge: PPPoE, L2TP, PPT, VoIP, TCP/IP, UDP, ICMP, HTTP, HTTPS, IPSec, ISAKMP/IKE, SNMP, RADIUS, Protocole de routage: BGP,OSPF,RIP-1,RIP-2',
      'EanCode': '758479004479',
      'imgURL': `[
      "https://catalogue-products-images.s3.eu-west-3.amazonaws.com/images/01-SSC-0447-1.jpg",
      "https://catalogue-products-images.s3.eu-west-3.amazonaws.com/images/01-SSC-0447-1.jpg"
      ]`,
      'modifyDate': '2021-04-08T13:39:59.189878',
      'productId': '01-SSC-0447',
      'thumbURL': `[
      "https://catalogue-products-images.s3.eu-west-3.amazonaws.com/thumbs/01-SSC-0447-1.jpg"
    ]`,
      'title': 'SonicWall TZ500 pare-feux (matériel) 1400 Mbit/s'
    };
    const updatedArrayList = [];
    updatedArrayList.push(test);
    const saved = XLSX.utils.json_to_sheet(updatedArrayList);
    const newbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(newbook, saved);

    XLSX.writeFile(newbook, 'test' + Date.now().toString() + '.xlsx');
  }


}
