import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DeleteAccountConfirmDialogComponent } from './delete-account-confirm-dialog.component';

describe('DeleteAccountConfirmDialogComponent', () => {
  let component: DeleteAccountConfirmDialogComponent;
  let fixture: ComponentFixture<DeleteAccountConfirmDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteAccountConfirmDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteAccountConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
