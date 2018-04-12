



var mainController = require('./controller.js');

module.exports = function(app){

  app.get('/getVehicle/:id', function(req, res){
    mainController.getVehicle(req, res);
  });
  app.get('/addVehicle/:vehicle', function(req, res){
    mainController.addVehicle(req, res);
  });
  app.get('/getAllVehicle', function(req, res){
    mainController.getVehicle(req, res);
  });
  app.get('/changeOwner/:holder', function(req, res){
    mainController.changeOwner(req, res);
  })
  
}
