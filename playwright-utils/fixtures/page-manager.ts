import type { Page } from '@playwright/test'
import { HeaderComponent } from '../pages/header-component'
import { LoginPopupComponent } from '../pages/login-popup-component'

export class PageManager {
  readonly headerComponent: HeaderComponent
  readonly loginPopupComponent: LoginPopupComponent

  constructor(page: Page) {
    this.headerComponent = new HeaderComponent(page)
    this.loginPopupComponent = new LoginPopupComponent(page)
  }
}
