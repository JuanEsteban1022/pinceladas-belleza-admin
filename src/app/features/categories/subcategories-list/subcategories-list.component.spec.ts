import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubcategoriesListComponent } from './subcategories-list.component';

describe('SubcategoriesListComponent', () => {
  let component: SubcategoriesListComponent;
  let fixture: ComponentFixture<SubcategoriesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubcategoriesListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubcategoriesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
