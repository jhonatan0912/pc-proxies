import { Inject, Injectable, inject } from '@angular/core';
import { AppHttpService } from 'pc-core';
import { Observable, map } from 'rxjs';
import { DeliveryType, OrderStatus, PaymentMethod, formatOrderStatus } from './orders.proxie';
import { ProductDto } from './products.proxie';
import { Environment } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class AdminProxy {

  private http = inject(AppHttpService);

  constructor(@Inject('environment') private environment: Environment) { }

  get path(): string {
    return `${this.environment.api}/api/v1/admin`;
  }

  login(username: string, password: string): Observable<LoginDto> {
    const url = `${this.path}/login`;
    const body = {
      username,
      password
    };
    return this.http.post(url, body).pipe(map((data: any) => new LoginDto().fromJS(data)));
  }

  getOrders(): Observable<AdminGetOrderDto[]> {
    const url = `${this.path}/orders`;
    return this.http.get(url).pipe(map((data: any) => data.map((i: any) => new AdminGetOrderDto().fromJS(i))));
  }

  getProducts(): Observable<ProductDto[]> {
    const url = `${this.path}/products`;
    return this.http.get(url).pipe(map((data: any) => data.map((i: any) => new ProductDto().fromJS(i))));
  }

  changeOrderStatus(orderId: string, status: OrderStatus): Observable<void> {
    const path = `${this.path}/update-order-status`;
    const body = {
      orderId,
      status
    };

    return this.http.update(path, body);
  }
}

export class LoginDto {
  username!: string;
  token!: string;

  init(data: any): void {
    if (data) {
      this.username = data.username;
      this.token = data.token;
    }
  }

  fromJS(data: any): LoginDto {
    data = typeof data === 'object' ? data : {};
    const result = new LoginDto();
    result.init(data);
    return result;
  };
}

export class AdminGetOrderDto {
  id!: string;
  user!: GetOrdersResponseUserDto;
  products!: GetOrdersResponseProductDto[];
  createdAt!: Date;
  status!: OrderStatus;
  address!: GetOrdersResponseAddressDto;
  formatedStatus!: string;
  deliveryType!: DeliveryType;
  formatedDeliveryType!: string;
  paymentMethod!: PaymentMethod;
  formatedPaymentMethod!: string;
  total!: number;

  init(data: any): void {
    if (data) {
      this.id = data.id;
      this.user = data.user ? new GetOrdersResponseUserDto().fromJS(data.user) : <any>undefined;
      this.products = data.products ? data.products.map((i: any) => new GetOrdersResponseProductDto().fromJS(i)) : [];
      this.createdAt = data.createdAt;
      this.status = data.status;
      this.address = data.address ? new GetOrdersResponseAddressDto().fromJS(data.address) : <any>undefined;
      this.formatedStatus = formatOrderStatus(data.status);
      this.deliveryType = data.deliveryType;
      this.formatedDeliveryType = data.deliveryType === 'delivery' ? 'Delivery' : 'Recojo en tienda';
      this.paymentMethod = data.paymentMethod;
      this.formatedPaymentMethod = data.paymentMethod === 'cash' ? 'Efectivo' : 'Tarjeta';
      this.total = data.total;
    }
  }

  fromJS(data: any): AdminGetOrderDto {
    data = typeof data === 'object' ? data : {};
    const result = new AdminGetOrderDto();
    result.init(data);
    return result;
  }
}

export class GetOrdersResponseUserDto {
  name!: string;
  email!: string;
  phone!: string;

  init(data: any): void {
    if (data) {
      this.name = data.name;
      this.email = data.email;
      this.phone = data.phone;
    }
  }

  fromJS(data: any): GetOrdersResponseUserDto {
    data = typeof data === 'object' ? data : {};
    const result = new GetOrdersResponseUserDto();
    result.init(data);
    return result;
  }
}

export class GetOrdersResponseProductDto {
  image!: string;
  name!: string;
  quantity!: number;
  price!: number;

  init(data: any): void {
    if (data) {
      this.image = data.image;
      this.name = data.name;
      this.quantity = data.quantity;
      this.price = data.price;
    }
  }

  fromJS(data: any): GetOrdersResponseProductDto {
    data = typeof data === 'object' ? data : {};
    const result = new GetOrdersResponseProductDto();
    result.init(data);
    return result;
  }
}

export class GetOrdersResponseAddressDto {
  id!: string;
  district!: string;
  type!: string;
  street!: string;
  number!: string;
  phone!: string;
  reference!: string;

  init(data: any): void {
    if (data) {
      this.id = data.id;
      this.district = data.district;
      this.type = data.type;
      this.street = data.street;
      this.number = data.number;
      this.phone = data.phone;
      this.reference = data.reference;
    }
  }

  fromJS(data: any): GetOrdersResponseAddressDto {
    data = typeof data === 'object' ? data : {};
    const result = new GetOrdersResponseAddressDto();
    result.init(data);
    return result;
  }
}