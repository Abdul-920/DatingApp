/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ChatWithSignalRService } from './ChatWithSignalR.service';

describe('Service: ChatWithSignalR', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ChatWithSignalRService]
    });
  });

  it('should ...', inject([ChatWithSignalRService], (service: ChatWithSignalRService) => {
    expect(service).toBeTruthy();
  }));
});
