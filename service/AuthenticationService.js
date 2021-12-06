/**
 * Authentication Service
 * Author : Tanya Mittal
 * Date : July 26, 2021
 *  */

let UserData = require("../models/UserModel")
//Register service
const bcrypt = require('bcrypt');

module.exports.RegisterTheUser = (userReq) => {

    return new Promise(function (resolve, reject) {
        UserData.getAllUsers().then((users) => {
            if (userReq.password != userReq.cpsw) {
                reject({
                    "message": "Password does not match!"
                });
            }
            else {
                for (var i = 0; i < users.length; i++) {
                    if (users[i].email_address === userReq.email_address) {
                        reject({
                            "message": "Email already exists!"
                        });
                    }
                }
                //if mobile number already present in the database
                for (var i = 0; i < users.length; i++) {
                    if (users[i].mobile_number === userReq.mobile_number) {
                        reject({
                            "message": "Mobile number already exists!"
                        });
                    }
                }
                UserData.createNewUser(userReq).then((user) => {
                    resolve(user);
                }).catch((err) => {
                    reject(err);
                });
            }
        }).catch((err) => {
            reject(err);
        });
    });
}

//Login service

module.exports.AuthenticateTheUser = (userReq) => {
    return new Promise(function (resolve, reject) {
        UserData.getAllUsers().then((users) => {
            // authentication for blank values
            if (userReq.email_address == null || userReq.password == null) {
                reject({
                    "message": "Fields cannot be empty!"
                });
            }
            else {
                var resultLogin = {};
                var emailFlag = false;
                for (var i = 0; i < users.length; i++) {
                    if (users[i].email_address === userReq.email_address) {
                        resultLogin = users[i];
                        emailFlag = true;
                    }
                }
                if (emailFlag == true) {
                    // means the email exists
                    bcrypt.compare(userReq.password, resultLogin.password).then(function (result) {
                        if (result) {

                            // successful login
                            // req.covidotsSession.user = {
                            //     email: resultLogin.email_address,
                            //     isAdmin: resultLogin.isAdmin,
                            //     firstName: resultLogin.first_name,
                            //     lastName: resultLogin.last_name
                            // };
                            // if isAdmin is true, which means the user is an Admin.
                            if (resultLogin.isAdmin) {
                                resolve({
                                    "userRole": "admin",
                                    "id": resultLogin._id
                                });
                            }
                            // if isNurse is true, which means the user is a Nurse.
                            else if (resultLogin.isNurse) {
                                resolve({
                                    "userRole": "nurse",
                                    "id": resultLogin._id
                                });
                            }
                            // if both isAdmin and isNurse are false, but the email and
                            // password matches in database, it will redirect to user dashboard.
                            else {
                                resolve({
                                    "userRole": "user",
                                    "id": resultLogin._id
                                });
                            }
                        }

                        else {
                            reject({
                                "message": "Invalid Credentials!"
                            });
                        }
                    });
                }
                else {
                    reject({
                        "message": "Email does not exists!"
                    });
                }
            }
        }
        ).catch((err) => {
            reject(err);
        });
    });
}