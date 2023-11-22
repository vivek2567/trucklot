import { TestBed } from '@angular/core/testing';

import { LayoutService } from './layout.service';

describe('LayoutService', () => {
  let service: LayoutService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LayoutService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should check toggle functionality', () => {
    service.isSidebarOpen = false;
    service.toggleSidebar();
    expect(service.isSidebarOpen).toBeTruthy();
  });
});
