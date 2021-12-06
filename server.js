var HTTP_PORT = process.env.PORT || 8080;
const express = require("express");
const path = require("path");
let bodyParser = require("body-parser");
var cors = require('cors')
let date = new Date();

// for database connections
const config = require("./config/dbconfig");
const mongoose = require("mongoose");

// for Sessions and Cookies
const clientSessions = require("client-sessions");

// database connection
mongoose.connect(config.dbconn, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set('debug', true);

// import functions
let roleData = require("./models/RoleModel.js");
let locationModel = require("./models/LocationModel.js");
let UserModel = require("./models/UserModel");
let bookingModel = require("./models/BookingModel");
let vaccineModel = require("./models/VaccineModel")


let authService = require("./service/AuthenticationService.js");
let adminService = require("./service/AdminService.js");
let bookingService = require("./service/BookingService.js");
let nurseService = require("./service/NurseService.js");
let userService = require("./service/UserService.js");

var app = express();
app.use(express.json());
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: false }));

app.use(clientSessions({
    cookieName: "covidotsSession",
    secret: "5AzOH881Oz",
    duration: 2 * 60 * 1000, // 2 minutes - life of cookie
    activeDuration: 1000 * 60 // 1 minutes life of session
}));

app.options('*', cors())

// Register

app.get("/register", (res) => {
    res.redirect("/register")
})
app.post("/register", (req, res) => {
    var userReq = {};
    userReq.first_name = req.body.first_name,
        userReq.last_name = req.body.last_name,
        userReq.date_of_birth = req.body.date_of_birth,
        userReq.mobile_number = req.body.mobile_number,
        userReq.email_address = req.body.email_address,
        userReq.password = req.body.password,
        userReq.cpsw = req.body.cpsw,
        userReq.terms_and_condition = req.body.terms_and_condition
    authService.RegisterTheUser(userReq).then((user) => {
        res.send(user);
    }).catch((err) => {
        res.send(err);
    });
})
// Login and Logout

app.get("/login", (res) => {
    res.redirect("/login")
})

app.post("/login", (req, res) => {
    var userReq = {};
    userReq.email_address = req.body.email_address,
        userReq.password = req.body.password
    authService.AuthenticateTheUser(userReq).then((user) => {
        res.send(user);
    }).catch((err) => {
        res.send(err);
    });
})

app.get("/logout", (req, res) => {
    req.covidotsSession.reset();
    res.json({});
})

app.get("/roles", (req, res) => {
    roleData.getAllRoles().then((roleMap) => {
        res.send(roleMap);
    }).catch((err) => {
        res.status(500).send("Unable to find roles");
    });
})


//Users API

//CREATE
app.post('/users', (req, res) => {
    var userReq = {};
    userReq.first_name = req.body.first_name,
        userReq.last_name = req.body.last_name,
        userReq.isAdmin = req.body.isAdmin,
        userReq.isNurse = req.body.isNurse,
        userReq.date_of_birth = req.body.date_of_birth,
        userReq.mobile_number = req.body.mobile_number,
        userReq.email_address = req.body.email_address,
        userReq.password = req.body.password,
        userReq.salt = req.body.salt,
        userReq.terms_and_condition = req.body.terms_and_condition,
        userReq.document_id_number = req.body.document_id_number
    UserModel.createNewUser(userReq).then((user) => {
        res.send(user);
    }).catch((err) => {
        res.status(500).send(err);
    });
})

app.get('/users', (req, res) => {
    UserModel.getAllUsers().then((users) => {
        res.send(users);
    }).catch((err) => {
        res.status(500).send("Unable to find users");
    });
})

app.get('/users/:user_id', (req, res) => {
    UserModel.getUserByID(req.params.user_id).then((user) => {
        res.send(user);
    }).catch((err) => {
        res.status(500).send(err);
    });
})

//UPDATE
app.put('/users/:user_id', (req, res) => {
    var UserReq = {};
    UserReq.first_name = req.body.first_name;
    UserReq.last_name = req.body.last_name;
    UserReq.date_of_birth = req.body.date_of_birth;
    UserReq.email_address = req.body.email_address;
    UserReq.password = req.body.password;
    UserModel.updateUserByID(req.params.user_id, UserReq).then((user) => {
        res.send(user);
    }).catch((err) => {
        res.status(500).send(err);
    });
})

//DELETE
app.delete('/users/:user_id', (req, res) => {
    UserModel.deleteUserByID(req.params.user_id).then((user) => {
        res.send(user);
    }).catch((err) => {
        res.status(500).send(err);
    });
})

//get user by email
app.get('/userbyemail/:email_address', (req, res) => {
    userService.getUserByEmail(req.params.email_address).then((user) => {
        res.send(user);
    }).catch((err) => {
        res.status(500).send(err);
    });
})

//get user UPCOMING booking data by user id
app.get('/userupcomingbookingbyid/:email_address', (req, res) => {
    userService.getUserByEmail(req.params.email_address).then((user) => {
        userService.getUpcomingBookingDataByUserID(user._id).then((booking) => {
            res.send(booking);
        }).catch((err) => {
            res.status(500).send(err);
        });
    }).catch((err) => {
        res.status(500).send(err);
    });
})

