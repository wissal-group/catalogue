import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '~utils/shared.module';

import { ProductComponent } from './product.component';
import { FormsComponent } from './forms/forms.component';

@NgModule({
  imports: [
    RouterModule.forChild([{path: '', component: ProductComponent}]),
    SharedModule
  ],
  declarations: [
    ProductComponent,
    FormsComponent
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

