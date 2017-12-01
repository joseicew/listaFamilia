'use strict';

module.exports = function(Producto) {

    /**
     * Ponemos a false todos los productos de la lista, indicando que están comprados
     * @param {object} contexto Contexto - Context
     * @param {Function(Error, object)} callback
     */

    Producto.limpiarLista = function(contexto, callback) {
        var listaProductos; //callback
        var Productos = this; //Instancia
        var idMio =contexto.req.accessToken.userId; //Mi Id
        var Usuarios = Producto.app.models.Usuario; //Modelo usuarios
        var idLista; //Id de la lista que pertenece el usuario
        var ListasFamiliares = Producto.app.models.ListaFamiliar;
        var miLista; //Lista para modificar valores

        //Teniendo el ID voy a buscar mi Id de lista
        Usuarios.findById(idMio, function(err,usuario){
            if (err) callback(err);
            idLista = usuario.listaFamiliarId;
            console.log(idLista);

            //Ya sabiendo a que lsita pertenezco, voy a rescatarla
            ListasFamiliares.findById(idLista, function(err,lista){
                miLista = lista;
                console.log(miLista);

                Producto.find( {where:{"listaFamiliarId":miLista.id}},function(err,listaproductos){
                    console.log(listaproductos);
                    for(var i=0;i<listaproductos.length;i++){
                        listaproductos[i].comprar=0;
                    }
                    console.log(listaproductos);
                    listaProductos=listaproductos;
                    callback(null, listaProductos);
                })
            })
        })

        
    };
    
};
