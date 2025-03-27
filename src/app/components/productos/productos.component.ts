import { Component,  OnInit} from '@angular/core';
import { Producto } from '../../models/producto.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { ProductoService } from '../../services/producto.service';

@Component({
  selector: 'app-productos',
  standalone: false,
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.css'
})
export class ProductoComponent implements OnInit{

  productos: Producto[] = [];
  productoForm: FormGroup;
  showForm: boolean = false;
  textoModel: string = "Nuevo Producto";
  isEditModel: boolean = false;
  selectedProducto: Producto | null = null;

  constructor(
    private productoService: ProductoService,
    private formBuilder: FormBuilder
  ) {
    this.productoForm= this.formBuilder.group({
      idProducto:[null] ,
        nombre: ['',[Validators.required, Validators.maxLength(50)]],
        descripcion: ['',[Validators.required, Validators.maxLength(50)]],
        precio: ['',[Validators.required ]],
        stock: ['',[Validators.required]],
    }) 
  }

  ngOnInit():void{
    this.loadProductos();
    }
 
loadProductos(): void{
  this.productoService.getProductos().subscribe({
  next: (data) =>{
  this.productos = data;
  },
  error: (error) => {
    console.error('Error al cargar productos:', error);
  }
  });
}

toggleForm(): void{
  this.showForm = !this.showForm;
  this.textoModel = "Nuevo producto";
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
          const index = this.productos.findIndex(a => a.idProducto === productoData.idProducto);
          if(index !== -1){
              this.productos[index] = updateProducto;
          }
          Swal.fire({
            title: "Producto" + updateProducto.nombre + " actualizada",
            text: "El producto fue actualizado exitosamente",
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
            title: "producto " + newProducto.nombre + " creado" ,
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

  editProducto(producto: Producto){
    this.selectedProducto = producto;
    this.textoModel = "Editando Producto " + producto.nombre;
    this.isEditModel = true;
    this.showForm = true;

    this.productoForm.patchValue({ 
      id: producto.idProducto ,
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: producto.precio,
      stock: producto.stock,
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
        this.productos =this.productos.filter(a => a.idProducto !== idProducto);
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