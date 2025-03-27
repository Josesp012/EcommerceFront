import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Pedidos } from '../../models/pedidos.model';
import { PedidoService } from '../../services/pedido.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pedidos',
  standalone: false,
  templateUrl: './pedidos.component.html',
  styleUrl: './pedidos.component.css'
})
export class PedidosComponent{

  pedidos: Pedidos[] = [];
  pedidoForm: FormGroup;
  showForm: boolean = false;
  textoModel: string = "Nuevo Pedido";
  isEditModel: boolean = false;
  selectedPedidos: Pedidos | null = null;

  constructor(private pedidoService: PedidoService,
    private formBuilder: FormBuilder
  ){
    this.pedidoForm= this.formBuilder.group({
      idPedido:[null] ,
      total: ['',Validators.required],
      fechaCreacion: ['',Validators.required],
      estadoPedido: ['',[Validators.required, Validators.email]],
      idCliente: ['',[Validators.required]],
  
    }) 
  }

  ngOnInit():void{
    this.loadPedidos();
    }

    loadPedidos(): void{
    this.pedidoService.getPedidos().subscribe({
    next: (data) =>{
    this.pedidos = data;
  },
  error: (error) => {
    console.error('Error al cargar pedidos:', error);
  }
  });
}

toggleForm(): void{
  this.showForm = !this.showForm;
  this.textoModel = "Nuevo Pedido";
  this.isEditModel = false;
  this.selectedPedidos = null;
  this.pedidoForm.reset();
}

  mostrarErrores(errorResponse: any): void{
      if(errorResponse && errorResponse.error){
        let errores = errorResponse.error;
        let mensajeErrores = "";
        for(let campo in errores){
            if(errores.hasOwnProperty(campo)){
              mensajeErrores += errores[campo];
            }
        }
        Swal.fire({
          title: "Errores encontrados",
          text: mensajeErrores.trim(),
          icon: "error"
        });
      }
    } 

  editPedido(pedido: Pedidos){
      this.selectedPedidos = pedido;
      this.textoModel = "Editando Pedido " + pedido.idPedido;
      this.isEditModel = true;
      this.showForm = true;
  
      this.pedidoForm.patchValue({ 
        id: pedido.idPedido ,
        total: pedido.total,
        fechaCreacion: pedido.fechaCreacion,
        estadoPedido: pedido.estadoPedido,
        idCliente: pedido.idCliente,
    });  
  }

deletePedido(idPedido: number){  
  Swal.fire({
  title: "Eliminar Pedidos",
  text: "ESTAS SEGURO DE QUERER ELIMINAR?",
  icon: "question",
  showConfirmButton: true,
  showCancelButton: true
}).then(resp=>{
  if(resp.isConfirmed){
    this.pedidoService.deletePedido(idPedido).subscribe({
      next: (deletePedido) => {
        this.pedidos =this.pedidos.filter(a => a.idPedido !== idPedido);
        Swal.fire({
          title: "Pedido eliminado",
          text: "El Pedido fue eliminado exitosamente",
          icon: "success"
      });
        
      },
      error: (error) =>{
        this.mostrarErrores(error)
      }
    })
  }
})
}


}
