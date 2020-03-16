import { TestBed } from '@angular/core/testing';

import { McUiService } from './mc-ui.service';

describe('McUiService', () => {
  let service: McUiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(McUiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
