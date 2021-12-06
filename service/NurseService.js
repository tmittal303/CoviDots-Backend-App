/**
 * Nurse service layer 
 * @author : Anjusha Bhaskaran <abhaskaran1@myseneca.ca>
 * @since : 01-August-2021
 * 
 */

let BookingData = require("../models/BookingModel")

module.exports.getUserBookingsForDay = (req, res) => {
    return new Promise(function (resolve, reject) {
        BookingData.getAllBookingsForToday().then((bookings) => {
            resolve(bookings);
        }).catch((err) => {
            console.log(err);
            reject(err);
        });
    });
}

module.exports.updateUserBooking = (bookingId, bookingReq) => {
    return new Promise(function (resolve, reject) {
        BookingData.updateBookingByID(bookingId, bookingReq).then((booking) => {
            resolve(userBooking);
        }).catch((err) => {
            reject(err);
        });
    });
}

module.exports.getBookingMetrics = () => {
    let metrics = {};
    return new Promise(function (resolve, reject) {
        BookingData.getCompletedCountByDay().then((bookings) => {
            console.log(bookings.length);
            metrics.vaccinatedCount = bookings.length;
            return (metrics);
        }).catch((err) => {
            console.log(err);
        }).then(
            BookingData.getAllBookingsForToday().then((bookings) => {
                console.log(bookings.length);
                metrics.totalCount = bookings.length;
                resolve(metrics);
            }).catch((err) => {
                console.log(err);
            }));
    });
}
