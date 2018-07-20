var express      = require("express"),
    app          = express(),
    bodyParser   = require("body-parser"),
    mongoose     = require("mongoose"),
    flash        = require("connect-flash"),
    passport     = require("passport"),
    LocalStrategy = require("passport-local"),
    Campground   = require("./models/campground"),
    Comment      = require("./models/comment"),
    User         = require("./models/user"),
    methodOverride = require("method-override"),
    seedDB       = require("./seeds");

//ENVIRONMENT VARIABLES
var DATABASEURL = process.env.DATABASEURL || "mongodb://localhost/yelp_camp_12";
// var HOSTIP = process.env.IP || "127.0.0.1";
var HOSTPORT = process.env.PORT || 3000;

//ROUTE REQUIREMENTS
var campgroundRoutes = require("./routes/campgrounds"),
    commentRoutes = require("./routes/comments"),
    indexRoutes      = require("./routes/index");

//DATABASE CONNECTION
// mongoose.connect("mongodb://localhost/yelp_camp_12");
mongoose.connect(DATABASEURL);
// mongodb://<dbuser>:<dbpassword>@ds243441.mlab.com:43441/yelpcamp4646
//APP CONFIGURATION
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB(); //seed the database

//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Cooper is a damn cool cat",
    resave: false,
    saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//MIDDLEWARE
app.use(function(req, res, next){
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    //whatever is inside res.locals is what's available to our template (eg. campground)
    res.locals.currentUser = req.user;
    //next(); is needed to continue the function, as this is middleware
    next();
});

//ROUTE SETUP
//eg. takes the campgroundRoute and appends "/campgrounds" to each
app.use("/", indexRoutes);  
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);


//LISTENER
app.listen(HOSTPORT, function(){
   console.log("The YelpCamp Server Has Started!");
});
