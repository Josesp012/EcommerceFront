import { Component } from '@angular/core';
import { Prodcutos } from '../../models/producto.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { ProductosService } from '../../services/producto.service';
import { Producto } from '../../models/producto.model';

@Component66({
  selector: 'app-productos',
  standalone: false,
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.css'
})
export class ProductosComponent {

  productos: Producto[] = [];
  productoForm: FormGroup;
  showForm: boolean = false;
  textoModel: string = "Nuevo Producto";
  isEditModel: boolean = false;
  selectedProducto: Prodcutos | null = null;

  constructor(
    private productoService: ProductosService,
    private formBuilder: FormBuilder
  ) {
    this.productoForm= this.formBuilder.group({
      id:[null] ,
        nombre: ['',[Validators.required, Validators.maxLength(50)]],
        descripcion: ['',[Validators.required, Validators.maxLength(50)]],
        precio: ['',[Validators.required ]],
        sto: ['',[Validators.required]],
    }) 
  }

  ngOnInit():void{
    this.loadProductos();
    }

loadClientes(): void{
  this.productoService.getProducto().subscribe({
  next: data =>{
  this.productos = data;
  }
  })
}

toggleForm(): void{
  this.showForm = !this.showForm;
  this.textoModel = "Nuevo prodcucto";
  this.isEditModel = false;
  this.selectedProducto = null;
  this.productoForm.reset();
  
}

onSubmit(): void{
  if (this.productoForm.invalid) {
    return;
  }

const productoData: Producto = this.productoForm.value;
    if(this.isEditModel){
      this.productoService.updateProducto(productoData).subscribe({
        next: (updateProducto) =>{
          const index = this.producto.findIndex(a => a.id === productosData.id);
          if(index !== -1){
              this.productos[index] = updateProducto;
          }
          Swal.fire({
            title: "Producto" + updateProducto.nombre + " actualizada",
            text: "El cliente fue actualizada exitosamente",
            icon: "success"
  
          });
          this.showForm = false;
          this.productoForm.reset();
      },
      error: (error) =>{
        this.mostrarErrores(error);
      }
    
      })
    }else{
      this.productoService.createProducto(productoData).subscribe({
        next: (newProducto)=>{
          Swal.fire({
            title: "producto " + newProducto.nombre + " creada" ,
            text: "El Producto fue creado exitosamente",
            icon: "success"
        });
  this.productos.push(newProducto);
    }
  })
  }
  this.showForm = false;
  this.productoForm.reset();
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

  editProducto(Producto: Producto){
    this.selectedProducto = Producto;
    this.textoModel = "Editando Producto " + Producto.nombre;
    this.isEditModel = true;
    this.showForm = true;

    this.productoForm.patchValue({ 
      id: Producto.id ,
      nombre: Producto.nombre,
      descripcion: Producto.descripcion,
      precio: Producto.precio,
      stock: Prodcutos.stock,
  });  

}

deleteProducto(idProducto: number){  
  Swal.fire({
  title: "Eliminar Producto",
  text: "ESTAS SEGURO DE QUERER ELIMINAR?",
  icon: "question",
  showConfirmButton: true,
  showCancelButton: true
}).then(resp=>{
  if(resp.isConfirmed){
    this.productoService.deleteProducto(idProducto).subscribe({
      next: (deleteProducto) => {
        this.Producto =this.Producto.filter(a => a.id !== idProducto);
        Swal.fire({
        title: "Producto eliminada",
        text: "El Producto fue eliminado exitosamente",
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