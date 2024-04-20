import { Inject, Injectable, inject } from '@angular/core';
import { AppHttpService } from 'pc-core';
import { Observable, mergeMap, of } from 'rxjs';
import { Environment } from "./../interfaces";

@Injectable({
  providedIn: 'root',
})
export class AddressesProxy {

  private http = inject(AppHttpService);

  constructor(@Inject('environment') private environment: Environment) { }

  get path(): string {
    return `${this.environment.api}/api/v1/addresses`;
  }

  create(district: string, type: string, street: string, number: string, phone: string, reference: string): Observable<CreateAddressResponseDto> {
    const body = {
      district,
      type,
      street,
      number,
      phone,
      reference,
    };

    return this.http.post(this.path, body).pipe(mergeMap((data: any) => of(new CreateAddressResponseDto().fromJS(data))));
  }

  update(id: string, district: string, type: string, street: string, number: string, phone: string, reference: string,): Observable<AddressDto> {
    let url = `${this.path}/${id}`;
    const body = {
      district,
      type,
      street,
      number,
      phone,
      reference,
    };
    return this.http.update(url, body).pipe(mergeMap((data: any) => of(new AddressDto(data).fromJS(data))));
  };

  getAll(): Observable<AddressDto[]> {
    return this.http.get(this.path).pipe(mergeMap((data: any) => of(data.map((item: any) => new AddressDto(data).fromJS(item)))));
  };

  delete(id: string): Observable<DeleteResponseDto> {
    let url = `${this.path}/${id}`;
    return this.http.delete(url).pipe(mergeMap((data: any) => of(new DeleteResponseDto().fromJS(data))));
  }
}

export class AddressDto {
  id?: string;
  district!: string;
  type!: string;
  street!: string;
  number!: string;
  phone!: string;
  reference!: string;

  constructor(data: any) {
    if (data) {
      this.id = data.id ? data.id : <any>undefined;
      this.district = data.district;
      this.type = data.type;
      this.street = data.street;
      this.number = data.number;
      this.phone = data.phone;
      this.reference = data.reference;
    }
  }

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

  fromJS(data: any): AddressDto {
    data = typeof data === 'object' ? data : {};
    const result = new AddressDto(data);
    result.init(data);
    return result;
  }
}

export class CreateAddressResponseDto {
  data!: AddressDto;

  init(data: any): void {
    if (data) {
      this.data = new AddressDto(data.data).fromJS(data.data);
    }
  }

  fromJS(data: any): CreateAddressResponseDto {
    data = typeof data === 'object' ? data : {};
    const result = new CreateAddressResponseDto();
    result.init(data);
    return result;
  }
}

export class DeleteResponseDto {
  id!: string;
  msg!: string;

  init(data: any): void {
    if (data) {
      this.id = data.id;
      this.msg = data.msg;
    }
  };

  fromJS(data: any): DeleteResponseDto {
    data = typeof data === 'object' ? data : {};
    const result = new DeleteResponseDto();
    result.init(data);
    return result;
  }
}