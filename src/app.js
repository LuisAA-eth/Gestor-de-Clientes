class SistemaGestionClientes {
    
    
    clientes = [];

    
    agregarCliente(cliente) {
        if (this.clientes.some(c => c.email === cliente.email)) {
            console.log(`El cliente ya existe`);
        } else {
            this.clientes.push(cliente);
            console.log(`Se ha agregado un nuevo cliente.`);
        }
    }

    eliminarCliente(email) {
        // Filtrar la lista para remover el cliente con el email dado
        const clienteEliminado = this.clientes.find(cliente => cliente.email === email);
        if (clienteEliminado) {
            this.clientes = this.clientes.filter(cliente => cliente.email !== email);
            console.log(`El cliente con email: ${clienteEliminado.email} ha sido eliminado.`);
        } else {
            console.log(`No se encontró ningún cliente con el email ${email}`);
        }
    }

    buscarClientePorEmail(email) {
        let cliente =  this.clientes.find(cliente => cliente.email === email);
        if (cliente) {
            console.log(cliente);
            return cliente;
        } else {
            console.log(`No se encontró ningún cliente con el email ${email}`);
            return null;
        }
    }

    getClientes(){

        return this.clientes;
    }



}




 class Cliente {
     

    nombre;
    email;
    tipoSuscripcion;
    fechaInicio;
    fechaVencimiento;

    constructor(nombre, email, tipoSuscripcion,fechaInicio , fechaVencimiento) {
        this.nombre = nombre;
        this.email = email;
        this.tipoSuscripcion = tipoSuscripcion;
        this.fechaInicio = fechaInicio;
        this.fechaVencimiento = fechaVencimiento;
        this.estadoSuscripcion = "Activa";
    }

 


    renovarSubscripcion(pagoRealizado) {
        if (pagoRealizado) {
            // Actualiza la fecha de vencimiento extendiéndola por un mes adicional
            const fechaActual = new Date(this.fechaVencimiento);
            fechaActual.setMonth(fechaActual.getMonth() + 1);
            this.fechaVencimiento = fechaActual.toISOString().slice(0, 10);  // Asegura formato de fecha adecuado

            this.estadoSuscripcion = "Activa";
            console.log(`La suscripción de ${this.nombre} se ha renovado correctamente hasta ${this.fechaVencimiento}.`);
        } else {
            this.estadoSuscripcion = "Vencida";
            console.log(`La suscripción de ${this.nombre} está vencida.`);
        }
    }

    verificarEstadoSuscripcion() {
        const hoy = new Date();
        const fechaVencimientoDate = new Date(this.fechaVencimiento);
        const diasRestantes = Math.ceil((fechaVencimientoDate - hoy) / (1000 * 60 * 60 * 24));
    
        let mensaje = "";
    
        if (hoy > this.fechaVencimientoDate) {
            this.estadoSuscripcion = "Vencida";
            mensaje = `La suscripción de ${this.nombre} está vencida.`;
        } else if (diasRestantes === 5) {
            mensaje = `¡Atención! A ${this.nombre} con email ${this.email} le faltan 5 días para que su suscripción se venza.`;
        } else if (diasRestantes === 3) {
            mensaje = `¡Atención! A ${this.nombre} con email ${this.email} le faltan 3 días para que su suscripción se venza.`;
        } else if (diasRestantes === 1) {
            mensaje = `¡Atención! A ${this.nombre} con email ${this.email} le falta 1 día para que su suscripción se venza.`;
        }
    
        console.log(mensaje);

        return console.log(`El estado de la suscripcion es: ${this.estadoSuscripcion}`);
    }
}




// Ejemplo de uso
/*const sistema = new SistemaGestionClientes(); 

const cliente = new Cliente();

const cliente1 = new Cliente("Juan", "juan@example.com", new Date());
const cliente2 = new Cliente("María", "maria@example.com", new Date());
const cliente3 = new Cliente("Luis", "luis@example.com", new Date());
const cliente4 = new Cliente("Jose", "jose@example.com", new Date());


console.log(cliente1);

sistema.agregarCliente(cliente1);
sistema.agregarCliente(cliente2);
sistema.agregarCliente(cliente3);
sistema.agregarCliente(cliente4);


sistema.eliminarCliente(cliente1.email);

sistema.buscarClientePorEmail(cliente2.email);

console.log(sistema.getClientes());

cliente.renovarSubscripcion(true, cliente3);

console.log(cliente.verificarEstadoSuscripcion());
*/
