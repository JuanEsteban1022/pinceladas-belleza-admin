import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProvidersRoutingModule } from './providers-routing.module';
import { ProviderListComponent } from './provider-list/provider-list.component';
import { ProviderFormComponent } from './provider-form/provider-form.component';
import { ProviderDetailComponent } from './provider-detail/provider-detail.component';
import { SharedModule } from '../../shared.module';

@NgModule({
  declarations: [
    ProviderListComponent,
    ProviderFormComponent,
    ProviderDetailComponent
  ],
  imports: [
    CommonModule,
    ProvidersRoutingModule,
    SharedModule
  ],
  providers: [
  ]
})
export class ProvidersModule { }