//get user VACCINATED booking data by user id
app.get('/uservaccinatedbookingbyid/:email_address', (req, res) => {
    userService.getUserByEmail(req.params.email_address).then((user) => {
        userService.getVaccinatedBookingDataByUserID(user._id).then((booking) => {
            res.send(booking);
        }).catch((err) => {
            res.status(500).send(err);
        });
    }).catch((err) => {
        res.status(500).send(err);
    });
})

//get user UPCOMING booking location based on location id
app.get('/userupcomingbookinglocation/:email_address', (req, res) => {
    userService.getUserByEmail(req.params.email_address).then((user) => {
        userService.getUpcomingBookingDataByUserID(user._id).then((booking) => {
            userService.getBookingLocation(booking.location_id).then((location) => {
                res.send(location);
            }).catch((err) => {
                res.status(500).send(err);
            });
        }).catch((err) => {
            res.status(500).send(err);
        });
    }).catch((err) => {
        res.status(500).send(err);
    });
})

//get user VACCINATED booking location based on location id
app.get('/uservaccinatedbookinglocation/:email_address', (req, res) => {
    userService.getUserByEmail(req.params.email_address).then((user) => {
        userService.getVaccinatedBookingDataByUserID(user._id).then((booking) => {
            userService.getBookingLocation(booking.location_id).then((location) => {
                res.send(location);
            }).catch((err) => {
                res.status(500).send(err);
            });
        }).catch((err) => {
            res.status(500).send(err);
        });
    }).catch((err) => {
        res.status(500).send(err);
    });
})


// Admin APIs:

app.put('/addEmployee', (req, res) => {
    var empReq = {};
    empReq.emp = req.body.emp;
    empReq.user_id = req.body.user_id;
    if (empReq.emp == "admin") {
        empReq.isAdmin = true;
    } else {
        empReq.isNurse = true;
    }
    adminService.addNewEmployee(empReq.user_id, empReq).then((employeeData) => {
        res.send(employeeData);
    }).catch((err) => {
        res.status(500).send("Unable to find user");
    });
})

app.post('/addNewLocation', (req, res) => {
    var locationReq = {};
    locationReq.location_id = req.body.location_id;
    locationReq.address_line = req.body.address_line;
    locationReq.city = req.body.city;
    locationReq.province = req.body.province;
    locationReq.postalCode = req.body.postalCode;
    locationReq.country = req.body.country;
    locationReq.location_type = req.body.location_type;
    locationReq.instructions = req.body.instructions;
    locationReq.start_date = req.body.start_date;
    locationReq.end_date = req.body.end_date;
    locationReq.start_time = req.body.start_time;
    locationReq.end_time = req.body.end_time;
    locationReq.created_ts = date.getDate();
    locationReq.modified_ts = date.getDate();
    locationReq.nurse_id = req.body.nurse_id;


    locationReq.vaccine = {
        vaccine_type: req.body.vaccine.vaccine_type,
        quantity: req.body.vaccine.quantity,
        start_date: req.body.start_date,
        end_date: req.body.end_date
    }
    locationModel.createNewLocation(locationReq).then((location) => {
        res.send(location);
    }).catch((err) => {
        res.status(500).send(err);
    });;
})


app.put('/updateVaccine', (req, res) => {
    var locationReq = {};
    locationReq.location_id = req.body.location_id;
    locationReq.postalCode = req.body.postalCode;
    locationReq.start_date = req.body.start_date;
    locationReq.end_date = req.body.end_date;
    locationReq.created_ts = date.getDate();
    locationReq.modified_ts = date.getDate();
    locationReq.nurse_id = req.body.nurse_id;


    locationReq.vaccine = {
        vaccine_type: req.body.vaccine.vaccine_type,
        quantity: req.body.vaccine.quantity,
        start_date: req.body.start_date,
        end_date: req.body.end_date
    }
    adminService.updateVaccine(locationReq.location_id, locationReq).then((location) => {
        res.send(location);
    }).catch((err) => {
        res.status(500).send(err);
    });
})


// Booking APIs:

app.post('/bookings', (req, res) => {
    var bookingReq = {};
// find a way to autoincrement booking id***
    bookingReq.booking_id = req.body.booking_id;    
    // user_id = req.body.user_id,
    // location_id: req.body.location_id,
    bookingReq.booking_date = new Date(req.body.booking_date);
    bookingReq.booking_time = req.body.booking_time;
    // vaccine_type: req.body.vaccine_type,
    bookingReq.status = "BOOKED";
    bookingReq.user = req.body.user_id;
    bookingModel.createNewBooking(bookingReq).then((booking) => {
        res.send(booking);
    }).catch((err) => {
        res.status(500).send(err);
    });
})

app.get('/bookings', (req, res) => {
    bookingModel.getAllBookings().then((bookings) => {
        res.send(bookings);
    }).catch((err) => {
        res.status(500).send(err);
    });
})

