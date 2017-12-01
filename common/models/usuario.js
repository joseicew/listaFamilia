'use strict';

module.exports = function(Usuario) {
    /**
     * Aceptamos la solicitud de un usuario en nuestra lista
     * @param {object} contexto Context
     * @param {Function(Error, array)} callback
     */

    Usuario.prototype.aceptarSolicitud = function(contexto, callback) {
        var ListaUsuarios; //Callback a rellenar
        var idSolicitante = this.id; //Id entrante
        var idMio =contexto.req.accessToken.userId; //Mi Id
        var idMiLista ; //Tenemos que buscar que lista tengo asociada según mi ID
        var Usuarios = this; //copia de la instancia
        var miLista; //lista a la que se quiere acceder
        console.log("ID Solicitante: "+idSolicitante);
        console.log("ID Mio: "+idMio);
        
        //Primero vamos a encontrar si yo tengo alguna lista asociada y a rescatar ese ID
        Usuario.findById(idMio, function(err, usuario){
            if(err)callback(err);
            idMiLista=usuario.listaFamiliarId;
            console.log("Mi Id de lista: "+idMiLista);
            //Con el Id de mi lista voy a ver si el usuario introducido ha solicitado entrar
            //Para ello vamos a comprobar si hay alguna solicitud asociada a mi lista
            //De paso vamos a guardarla para usarla posteriormente
            Usuarios.solicita.findById(idMiLista, function(err, solicitud){
                if(err)callback(err);
                miLista=solicitud;
                console.log(solicitud);
                //Ya tenemos al usuario y la lista, vamos a irnos al modelo de usuario a 
                //añadirle el id como participante en Usuario.listadamiliarId
                Usuario.findById(idSolicitante, function(err,usuarioModificado){
                    if(err)callback(err);
                    usuarioModificado.listaFamiliarId = idMiLista;
                    usuarioModificado.save();
                    console.log(usuarioModificado);

                    //Tenemos que devolver todos los usuarios asociadosa mi lista, vamos a realizar una busqueda
                    //dentro de usuarios para ver quienes comparten el idMiLista a parte de mi y el usuario añadido
                    Usuario.find( {where:{"listaFamiliarId":idMiLista}} ,function(err, participantes) {
                    if(err)callback(err);      
                    console.log(participantes);
                    ListaUsuarios = participantes;
                    
                    //Por último vamos a proceder a elminar la solicitud para ello al usuarioModificado
                    //Le realizamos a travez de la realcion una eliminación de la lista a la que quería participar
                    usuarioModificado.solicita.remove(miLista,function(err) {
                      console.log("Borrando solicitud: "+idSolicitante);
                      
                    });
                    
                    callback(null, ListaUsuarios);
                    });
                })
            })
           
        })

    };

    /**
     * Rechazamos la solicitud de un usuario a una listaFamiliar
     * @param {object} contexto Contexto - Context
     * @param {Function(Error, object)} callback
     */

    Usuario.prototype.rechazarSolicitud = function(contexto, callback) {
        var ListaUsuarios;
        var idSolicitante = this.id; //Id entrante
        var idMio =contexto.req.accessToken.userId; //Mi Id
        var idMiLista ; //Tenemos que buscar que lista tengo asociada según mi ID
        var Usuarios = this; //copia de la instancia
        var miLista; //lista a la que se quiere acceder
        console.log("ID Solicitante: "+idSolicitante);
        console.log("ID Mio: "+idMio);
        
        //Primero vamos a encontrar si yo tengo alguna lista asociada y a rescatar ese ID
        Usuario.findById(idMio, function(err, usuario){
            if(err)callback(err);
            idMiLista=usuario.listaFamiliarId;
            console.log("Mi Id de lista: "+idMiLista);
            //Con el Id de mi lista voy a ver si el usuario introducido ha solicitado entrar
            //Para ello vamos a comprobar si hay alguna solicitud asociada a mi lista
            //De paso vamos a guardarla para usarla posteriormente
            Usuarios.solicita.findById(idMiLista, function(err, solicitud){
                if(err)callback(err);
                miLista=solicitud;
                console.log(solicitud);
                //Ya tenemos al usuario y la lista, vamos a irnos al modelo de usuario a rescatarlo
                Usuario.findById(idSolicitante, function(err,usuarioModificado){
                    if(err)callback(err);
                    console.log(usuarioModificado);

                    //Tenemos que devolver todos los usuarios asociadosa mi lista, vamos a realizar una busqueda
                    //dentro de usuarios para ver quienes comparten el idMiLista a parte de mi y el usuario añadido
                    Usuario.find( {where:{"listaFamiliarId":idMiLista}} ,function(err, participantes) {
                        if(err)callback(err);      
                        console.log(participantes);
                        ListaUsuarios = participantes;
                        
                        //Por último vamos a proceder a elminar la solicitud para ello al usuarioModificado
                        //Le realizamos a travez de la realcion una eliminación de la lista a la que quería participar
                        usuarioModificado.solicita.remove(miLista,function(err) {
                        console.log("Borrando solicitud: "+idSolicitante);
                        
                        });
                        
                        callback(null, ListaUsuarios);

                    });
                });
            });
        });
    };
    
}