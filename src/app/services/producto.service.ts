import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { enviroment } from '../environments/environments';
import { Cliente } from '../models/cliente.model';
import { Observable } from 'rxjs';
import { ProductosComponent } from '../components/productos/productos.component';
import { Producto } from '../models/producto.model';

@Injectable({
  providedIn: 'root'
})
export class ProductosComponentService {

  private apiUrl: string = enviroment.apiUrl + 'productos/';
  constructor(private http: HttpClient) { }

  getPrdocuto(): Observable<Producto[]>{
    return this.http.get<Producto[]>(this.apiUrl);
  }

  createProducto(cliente: Producto): Observable<Producto>{
    return this.http.post<Producto>(this.apiUrl, cliente);
  }

  updateProducto(Producto: Producto): Observable<Producto>{
    return this.http.put<Producto>(${this.apiUrl}${Producto.id},Producto);
  }

  deleteProdcuto(idProdcuto: number): Observable<Producto>{
    return this.http.delete<Cliente>(${this.apiUrl}${idProdcuto});
  }
}