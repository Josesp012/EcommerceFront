import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { enviroment } from '../environments/environments';
import { Observable } from 'rxjs';
import { Producto } from '../models/producto.model';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  private apiUrl: string = enviroment.apiUrl + 'productos/';
  constructor(private http: HttpClient) { }

  getProductos(): Observable<Producto[]>{
    return this.http.get<Producto[]>(this.apiUrl);
  }

  createProducto(producto: Producto): Observable<Producto>{
    return this.http.post<Producto>(this.apiUrl, producto);
  }

  updateProducto(producto: Producto): Observable<Producto>{
    return this.http.put<Producto>(`${this.apiUrl}${producto.idProducto}`,producto);
  }

  deleteProducto(idProducto: number): Observable<Producto>{
    return this.http.delete<Producto>(`${this.apiUrl}${idProducto}`);
  }
}