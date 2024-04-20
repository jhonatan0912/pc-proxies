
import { Inject, Injectable, inject } from '@angular/core';
import { AppHttpService } from 'pc-core';
import { Observable, mergeMap, of } from 'rxjs';
import { CategoryDto } from './categories.proxies';
import { Environment } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class ProductsProxy {

  private http = inject(AppHttpService);

  constructor(@Inject('environment') private environment: Environment) { }

  get path(): string {
    return `${this.environment.api}/api/v1/products`;
  }

  create(image: File, name: string, price: number, description: string): Observable<ProductDto> {
    const form = new FormData();
    form.append('image', image);
    form.append('name', name);
    form.append('price', price.toString());
    form.append('description', description);

    return this.http.post(this.path, form).pipe(mergeMap((data: any) => of(new ProductDto().fromJS(data))));
  };

  get(id: string): Observable<ProductDto> {
    const url = `${this.path}/${id}`;
    return this.http.get(url).pipe(mergeMap((data: any) => of(new ProductDto().fromJS(data))));
  }

  getAll(page: number = 0, limit: number = 10): Observable<GetAllProductsResponseDto> {
    let url = this.path;
    if (page !== null && page !== undefined)
      url += `?page=${page}`;

    if (limit !== null && limit !== undefined)
      url += `&limit=${limit}`;

    return this.http.get(url).pipe(mergeMap((data: any) => of(new GetAllProductsResponseDto().fromJS(data))));
  }

  getForPrompt(): Observable<ProductDto[]> {
    const url = `${this.path}/history-prompt`;
    return this.http.get(url).pipe(mergeMap((data: any) => of(data.map((item: any) => new ProductDto().fromJS(item)))));
  }

  getPromotions(page: number = 0, limit: number = 30): Observable<GetAllProductsResponseDto> {
    let url = `${this.path}/promotions`;
    if (page !== null && page !== undefined)
      url += `?page=${page}`;

    if (limit !== null && limit !== undefined)
      url += `&limit=${limit}`;

    return this.http.get(url).pipe(mergeMap((data: any) => of(new GetAllProductsResponseDto().fromJS(data))));

  }

  getByCategory(idCategory: string, page: number = 1, limit: number = 30): Observable<GetAllProductsResponseDto> {
    let url = `${this.path}/get-by-category/${idCategory}`;
    if (page !== null && page !== undefined)
      url += `?page=${page}`;

    if (limit !== null && limit !== undefined)
      url += `&limit=${limit}`;

    return this.http.get(url).pipe(mergeMap((data: any) => of(new GetAllProductsResponseDto().fromJS(data))));
  }

  addCategory(id: string, categoryId: string): Observable<void> {
    const url = `${this.path}/add-category/${id}`;
    const body = {
      categoryId,
    };
    return this.http.update(url, body);
  }

  removeCategory(id: string, categoryId: string): Observable<void> {
    const url = `${this.path}/remove-category/${id}`;
    const body = {
      categoryId
    };
    return this.http.update(url, body);
  }

  updateImage(id: string, image: File | undefined): Observable<ProductDto> {
    const url = `${this.path}/update-image/${id}`;
    const form = new FormData();
    if (image)
      form.append('image', image);

    return this.http.update(url, form).pipe(mergeMap((data: any) => of(new ProductDto().fromJS(data))));
  }

  delete(id: string): Observable<void> {
    const url = `${this.path}/${id}`;

    return this.http.delete(url);
  }
}

export class GetAllProductsResponseDto {
  meta!: GetAllProductsResponseMetaDto;
  products!: ProductDto[];

  init(data: any): void {
    if (data) {
      this.meta = data.meta ? new GetAllProductsResponseMetaDto().fromJS(data.meta) : <any>undefined;
      this.products = data.products ? data.products.map((item: any) => new ProductDto().fromJS(item)) : [];
    }
  }

  fromJS(data: any): GetAllProductsResponseDto {
    data = typeof data === 'object' ? data : {};
    const result = new GetAllProductsResponseDto();
    result.init(data);
    return result;
  }
}

export class GetAllProductsResponseMetaDto {
  page!: number;
  limit!: number;
  total!: number;
  lastPage!: number;

  init(data: any): void {
    if (data) {
      this.page = data.page;
      this.limit = data.limit;
      this.total = data.total;
      this.lastPage = data.lastPage;
    }
  }

  fromJS(data: any): GetAllProductsResponseMetaDto {
    data = typeof data === 'object' ? data : {};
    const result = new GetAllProductsResponseMetaDto();
    result.init(data);
    return result;
  }
}

export class ProductDto {
  id?: string;
  image!: string;
  name!: string;
  price!: number;
  description!: string;
  categories!: CategoryDto[];
  quantity?: number | undefined;

  init(data: any): void {
    if (data) {
      this.id = data.id;
      this.image = data.image;
      this.name = data.name;
      this.price = data.price;
      this.description = data.description;

      this.categories = [];

      if (Array.isArray(data.categories)) {
        for (const item of data.categories) {
          this.categories.push(new CategoryDto().fromJS(item));
        }
      }
    }
  }

  fromJS(data: any): ProductDto {
    data = typeof data === 'object' ? data : {};
    const result = new ProductDto();
    result.init(data);
    return result;
  }
}