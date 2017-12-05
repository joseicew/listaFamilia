module.exports = function (app) {
    var Role = app.models.Role;

    Role.registerResolver('miembroLista', function (role, context, cb) {
        // Comprobamos a que centro esta haciendo la peticion
        if (context.modelName !== 'Producto') {
            // Si esta accediento a otro metodo que no sea Centro no seguimos
            return process.nextTick(() => cb(null, false));
        }
        //Vamos a comprobar si hay algun usuario loggeado
        var userId = context.accessToken.userId;
        if (!userId) {
            //Si no esta logeado no puede usar la funcion por lo tanto no seguimos
            return process.nextTick(() => cb(null, false));
        }
        //vamos a comprobar si el producto esta en su lista y si el usuario pertenece a la lista
        var Usu = app.models.Usuario;
        Usu.findById(userId, function(err,usuario){
            if (err)return cb(err);

            //contexto.modelId
            if (usuario.listaFamiliarId != null) {
                //vamos a comprobar que el producto pertenece a la lista del usuario

                context.model.findById(context.modelId, function(err,producto){
                    //Si está, puede modificarlo, sino return false
                    if(producto.listaFamiliarId == usuario.listaFamiliarId){
                        return cb(null, true);
                    }else{
                        return cb(null, false);
                    }
             })
                
            } else {
                return cb(null, false);
            }
        });


    });
};