app.get('/bookings/:booking_id', (req, res) => {
    bookingModel.getBookingByID(req.params.booking_id).then((booking) => {
        res.send(booking);
    }).catch((err) => {
        res.status(500).send(err);
    });
})

app.put('/bookings/:booking_id', (req, res) => {
    var bookingReq = {};
    bookingReq.booking_date = new Date(req.body.booking_date);
    bookingReq.booking_time = req.body.booking_time;
    bookingReq.location_id = req.body.location_id;
    bookingReq.status = req.body.status;
    bookingModel.updateBookingByID(req.params.booking_id, bookingReq).then((booking) => {
        res.send(booking);
    }).catch((err) => {
        res.status(500).send(err);
    });
})

app.delete('/bookings/:booking_id', (req, res) => {
    bookingModel.deleteBookingByID(req.params.booking_id).then((booking) => {
        res.send(booking);
    }).catch((err) => {
        res.status(500).send(err);
    });
})


//Nurse APIs

app.get('/bookingdata', (req, res) => {
    nurseService.getBookingDataForNurse(req, res);
})

app.get('/userbookings', (req, res) => {
    nurseService.getUserBookingsForDay(req, res).then((bookings) => {
        res.send(bookings);
    }).catch((err) => {
        res.send(err);
    });
})

app.get('/nurse/metrics', (req, res) => {
    nurseService.getBookingMetrics(req, res).then((data) => {
        res.send(data);
    }).catch((err) => {
        res.send(err);
    });
})

app.put('/userbooking/:booking_id', (req, res) => {
    var bookingReq = {};
    bookingReq.status = req.body.status;
    nurseService.updateUserBooking(req.params.booking_id, bookingReq).then((booking) => {
        res.send(booking);
    }).catch((err) => {
        res.send(err);
    });
})
// Locations APIs:

app.post('/locations', (req, res) => {
    var locationReq = {};
    // find a way to autoincrement location id***
    locationReq.location_id = req.body.location_id,
        locationReq.address_line = req.body.address_line,
        locationReq.city = req.body.city,
        locationReq.province = req.body.province,
        locationReq.postalCode = req.body.postalCode,
        locationReq.country = req.body.country,
        locationReq.location_type = req.body.location_type,
        locationReq.instructions = req.body.instructions,
        locationReq.start_date = req.body.start_date,
        locationReq.end_date = req.body.end_date,
        locationReq.start_time = req.body.start_time,
        locationReq.end_time = req.body.end_time,
        locationReq.nurse_id = req.body.nurse_id,

        //The vaccine type and quantity is not getting created.
        locationReq.vaccine = [{
            vaccine_type: req.body.vaccine_type,
            quantity: req.body.quantity,
            start_date: req.body.start_date,
            end_date: req.body.end_date
        }]
    locationModel.createNewLocation(locationReq).then((location) => {
        res.send(location);
    }).catch((err) => {
        res.status(500).send(err);
    });
})


app.get('/locations', (req, res) => {
    locationModel.getAllLocations().then((locations) => {
        res.send(locations);
    }).catch((err) => {
        res.status(500).send("Unable to find Locations");
    });
})


app.get('/locations/:location_id', (req, res) => {
    locationModel.getLocationByID(req.params.location_id).then((location) => {
        res.send(location);
    }).catch((err) => {
        res.status(500).send(err);
    });
})

app.put('/locations/:location_id', (req, res) => {
    var locationReq = {};
    locationReq.address_line = req.body.address_line,
        locationReq.city = req.body.city,
        locationReq.province = req.body.province,
        locationReq.postalCode = req.body.postalCode,
        locationReq.country = req.body.country,
        locationReq.location_type = req.body.location_type,
        locationReq.instructions = req.body.instructions,
        locationReq.start_date = req.body.start_date,
        locationReq.end_date = req.body.end_date,
        locationReq.start_time = req.body.start_time,
        locationReq.end_time = req.body.end_time,
        locationReq.nurse_id = req.body.nurse_id,
        locationReq.vaccine = [{
            vaccine_type: req.body.vaccine_type,
            quantity: req.body.quantity,
            start_date: req.body.start_date,
            end_date: req.body.end_date
        }]
    locationModel.updateLocationByID(req.params.location_id, locationReq).then((location) => {
        res.send(location);
    }).catch((err) => {
        res.status(500).send(err);
    });
})


app.delete('/locations/:location_id', (req, res) => {
    locationModel.deleteLocationByID(req.params.location_id).then((location) => {
        res.send(location);
    }).catch((err) => {
        res.status(500).send(err);
    });
})


//Get all vaccines

app.get('/vaccines', (req, res) => {
    vaccineModel.getAllVaccines().then((vaccines) => {
        res.send(vaccines);
    }).catch((err) => {
        res.status(500).send("Unable to find vaccines");
    });
})

// setup http server to listen on HTTP_PORT
app.listen(HTTP_PORT, () => { console.log("server listening on port: " + HTTP_PORT) });

