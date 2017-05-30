usuario.config(['$routeProvider','$locationProvider',function($routeProvider, $locationProvider) {
	$routeProvider
	.when('/registroCargoEmpresa',{
	    templateUrl: '../V.Contrato/opcionContrato.html',
	    controller: 'controllerConfiguracionContratoEmpresa'
	})
  .when('/registroTipoContratoEmpresa',{
	    templateUrl: '../V.Contrato/opcionContrato.html',
	    controller: 'controllerConfiguracionContratoEmpresa'
	})
  .when('/registroTipoSalarioEmpresa',{
	    templateUrl: '../V.Contrato/opcionContrato.html',
	    controller: 'controllerConfiguracionContratoEmpresa'
	})
  .when('/registroCicloFacturacionEmpresa',{
	    templateUrl: '../V.Contrato/opcionContrato.html',
	    controller: 'controllerConfiguracionContratoEmpresa'
	})
	.otherwise('/',{
	    redirectTo :'/'
	});
}])

// Se crea una directiva para leer el contenido del input file
.directive('fileModel',["$parse", function($parse){
// $parse : Converts AngularJS expression into a function.
// usamos el servicio $parse para buscar los atributos especificamente el atributo el file model
// Lo que nuestra directiva hace es que vigila nuestro elemento por cualquier tipo de cambio
// Cuando el cambio ocurre, encontrara el atributo en el contexto
  return{
    restrict: 'A', // restringe a atributo
    link: function(scope, element, attrs){
      var model = $parse(attrs.fileModel);
      var modelSetter = model.assign;
      element.bind('change',function(){
        scope.$apply(function(){
          modelSetter(scope,element[0].files[0]);
        })
      })
    }
  }
}])

// Este servicio nos permite recorrer el contenido del formulario
// Tomar todos los valores y enviarlos por metodo post a la url

.service('multipartForm',function($http){
  this.post = function(uploadUrl, data){
    var fd = new FormData();
    for(var key in data){
      fd.append(key,data[key]);
		}
      $http.post(uploadUrl,fd,{
      transformRequest: angular.identity,
      headers: {
        'Content-Type': undefined
      }
    })
    .then(function(response,status,headers,config){
      // s.usuarios = {};
      if(response.data.error==""){
        swal("Felicitaciones", "Hemos guardado tus datos", "success");
        $location.path("/perfilEmpresa");
      }else{
        swal("Verifica tus datos!", response.data.error, "warning");
      }
    })
  }

  this.put = function(uploadUrl,data,id){
    var fd = new FormData();
    for(var key in data)
      fd.append(key,data[key]);
      $http.put(uploadUrl,fd, {
        transformRequest: angular.identity,
        headers: {
          'Content-Type': undefined
        },
        params: { id: id }
    })
    .then(function(response,status,headers,config){
      if(response.data.error==""){
          swal({
              title: "Excelente!",
              text: "Hemos guardado tus datos",
              type: "success",
              showCancelButton: false,
              confirmButtonColor: "#00b3e3",
              closeOnConfirm: true,
          },
					function(isConfirm){
            location.reload();
          });
      }else{
        swal("Verifica tus datos!", response.data.error, "warning");
      }
    })
    // .catch(function(response,status){
    //  swal("Error", response.data, "error");
    // });
  }
})

// usuario.controller('RegistroEmpresa', ['$scope','$http', '$location', 'multipartForm',function($scope, $http, $location, multipartForm){
// 	$scope.empresa = {};
// 	$scope.mostrarBtnGuardar = true;
// 	$scope.mostrarBtnActualizar = false;
// 	$http.get("empresas", {})
// 	.then(function(data,status,headers,config){
//     if(data.data.empresa[0]){
// 			$scope.mostrarBtnGuardar = false;
// 			$scope.mostrarBtnActualizar = true;
// 			$scope.empresa = {
// 				nit: data.data.empresa[0].nit,
// 	      direccion: data.data.empresa[0].direccion,
// 	      telefono: data.data.empresa[0].telefono,
// 	      razonSocial: data.data.empresa[0].razonSocial,
// 	      correoElectronico: data.data.empresa[0].correoElectronico,
// 	      paginaweb: data.data.empresa[0].paginaweb,
// 				id: data.data.empresa[0]._id
// 			};
// 		}
//   });
//   $scope.guardarEmpresa = function(){
//     if(!document.getElementById("avatar-upload").value.length==0){
//       if (/.(jpg|JPG)$/i.test(document.getElementById("avatar-upload").value)){
//           var uploadUrl = '/empresas';
//           // console.log($scope.empresa.logo);
//           multipartForm.post(uploadUrl,$scope.empresa);
//           }else{
//             swal("Error!", "La imagen de perfil de usuario es obligatoria, comprueba la extensión de su imágen, recuerda que el formato aceptados es .jpg ", "error");
//           return false;
//           }
//     }else{
//       swal("Error!", "La imagen de perfil de usuario es obligatoria, comprueba la extensión de su imagen recuerda que el formato aceptados es .jpg ", "error");
//       return false;
//     }
//   }

