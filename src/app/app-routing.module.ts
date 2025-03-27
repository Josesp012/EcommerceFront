import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientesComponent} from './components/clientes/clientes.component';
import { ProductoComponent } from './components/productos/productos.component';


const routes: Routes = [
  {path:'clientes',component: ClientesComponent},
  {path:'productos',component: ProductoComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
