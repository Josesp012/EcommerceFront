import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { enviroment } from '../environments/environments';
import { Observable } from 'rxjs';
import { Pedidos } from '../models/pedidos.model';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {

  private apiUrl: string = enviroment.apiUrl + 'pedidos/';
  constructor(private http: HttpClient) { }

  getPedidos(): Observable<Pedidos[]>{
    return this.http.get<Pedidos[]>(this.apiUrl);
  }

  updatePedido(pedido: Pedidos): Observable<Pedidos>{
    return this.http.put<Pedidos>(`${this.apiUrl}${pedido.idCliente}`,pedido);
  }

  deletePedido(idPedido: number): Observable<Pedidos>{
    return this.http.delete<Pedidos>(`${this.apiUrl}${idPedido}`);
  }
}
