import { Component, OnInit } from '@angular/core';
import { Cliente } from '../../models/cliente.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { ClienteService } from '../../services/cliente.service';

@Component({
  selector: 'app-clientes',
  standalone: false,
  templateUrl: './clientes.component.html',
  styleUrl: './clientes.component.css'
})
export class ClientesComponent implements OnInit{

  clientes: Cliente[] = [];
  clienteForm: FormGroup;
  showForm: boolean = false;
  textoModel: string = "Nuevo Cliente";
  isEditModel: boolean = false;
  selectedCliente: Cliente | null = null;

  constructor(
    private clienteService: ClienteService,
    private formBuilder: FormBuilder
  ){
    this.clienteForm= this.formBuilder.group({
      idCliente:[null] ,
        nombre: ['',Validators.required],
        apellido: ['',Validators.required],
        email: ['',[Validators.required, Validators.email]],
        telefono: ['',[Validators.required]],
        direccion: ['',[Validators.required]],
    }) 
  }

  ngOnInit():void{
    this.loadClientes();
    }

  loadClientes(): void{
    this.clienteService.getClientes().subscribe({
    next: (data) =>{
    this.clientes = data;
  },
  error: (error) => {
    console.error('Error al cargar clientes:', error);
  }
  });
}

toggleForm(): void{
  this.showForm = !this.showForm;
  this.textoModel = "Nuevo cliente";
  this.isEditModel = false;
  this.selectedCliente = null;
  this.clienteForm.reset();
  
}

  onSubmit(): void{
  if (this.clienteForm.invalid) {
    return;
  }

    const clienteData: Cliente = this.clienteForm.value;
    if(this.isEditModel){
      this.clienteService.updateCliente(clienteData).subscribe({
        next: (updateCliente) =>{
          const index = this.clientes.findIndex(a => a.idCliente === clienteData.idCliente);
          if(index !== -1){
              this.clientes[index] = updateCliente;
          }
          Swal.fire({
            title: "Cliente " + updateCliente.nombre + " actualizada",
            text: "El cliente fue actualizada exitosamente",
            icon: "success"
  
          });
          this.showForm = false;
          this.clienteForm.reset();
      },
      error: (error) =>{
        this.mostrarErrores(error);
      }
    
      })
    }else{
      this.clienteService.createCliente(clienteData).subscribe({
        next: (newCliente)=>{
          Swal.fire({
            title: "Cliente " + newCliente.nombre + " creado" ,
            text: "El Cliente fue creado exitosamente",
            icon: "success"
        });
  this.clientes.push(newCliente);
    }
  })
  }
  this.showForm = false;
  this.clienteForm.reset();
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

  editCliente(cliente: Cliente){
    this.selectedCliente = cliente;
    this.textoModel = "Editando Cliente " + cliente.nombre;
    this.isEditModel = true;
    this.showForm = true;

    this.clienteForm.patchValue({ 
      id: cliente.idCliente ,
      nombre: cliente.nombre,
      apellido: cliente.apellido,
      email: cliente.email,
      telefono: cliente.telefono,
      direccion: cliente.direccion,
  });  

}

deleteCliente(idCliente: number){  
  Swal.fire({
  title: "Eliminar Cliente",
  text: "ESTAS SEGURO DE QUERER ELIMINAR?",
  icon: "question",
  showConfirmButton: true,
  showCancelButton: true
}).then(resp=>{
  if(resp.isConfirmed){
    this.clienteService.deleteCliente(idCliente).subscribe({
      next: (deleteCliente) => {
        this.clientes =this.clientes.filter(a => a.idCliente !== idCliente);
        Swal.fire({
          title: "Cliente eliminado",
          text: "El Cliente fue eliminado exitosamente",
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