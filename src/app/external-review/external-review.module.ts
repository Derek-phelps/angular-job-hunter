import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { UiModule } from '@hellotemp/ui';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RequestReviewComponent } from './request-review/request-review.component';
import { ExternalReviewRoutingModule } from './external-review-routing.module';



@NgModule({
  declarations: [RequestReviewComponent],
  imports: [
    CommonModule,
    MaterialModule,
    FlexLayoutModule,
    UiModule,
    FormsModule,
    ReactiveFormsModule,
    ExternalReviewRoutingModule,
  ],
})
export class ExternalReviewModule { }
