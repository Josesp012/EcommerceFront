import { Cliente } from "./cliente.model";


export interface Pedidos {
    idPedido: number | null;
    total: number;
    fechaCreacion: string;
    estadoPedido: number;
    idCliente: Cliente;
}

