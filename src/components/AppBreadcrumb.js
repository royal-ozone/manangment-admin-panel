import React from 'react'
import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next';

import routes from '../routes'

import { CBreadcrumb, CBreadcrumbItem } from '@coreui/react'
import cookie from 'react-cookies'

const AppBreadcrumb = () => {
  const currentLocation = useLocation().pathname

  const getRouteName = (pathname, routes) => {
    cookie.save(`current_path${sessionStorage.tabID}`, pathname, {path: '/'})
    const currentRoute = routes.find((route) => route.path === pathname) ?? routes.find((route) => route.path === "*")
    return currentRoute.name
  }

  const getBreadcrumbs = (location) => {
    const breadcrumbs = []
    location.split('/').reduce((prev, curr, index, array) => {
      const currentPathname = `${prev}/${curr}`
      breadcrumbs.push({
        pathname: currentPathname,
        name: getRouteName(currentPathname, routes),
        active: index + 1 === array.length ? true : false,
      })
      return currentPathname
    })
    return breadcrumbs
  }

  const breadcrumbs = getBreadcrumbs(currentLocation)

  return (
    <CBreadcrumb className="m-0 ms-2">
      <CBreadcrumbItem href="/">{'Home'}</CBreadcrumbItem>
      {breadcrumbs.map((breadcrumb, index) => {
        return (
          <CBreadcrumbItem
            {...(breadcrumb.active ? { active: true } : { href: breadcrumb.pathname })}
            key={index}
          >
            {breadcrumb.name}
          </CBreadcrumbItem>
        )
      })}
    </CBreadcrumb>
  )
}

export default React.memo(AppBreadcrumb)
