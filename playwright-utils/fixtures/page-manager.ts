import type { Page } from '@playwright/test'
import { HeaderComponent } from '../pages/header-component'
import { HomePage } from '../pages/home-page'
import { OurCarsPage } from '../pages/our-cars-page'
import { AboutUsPage } from '../pages/about-us-page'
import { BookingPage } from '../pages/booking-page'
import { BookingTermsPage } from '../pages/booking-terms-page'
import { PaymentPage } from '../pages/payment-page'
import { ProfilePage } from '../pages/profile-page'
import { AdminHomePage } from '../pages/admin-home-page'
import { AdminCarsPage } from '../pages/admin-cars-page'
import { AdminBookingsPage } from '../pages/admin-bookings-page'

export class PageManager {
  readonly headerComponent: HeaderComponent
  readonly homePage: HomePage
  readonly ourCarsPage: OurCarsPage
  readonly aboutUsPage: AboutUsPage
  readonly bookingPage: BookingPage
  readonly bookingTermsPage: BookingTermsPage
  readonly paymentPage: PaymentPage
  readonly profilePage: ProfilePage
  readonly adminHomePage: AdminHomePage
  readonly adminCarsPage: AdminCarsPage
  readonly adminBookingsPage: AdminBookingsPage

  constructor(page: Page) {
    this.headerComponent = new HeaderComponent(page)
    this.homePage = new HomePage(page)
    this.ourCarsPage = new OurCarsPage(page)
    this.aboutUsPage = new AboutUsPage(page)
    this.bookingPage = new BookingPage(page)
    this.bookingTermsPage = new BookingTermsPage(page)
    this.paymentPage = new PaymentPage(page)
    this.profilePage = new ProfilePage(page)
    this.adminHomePage = new AdminHomePage(page)
    this.adminCarsPage = new AdminCarsPage(page)
    this.adminBookingsPage = new AdminBookingsPage(page)
  }
}