// 	$scope.actualizarEmpresa = function(idEmpresa){
//     var uploadUrl = "/empresas/edicion";
//     var id = idEmpresa;
//     multipartForm.put(uploadUrl,$scope.empresa,id);
// 	};

// 	$scope.Cancelar = function(){
// 		$location.path("/");
// 	};
// }]);

usuario.controller('controllerConfiguracionContratoEmpresa', ['$scope', '$location', '$http', function($scope, $location, $http){
  var url = $location.path();
	$scope.ejemploDescripcion = "Descripcion";
  if (url.indexOf("/registroCargoEmpresa")!=-1) {
    $scope.titulo = "Agregar Cargo";
		$scope.ejemploOcupacion = "Tipo Cargo";
  }else{
    if (url.indexOf("/registroTipoContratoEmpresa")!=-1) {
      $scope.titulo = "Agregar Tipo de Contrato";
			$scope.ejemploOcupacion = "Tipo Contrato";
    }else{
      if (url.indexOf("/registroTipoSalarioEmpresa")!=-1) {
        $scope.titulo = "Agregar Tipo de Salario";
				$scope.ejemploOcupacion = "Tipo Salario";
      }else{
        if (url.indexOf("/registroCicloFacturacionEmpresa")!=-1) {
          $scope.titulo = "Agregar Ciclo de Facturacion";
					$scope.ejemploOcupacion = "Tipo Ciclo Facturacion";
        }
      }
    }
  }
  $scope.Guardar = function(){
    if (url.indexOf("/registroCargoEmpresa")!=-1) {
      $http.post("/cargo", {
        nombre: $scope.usuarios.nombreCargo,
        descripcion: $scope.usuarios.descripcionCargo
      })
      .then(function(response,status,headers,config){
        console.log(response.data._id)
        if(response.data._id==" "){
          swal("Ha ocurrido un error!", "Intente nuevamente", "error");
        }else{
          swal("Felicitaciones", "Cargo Registrado", "success");
          $location.path("/contratos");
        }
      })

      .catch(function(response,status,headers,config){
        swal("Ha ocurrido un error!", response.data.error, "error");
      })
    }
    if (url.indexOf("/registroTipoContratoEmpresa")!=-1) {
      $http.post("/tipoContrato", {
        nombre: $scope.usuarios.nombreCargo,
        descripcion: $scope.usuarios.descripcionCargo
      })
      .then(function(response,status,headers,config){
        console.log(response.data._id)
  			if(response.data._id==" "){
  				swal("Ha ocurrido un error!", "Intente nuevamente", "error");
  			}else{
          swal("Felicitaciones", "Tipo de contrato Guardado", "success");
  				$location.path("/contratos");
  			}
  		})

      .catch(function(response,status,headers,config){
        swal("Ha ocurrido un error!", response.data.error, "error");
      })
    }
    if (url.indexOf("/registroTipoSalarioEmpresa")!=-1) {
      $http.post("/tipoSalario", {
        nombre: $scope.usuarios.nombreCargo,
        descripcion: $scope.usuarios.descripcionCargo
      })
      .then(function(response,status,headers,config){
        console.log(response.data._id)
        if(response.data._id==" "){
          swal("Ha ocurrido un error!", "Intente nuevamente", "error");
        }else{
          swal("Felicitaciones", "Tipo de Salario Guardado", "success");
          $location.path("/contratos");
        }
      })

      .catch(function(response,status,headers,config){
        swal("Ha ocurrido un error!", response.data.error, "error");
      })
    }
    if (url.indexOf("/registroCicloFacturacionEmpresa")!=-1) {
      $http.post("/cicloFacturacion", {
        nombre: $scope.usuarios.nombreCargo,
        descripcion: $scope.usuarios.descripcionCargo
      })
      .then(function(response,status,headers,config){
        console.log(response.data._id)
        if(response.data._id==" "){
          swal("Ha ocurrido un error!", "Intente nuevamente", "error");
        }else{
          swal("Felicitaciones", "Ciclo de Facturación Guardado", "success");
          $location.path("/contratos");
        }
      })

      .catch(function(response,status,headers,config){
        swal("Ha ocurrido un error!", response.data.error, "error");
      })
    }
  }

	$scope.Cancelar = function(){
		$location.path("/contratos");
	};
}]);
