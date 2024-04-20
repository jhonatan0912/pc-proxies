import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { AddressesProxy, AdminProxy, AuthProxy, CategoriesProxy, OrdersProxy, ProductsProxy } from '../proxies';
import { Environment } from '../interfaces';


export const provideProxies = (environment: Environment): EnvironmentProviders => {
  return makeEnvironmentProviders([
    { provide: 'environment', useValue: environment },
    AddressesProxy,
    AdminProxy,
    AuthProxy,
    CategoriesProxy,
    OrdersProxy,
    ProductsProxy
  ]);
};