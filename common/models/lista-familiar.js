'use strict';

module.exports = function(Listafamiliar) {
    console.log();
    Listafamiliar.afterRemote('create', function(context, listaFamiliar, next) {
        //preparo el modelo listaFamiliar
        var ListaFamiliar = listaFamiliar.app;
        // Compruebo si está logueado
        console.log(context.req.accessToken);
        if (context.req.accessToken && context.req.accessToken.userId) {
            //Si está logueado le asocio a esa lista que acaba de crear su id como owner
            
            console.log("El usuario existe");
            context.args.data.ownerId = context.req.accessToken.userId;
            console.log(context.args.data.ownerId);
            next();
        }else{
            console.log("El usuario no está logueado");
            next();
        }
    })
};
