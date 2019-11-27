import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NgmatTableComponent } from './ngmat-table/ngmat-table.component';


const routes: Routes = [
  {
    path: 'table',
    component: NgmatTableComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
