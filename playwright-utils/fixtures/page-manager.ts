import type { Page } from '@playwright/test'
import { HeaderComponent } from '../pages/header-component'
import { LoginPopupComponent } from '../pages/login-popup-component'
import { HomePage } from '../pages/home-page'
import { BookingFormComponent } from '../pages/booking-form-component'
import { BookingSummaryPage } from '../pages/booking-summary-page'

export class PageManager {
  readonly headerComponent: HeaderComponent
  readonly loginPopupComponent: LoginPopupComponent
  readonly homePage: HomePage
  readonly bookingFormComponent: BookingFormComponent
  readonly bookingSummaryPage: BookingSummaryPage

  constructor(page: Page) {
    this.headerComponent = new HeaderComponent(page)
    this.loginPopupComponent = new LoginPopupComponent(page)
    this.homePage = new HomePage(page)
    this.bookingFormComponent = new BookingFormComponent(page)
    this.bookingSummaryPage = new BookingSummaryPage(page)
  }
}
