/*
 * User Service
 * Author : Tanya Mittal
 * Date : Aug 14, 2021
 *  */

let UserData = require("../models/UserModel")
let BookingData = require("../models/BookingModel")
let LocationData = require("../models/LocationModel")

//get user data by email
module.exports.getUserByEmail = (email) => {
    return new Promise(function (resolve, reject) {
        UserData.getAllUsers().then((user) => {
            user.map(userData => {
                if (userData.email_address == email) {
                    resolve(userData);
                }
            })
        }).catch((err) => {
            reject(err);
        });
    });
}

//get user UPCOMING booking data by user id

module.exports.getUpcomingBookingDataByUserID = (userid) => {
    return new Promise(function (resolve, reject) {
        BookingData.getAllBookings().then((booking) => {
            booking.map(bookingData => {
                if (bookingData.user_id == userid && bookingData.status == "BOOKED") {
                    resolve(bookingData);
                }
            })
        }).catch((err) => {
            reject(err);
        });
    });
}

//get user VACCINATED booking data by user id

module.exports.getVaccinatedBookingDataByUserID = (userid) => {
    return new Promise(function (resolve, reject) {
        BookingData.getAllBookings().then((booking) => {
            booking.map(bookingData => {
                if (bookingData.user_id == userid && bookingData.status == "VACCINATED") {
                    resolve(bookingData);
                }
            })
        }).catch((err) => {
            reject(err);
        });
    });
}

//get user booking location based on location id

module.exports.getBookingLocation = (locationid) => {
    return new Promise(function (resolve, reject) {
        LocationData.getAllLocations().then((location) => {
            location.map(locationData => {
                console.log(locationData);
                if (locationData._id == locationid) {
                    resolve(locationData);
                }
            })
        }).catch((err) => {
            reject(err);
        });
    });
}

// //When user cancels booking

// module.exports.getBookingLocation = (locationid) => {
//     return new Promise(function (resolve, reject) {
//         LocationData.getAllLocations().then((location) => {
//             location.map(locationData => {
//                 console.log(locationData);
//                 if (locationData._id == locationid) {
//                     resolve(locationData);
//                 }
//             })
//         }).catch((err) => {
//             reject(err);
//         });
//     });
// }