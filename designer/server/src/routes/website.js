/**
 * Enum for user roles.
 * @readonly
 * @enum {string}
 */
export const WebsiteLevel1Routes = {
  ABOUT: '/about',
  GET_STARTED: '/get-started',
  FEATURES: '/features',
  RESOURCES: '/resources',
  SUPPORT: '/support'
}

export const pageNavigationBase = [
  {
    href: WebsiteLevel1Routes.ABOUT,
    text: 'About'
  },
  {
    href: WebsiteLevel1Routes.GET_STARTED,
    text: 'Get started'
  },
  {
    href: WebsiteLevel1Routes.FEATURES,
    text: 'Features'
  },
  {
    href: WebsiteLevel1Routes.RESOURCES,
    text: 'Resources'
  },
  {
    href: WebsiteLevel1Routes.SUPPORT,
    text: 'Support'
  }
]
