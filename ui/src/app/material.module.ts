import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
    exports: [
        MatCardModule,
        MatIconModule,
        MatMenuModule,
        MatInputModule,
        MatButtonModule,
        MatDialogModule,
        MatDividerModule,
        MatToolbarModule,
        MatSnackBarModule,
        MatFormFieldModule,
        MatProgressSpinnerModule
    ]
})
export class MaterialModule { }
