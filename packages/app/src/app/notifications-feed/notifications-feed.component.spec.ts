import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationsFeedComponent } from './notifications-feed.component';

describe('NotificationsFeedComponent', () => {
  let component: NotificationsFeedComponent;
  let fixture: ComponentFixture<NotificationsFeedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificationsFeedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationsFeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
