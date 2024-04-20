import { Inject, Injectable, inject } from '@angular/core';
import { AppHttpService } from 'pc-core';
import { Observable, mergeMap, of } from 'rxjs';
import { Environment } from '../interfaces';

export type OrderStatus = 'pending' | 'progress' | 'completed' | 'canceled';
export type DeliveryType = 'delivery' | 'pickup';
export type PaymentMethod = 'cash' | 'card';

@Injectable({
  providedIn: 'root'
})
export class OrdersProxy {
  private http = inject(AppHttpService);

  constructor(@Inject('environment') private environment: Environment) { }

  get path(): string {
    return `${this.environment.api}/api/v1/orders`;
  }

  create(products: CreateOrderDto[], addressId: string, deliveryType: DeliveryType, paymentMethod: PaymentMethod | null): Observable<GetOrderDto> {
    const body = {
      products: products,
      addressId: addressId,
      deliveryType: deliveryType,
      paymentMethod: paymentMethod
    };

    return this.http.post(`${this.path}`, body).pipe(mergeMap((data: any) => of(new GetOrderDto().fromJS(data))));
  };

  get(id: string): Observable<OrderDetailDto> {
    return this.http.get(`${this.path}/${id}`).pipe(mergeMap((data: any) => of(new OrderDetailDto().fromJS(data))));
  }

  getAll(): Observable<GetOrderDto[]> {
    return this.http.get(this.path).pipe(mergeMap((data: any) => of(data.map((i: any) => new GetOrderDto().fromJS(i)))));
  }
}

export class CreateOrderDto {
  id!: string;
  quantity!: number;

  init(data: any): void {
    if (data) {
      this.id = data.id;
      this.quantity = data.quantity;
    }
  }

  fromJS(data: any): CreateOrderDto {
    data = typeof data === 'object' ? data : {};
    const result = new CreateOrderDto();
    result.init(data);
    return result;
  }
}

export class CreateOrderResponseDto {
  user!: CreateOrderResponseUserDto;
  products!: CreateOrderDto[];
  total!: number;

  init(data: any): void {
    if (data) {
      this.user = data.user;
      this.products = data.products;
      this.total = data.total;
    }
  }

  fromJS(data: any): CreateOrderResponseDto {
    data = typeof data === 'object' ? data : {};
    const result = new CreateOrderResponseDto();
    result.init(data);
    return result;
  }
}

export class CreateOrderResponseUserDto {
  fullName!: string;
  email!: string;

  init(data: any): void {
    if (data) {
      this.fullName = data.fullName;
      this.email = data.email;
    }
  }

  fromJS(data: any): CreateOrderResponseUserDto {
    data = typeof data === 'object' ? data : {};
    const result = new CreateOrderResponseUserDto();
    result.init(data);
    return result;
  }
}

export class GetOrderDto {
  id!: string;
  createdAt!: Date;
  status!: OrderStatus;
  formatedStatus!: string;

  init(data: any): void {
    if (data) {
      this.id = data.id;
      this.createdAt = data.createdAt;
      this.status = data.status;
      this.formatedStatus = formatOrderStatus(data.status);
    }
  }

  fromJS(data: any): GetOrderDto {
    data = typeof data === 'object' ? data : {};
    const result = new GetOrderDto();
    result.init(data);
    return result;
  }
}

export class OrderDetailDto {
  id!: string;
  user!: OrderDetailUserDto;
  products!: OrderDetailProductDto[];
  address!: OrderDetailAddressDto;
  createdAt!: Date;
  status!: OrderStatus;
  formatedStatus!: string;
  deliveryType!: DeliveryType;
  formatedDeliveryType!: string;
  paymentMethod!: PaymentMethod;
  formatedPaymentMethod!: string;
  total!: number;

  init(data: any): void {
    if (data) {
      this.id = data.id;
      this.user = data.user ? new OrderDetailUserDto().fromJS(data.user) : <any>undefined;
      this.products = data.products ? data.products.map((i: any) => new OrderDetailProductDto().fromJS(i)) : <any>undefined;
      this.address = data.address ? new OrderDetailAddressDto().fromJS(data.address) : <any>undefined;
      this.createdAt = data.createdAt;
      this.status = data.status;
      this.formatedStatus = formatOrderStatus(data.status);
      this.deliveryType = data.deliveryType;
      this.formatedDeliveryType = data.deliveryType === 'delivery' ? 'Delivery' : 'Recojo en tienda';
      this.paymentMethod = data.paymentMethod;
      this.formatedPaymentMethod = data.paymentMethod === 'cash' ? 'Efectivo' : 'Tarjeta';
      this.total = data.total;
    }
  }

  fromJS(data: any): OrderDetailDto {
    data = typeof data === 'object' ? data : {};
    const result = new OrderDetailDto();
    result.init(data);
    return result;
  }
}

export class OrderDetailUserDto {
  fullName!: string;
  email!: string;

  init(data: any): void {
    if (data) {
      this.fullName = data.fullName;
      this.email = data.email;
    }
  }

  fromJS(data: any): OrderDetailUserDto {
    data = typeof data === 'object' ? data : {};
    const result = new OrderDetailUserDto();
    result.init(data);
    return result;
  }
}

export class OrderDetailProductDto {
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

  fromJS(data: any): OrderDetailProductDto {
    data = typeof data === 'object' ? data : {};
    const result = new OrderDetailProductDto();
    result.init(data);
    return result;
  }
}

export class OrderDetailAddressDto {
  district!: string;
  type!: string;
  street!: string;
  number!: string;
  phone!: string;
  reference!: string;

  init(data: any): void {
    if (data) {
      this.district = data.district;
      this.type = data.type;
      this.street = data.street;
      this.number = data.number;
      this.phone = data.phone;
      this.reference = data.reference;
    }
  }

  fromJS(data: any): OrderDetailAddressDto {
    data = typeof data === 'object' ? data : {};
    const result = new OrderDetailAddressDto();
    result.init(data);
    return result;
  }
}

export const formatOrderStatus = (status: OrderStatus): string => {
  return status === 'pending'
    ? 'Pendiente' : status === 'progress'
      ? 'En preparación' : status === 'completed'
        ? 'Completado' : 'Cancelado';
};