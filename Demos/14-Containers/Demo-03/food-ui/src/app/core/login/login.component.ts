import { Component, Inject, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import {
  MsalGuardConfiguration,
  MsalService,
  MSAL_GUARD_CONFIG,
} from '@azure/msal-angular';
import {
  InteractionType,
  PopupRequest,
  AuthenticationResult,
  RedirectRequest,
} from '@azure/msal-browser';
import { MsalAuthFacade } from 'src/app/auth/state/auth.facade';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  entryPic = '/assets/images/burger.png';
  isIframe = false;

  constructor(
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private authService: MsalService,
    private af: MsalAuthFacade
  ) {}

  ngOnInit(): void {
    this.isIframe = window !== window.parent && !window.opener;
  }

  login() {
    if (environment.authEnabled) {
      if (this.msalGuardConfig.interactionType === InteractionType.Popup) {
        if (this.msalGuardConfig.authRequest) {
          this.authService
            .loginPopup({ ...this.msalGuardConfig.authRequest } as PopupRequest)
            .subscribe((response: AuthenticationResult) => {
              this.authService.instance.setActiveAccount(response.account);
            });
        } else {
          this.authService
            .loginPopup()
            .subscribe((response: AuthenticationResult) => {
              this.authService.instance.setActiveAccount(response.account);
            });
        }
      } else {
        if (this.msalGuardConfig.authRequest) {
          this.authService.loginRedirect({
            ...this.msalGuardConfig.authRequest,
          } as RedirectRequest);
        } else {
          this.authService.loginRedirect();
        }
      }
    }
  }
}
