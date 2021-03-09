import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '~utils/shared.module';

import { ProductComponent } from './product.component';
import { FormsComponent } from './forms/forms.component';
import { CharsTableComponent } from './forms/chars-table/chars-table.component';

@NgModule({
  imports: [
    RouterModule.forChild([{path: '', component: ProductComponent}]),
    SharedModule
  ],
  declarations: [
    ProductComponent,
    FormsComponent,
    CharsTableComponent
  ],
  providers: [],
  entryComponents: [
    FormsComponent
  ],
  exports: [
    RouterModule,
  ]
})
export class ProductModule { }

