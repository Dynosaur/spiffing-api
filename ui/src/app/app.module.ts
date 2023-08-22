import { NgModule } from '@angular/core';
import { DateAgoPipe } from 'spiff/app/pipes/date-ago.pipe';
import { RootComponent } from 'spiff/app/app.component';
import { BrowserModule } from '@angular/platform-browser';
import { PostComponent } from 'spiff/app/ui/views/post/post.component';
import { MaterialModule } from 'spiff/app/material.module';
import { CommaNumberPipe } from 'spiff/app/pipes/comma-number.pipe';
import { DialogComponent } from 'spiff/app/ui/components';
import { AppRoutingModule } from 'spiff/app/app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { PrettyNumberPipe } from 'spiff/app/pipes/pretty-number.pipe';
import { NotFoundComponent } from 'spiff/app/components/not-found/not-found.component';
import { FormFieldComponent } from 'spiff/app/components/form-field/form-field.component';
import { LandingPageComponent } from 'spiff/app/ui/views/landing-page';
import { LoginDialogComponent } from 'spiff/app/ui/components/dialogs/login-dialog';
import { RateCounterComponent } from 'spiff/app/ui/components/rate-counter/rate-counter.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TextFieldDialogComponent } from './ui/components/text-field-dialog/text-field-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonComponent, ViewCardComponent } from 'spiff/app/ui/components';
import { ProfileComponent, SettingsComponent } from 'spiff/app/ui/views';
import { CreateAccountDialogComponent, DeleteAccountConfirmDialogComponent, ChangeUsernameDialogComponent } from './ui/components/dialogs';

@NgModule({
    declarations: [
        DateAgoPipe,
        RootComponent,
        PostComponent,
        ButtonComponent,
        CommaNumberPipe,
        DialogComponent,
        PrettyNumberPipe,
        ProfileComponent,
        NotFoundComponent,
        SettingsComponent,
        ViewCardComponent,
        FormFieldComponent,
        LandingPageComponent,
        LoginDialogComponent,
        RateCounterComponent,
        TextFieldDialogComponent,
        CreateAccountDialogComponent,
        ChangeUsernameDialogComponent,
        DeleteAccountConfirmDialogComponent
    ],
    imports: [
        FormsModule,
        BrowserModule,
        MaterialModule,
        AppRoutingModule,
        HttpClientModule,
        ReactiveFormsModule,
        BrowserAnimationsModule
    ],
    bootstrap: [RootComponent]
})
export class AppModule { }
