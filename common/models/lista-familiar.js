'use strict';

module.exports = function(Listafamiliar) {
    console.log();
    Listafamiliar.afterRemote('create', function(context, listaFamiliar, next) {
        //preparo el modelo usuarios
        var Usuarios = Listafamiliar.app.models.Usuario;
        var listaCreada = listaFamiliar.id;
        // Compruebo si está logueado
        
        if (context.req.accessToken && context.req.accessToken.userId) {
            //Si está logueado le asocio a esa lista que acaba de crear su id como owner
            
            context.args.data.ownerId = context.req.accessToken.userId;
            console.log(listaFamiliar.ownerId);
            Usuarios.findById(context.req.accessToken.userId, function(err, usuario){
                
                usuario.listaFamiliarId=listaCreada;
                //Guardamos el usuario
                usuario.save(function (err, usuario) {
                    next();
                  });
            })

            
        }else{
            console.log("El usuario no está logueado");
            next();
        }
    })
    
    /**
    * "Solicitud a una lista"
    * @param {object} contexto "context"
    * @param {Function(Error)} callback
    */
   
   Listafamiliar.prototype.solicitar = function(contexto, callback) {
    var Solicitud;
    var UsuId = contexto.req.accessToken.userId;
    var listaID = this.id;
    //tenemos que añadir este usuario a la lista que solicite, tenemos la lista y el usuario, añadamoslos
    //this.id --> Recoge el id que ha introducido el usuario
    this.solicita.add(UsuId,function(err) {
        Solicitud = {
            ListaFamiliarId: listaID,
            UsuarioId: UsuId
        }   
        console.log(Solicitud);
        callback(null,Solicitud);
    });
    
     
   };

   


};
