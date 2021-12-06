/*
 * getting user data from dB
 * Author : Moses Dhiraviam
 * Date : July 25, 2021
 *  */

  

let userData = require("../models/UserModel")
let locationData = require("../models/LocationModel")



module.exports.addNewEmployee= (user_id, empReq)=>{
    return new Promise(function (resolve, reject) {
if(empReq.emp == "admin"){
    
    empReq.isAdmin = true;
    userData.updateUserByID(user_id,empReq).then((employee)=>{
        var employeeData = JSON.parse(JSON.stringify(employee));
        resolve(employeeData);
    }).catch((err) => {
        reject(err);
    });
}
if(empReq.emp == "nurse"){
    
    empReq.isNurse = true;
    userData.updateUserByID(user_id,empReq).then((employee)=>{
        var employeeData = JSON.parse(JSON.stringify(employee));
        resolve(employeeData);
    }).catch((err) => {
        reject(err);
    });

}
});
}

module.exports.updateVaccine= (location_id, locationReq)=>{
    return new Promise(function (resolve, reject) {

    locationData.updateLocationByID(location_id,locationReq).then((location)=>{
        var locations = JSON.parse(JSON.stringify(location));
        resolve(locations);
    }).catch((err) => {
        reject(err);
    });


});
}

module.exports.addNewLocation= (req,res)=>{
          locationData.createNewLocation(req,res);
    
}