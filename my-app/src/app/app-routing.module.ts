import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NgmatTableComponent } from './ngmat-table/ngmat-table.component';
import { FileUploadComponent } from './file-upload/file-upload.component';


const routes: Routes = [
  {
    path: 'table',
    component: NgmatTableComponent
  },
  {
    path: 'fu',
    component: FileUploadComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
