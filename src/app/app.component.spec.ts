import {
  async,
  ComponentFixture,
  TestBed
} from '@angular/core/testing';
import {
  RouterTestingModule
} from '@angular/router/testing';
import {
  AppComponent
} from './app.component';
import {
  MCUIService
} from 'projects/mc-ui/src/public-api';
import { NO_ERRORS_SCHEMA } from '@angular/core';

// https://angular.io/guide/testing

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture < AppComponent > ;
  // let service: MCUIService;

  beforeEach(async (() => {
    // example for using mock service and method and return value.
    // testQuote = 'Test Quote';
    // // Create a fake TwainService object with a `getQuote()` spy
    // const twainService = jasmine.createSpyObj('TwainService', ['getQuote']);
    // // Make the spy return a synchronous Observable with the test data
    // getQuoteSpy = twainService.getQuote.and.returnValue( of(testQuote) );

    // need to get all things that are for running the code in the constructor. don't need vr: ViewContainerRes since it is not using in the constructor.
    // Also, need to declare the components that are using in the template.
    TestBed.configureTestingModule({
      imports: [RouterTestingModule], // for <router-outlet></router-outlet>. if we need some custom element, we should import them. some are not important, you can use NO_ERRORS_SCHEMA for them.
      declarations: [AppComponent],
      // schemas: [ NO_ERRORS_SCHEMA ], // The NO_ERRORS_SCHEMA tells the Angular compiler to ignore unrecognized elements and attributes. the template has not important element like <app-banner> etc, the compiler ignores them.
      providers: [{
        provide: MCUIService,
        useValue: {
          message: {
            subscribe: () => {}
          }
        }
      },
      // { provide: HeroService,    useClass: TestHeroService }, // You can user mock service class also. you can use spy or mock class etc.
      // HttpClient needs to import HttpClientTestingModule 
    ]
    });
    // .compileComponents();  // compile template and css
    // if need to test the service, we can use the mock service.
    // service = TestBed.get(MCUIService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    // el = fixture.nativeElement;
    // trigger change
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // fakeAsync() example
  // it('should display error when TwainService fails', fakeAsync(() => {
  //   // tell spy to return an error observable
  //   getQuoteSpy.and.returnValue(
  //     throwError('TwainService test failure'));
  //   fixture.detectChanges(); // onInit()
  //   // sync spy errors immediately after init
  //   tick(); // flush the component's setTimeout()
  //   fixture.detectChanges(); // update errorMessage within setTimeout()
  //   expect(errorMessage()).toMatch(/test failure/, 'should display error');
  //   expect(quoteEl.textContent).toBe('...', 'should show placeholder');
  // }));
});
