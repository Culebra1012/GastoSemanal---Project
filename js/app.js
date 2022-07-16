//Variables y selectores
const formulario = document.querySelector('#agregar-gasto')
const gastoListado = document.querySelector('#gastos ul')




// Eventos
eventListener();
function eventListener(){
    document.addEventListener('DOMContentLoaded', preguntarPresupuesto )

    formulario.addEventListener('submit', agregarGasto)
}


// Clases
class Presupuesto {
    constructor(presupuesto){
        this.presupuesto = Number(presupuesto)
        this.restante = Number(presupuesto)
        this.gastos = []
    }
    nuevoGasto(gasto){
        this.gastos = [...this.gastos, gasto]
        this.calcularRestante()
        
    }
    calcularRestante() {
        const gastado = this.gastos.reduce((total, gasto) => total + gasto.cantidad, 0);
        this.restante = this.presupuesto - gastado;
    }
    eliminarGasto(id){
        this.gastos = this.gastos.filter(gasto => gasto.id !== id);
        this.calcularRestante();
    }

}
class UI {
    insertarPresupuesto(cantidad) {
        //Extrayendo los valores
        const { presupuesto, restante } = cantidad;

        //Agregar al HTML
        document.querySelector('#total').textContent = presupuesto
        document.querySelector('#restante').textContent = restante
    }

    imprimirAlerta(mensaje, tipo) {
        // Crear el div
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('text-center', 'alert');

        if(tipo === 'error'){
            divMensaje.classList.add('alert-danger')
        }else {
            divMensaje.classList.add('alert-success')
        }
        //Mensaje de error
        divMensaje.textContent = mensaje;

        //Insertar en el HTML el mensaje de error
        document.querySelector('.primario').insertBefore( divMensaje, formulario);

        //Quitar del HTML
        setTimeout(() => {
            divMensaje.remove()
        }, 3000);
    }

    mostrarGastos(gastos) {

        this.limpiarHTML(); //Elimina el HTML previo

        //Interar sobre los gastos
        gastos.forEach(gasto => {
            const {cantidad, nombre, id} = gasto; 

            //Crear un LI
            const nuevoGasto = document.createElement('li')
            nuevoGasto.className = 'list-group-item d-flex justify-content-between align-items-center'
            nuevoGasto.dataset.id = id


            //Agregar en el HTML el gasto
            nuevoGasto.innerHTML = `${nombre} <span class="badge badge-primary badge-pill">$ ${cantidad}</span>`;

            //boton para borrar en gasto
            const btnBorrar = document.createElement('button')
            btnBorrar.innerHTML = 'Borrar &times;'
            btnBorrar.classList.add('btn', 'btn-danger', 'borarr-gasto')
            btnBorrar.onclick = () => {
                eliminarGasto(id);
            }
            nuevoGasto.appendChild(btnBorrar)

            //Agregar en el HTML
            gastoListado.appendChild(nuevoGasto)
        })
    }

    limpiarHTML() {
        while(gastoListado.firstChild) {
            gastoListado.removeChild(gastoListado.firstChild);
        }
    }
    actualizarRestante(restante){
        document.querySelector('#restante').textContent = restante;     
    }
    comprobarPresupuesto(presupuestoObj){
        const {presupuesto, restante } = presupuestoObj

        const restanteDiv = document.querySelector('.restante')

        //Comprobar 25% de los gastos
        if((presupuesto / 4 ) > restante ){
            restanteDiv.classList.remove('alert-success', 'alert-warning')
            restanteDiv.classList.add('alert-danger')
        }else if ((presupuesto / 2 ) > restante ){
            restanteDiv.classList.remove('alert-success')
            restanteDiv.classList.add('alert-warning')
        }

        if(restante <= 0) {
            ui.imprimirAlerta('El presupesto se agoto', 'error')
            formulario.querySelector('button[type="submit"').disabled = true
        }else {
            restanteDiv.classList.remove('alert-danger', 'alert-warning')
            restanteDiv.classList.add('alert-success')    
        }
    }
}
//Instanciar
const ui = new UI()
let presupuesto



//Funciones


///VALIDACIONES 
function preguntarPresupuesto(){
    const presupuestoUsuario = prompt('¿Cual es tu presupuesto?')

    console.log(Number(presupuestoUsuario))

    if(presupuestoUsuario === '' || presupuestoUsuario === null || isNaN(presupuestoUsuario || presupuestoUsuario <= 0)){
        window.location.reload()
    }

    presupuesto = new Presupuesto(presupuestoUsuario);

    ui.insertarPresupuesto(presupuesto)
}

//Añade gastos


function agregarGasto(e){

    e.preventDefault()


    //Leer los datos del formulario
    const nombre = document.querySelector('#gasto').value
    const cantidad = Number(document.querySelector('#cantidad').value)


    //validar
    if(nombre === '' || cantidad === ''){
        ui.imprimirAlerta('Ambos campos son obligatorios', 'error');

        return
    }else if ( cantidad <= 0 || isNaN(cantidad)){
        ui.imprimirAlerta('Cantidad no valida', 'error')

        return;
    }

    //Generar un objeto con el gasto

    const gasto = {nombre, cantidad, id: Date.now()}

    //Añade un nuevo gasto
    presupuesto.nuevoGasto(gasto)

    //Mensaje del gatos agregado
    ui.imprimirAlerta('Gasto agregado correctamente')

    //imiprimir los gastos
    const {gastos, restante} = presupuesto
    ui.mostrarGastos(gastos);

    ui.actualizarRestante(restante);

    ui.comprobarPresupuesto(presupuesto);
    //Reiniciar el formulario
    formulario.reset()
}

function eliminarGasto(id){

    presupuesto.eliminarGasto(id)

    //Elimina los gastos del HTML
    const {gastos, restante} = presupuesto
    ui.mostrarGastos(gastos)

    ui.actualizarRestante(restante);

    ui.comprobarPresupuesto(presupuesto);
}