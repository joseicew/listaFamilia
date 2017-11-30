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
        var Usuarios = this;
        var miLista;
        console.log("ID Solicitante: "+idSolicitante);
        console.log("ID Mio: "+idMio);
        

        Usuario.findById(idMio, function(err, usuario){
            if(err)callback(err);
            idMiLista=usuario.listaFamiliarId;
            console.log("Mi Id de lista: "+idMiLista);

            Usuarios.solicita.findById(idMiLista, function(err, solicitud){
                if(err)callback(err);
                miLista=solicitud;
                
                console.log(solicitud);

                Usuario.findById(idSolicitante, function(err,usuarioModificado){
                    if(err)callback(err);
                    usuarioModificado.listaFamiliarId = idMiLista;
                    usuarioModificado.save();
                    console.log(usuarioModificado);

                    Usuario.find( {where:{"listaFamiliarId":idMiLista}} ,function(err, participantes) {
                    if(err)callback(err);      
                    console.log(participantes);
                    ListaUsuarios = participantes;
                    
                    usuarioModificado.solicita.remove(miLista,function(err) {
                      console.log("Borrando solicitud: "+idSolicitante);
                      
                    });
                    
                    callback(null, ListaUsuarios);
                    });
                })
            })
           
        })

    };
  
};
