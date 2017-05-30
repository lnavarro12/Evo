var modeloUsuario = require("../../models/mUsuarios");

module.exports = function(req,res,next){
      if(!req.session.usuarioId){
          res.redirect("/evohr/login");
      }else{
          next();
      }
};






// var modeloUsuario = require('../../models/mUsuarios');

// module.exports = function(req,res,next){
//   var session = req.session.usuarioId;
//   var path = req.path;
//   //console.log(path+"- "+session)
//  // con session y en el login = home
//  // sin session y en el login = login
//    if (!session) {
//     res.redirect("/evohr/login");
//    }else{
//       if(req.path.indexOf("registro")>0){
//               next();
//       }

//     modeloUsuario.findById(req.session.usuarioId,function(error, doc){
//         if(error){
//                 if(req.path.indexOf("login")<=0){ res.redirect("/evohr/login"); }
//         }else{
//           res.locals = {
//             usuario: doc
//           };
//                 ////console.log(res);
//           next();
//         }
//       });
//    }
// }
