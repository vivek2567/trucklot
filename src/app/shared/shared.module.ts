import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from './components/loader/loader.component';
import { LoaderService } from './services/loader.service';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { ImageModule } from 'primeng/image';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { TableModule } from 'primeng/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { RouterModule } from '@angular/router';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CascadeSelectModule } from 'primeng/cascadeselect';
import { PaginatorModule } from 'primeng/paginator';
import { FileUploadModule } from 'primeng/fileupload';
import { CalendarModule } from 'primeng/calendar';
import { InputNumberModule } from 'primeng/inputnumber';
import { TabViewModule } from 'primeng/tabview';
import { DialogModule } from 'primeng/dialog';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { LayoutComponent } from './components/layout/layout.component';
import { LayoutService } from './services/layout.service';
import { DialogService } from 'primeng/dynamicdialog';
import { HttpClientModule } from '@angular/common/http';
import { APIService } from './services/api.service';

@NgModule({
  declarations: [
    LoaderComponent,
    HeaderComponent,
    SidebarComponent,
    LayoutComponent
  ],
  imports: [
    CommonModule,
    InputTextModule,
    ButtonModule,
    ImageModule,
    PasswordModule,
    CheckboxModule,
    TableModule,
    ReactiveFormsModule,
    ToastModule,
    RouterModule,
    RadioButtonModule,
    CascadeSelectModule,
    PaginatorModule,
    FileUploadModule,
    ImageModule,
    CalendarModule,
    FormsModule,
    InputNumberModule,
    TabViewModule,
    DialogModule,
    HttpClientModule
  ],
  providers: [
    LoaderService,
    MessageService,
    LayoutService,
    DialogService,
    APIService
  ],
  exports: [
    LoaderComponent,
    HeaderComponent,
    SidebarComponent,
    LayoutComponent,
    CommonModule,
    InputTextModule,
    ButtonModule,
    ImageModule,
    PasswordModule,
    CheckboxModule,
    TableModule,
    ReactiveFormsModule,
    ToastModule,
    RouterModule,
    RadioButtonModule,
    CascadeSelectModule,
    PaginatorModule,
    FileUploadModule,
    ImageModule,
    CalendarModule,
    FormsModule,
    InputNumberModule,
    TabViewModule,
    DialogModule,
    HttpClientModule,

  ],
  schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
})
export class SharedModule { }
