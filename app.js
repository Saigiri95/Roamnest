
if(process.env.NODE_ENV !="production"){
   require('dotenv').config()
}

const express =require("express");
const app=express();
const mongoose=require("mongoose");
const ejsMate = require("ejs-mate");

// const MONGO_URL ="mongodb://127.0.0.1:27017/Wonderlust";
// console.log(process.env.ATLASDB_URL);
const dbUrl = process.env.ATLASDB_URL;


const methodOverride = require("method-override");
const wrapAsync = require("./utils/wrapAsync.js")
const ExpressError = require("./utils/ExpressError.js")
const {listingSchema , reviewSchema} = require("./schema.js")

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo");

const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("./models/user.js");



app.use(cookieParser());

const listings = require("./routes/listing.js")
const reviews = require("./routes/review.js")

const path = require("path");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const store = MongoStore.create({
  mongoUrl: dbUrl,
  touchAfter: 24 * 3600,
});




const sessionOptions = {
  store,

  secret:process.env.SECRET,
  resave:false,
  saveUninitialized:false,
  cookie:{
    expires: Date.now() +7 *24 * 60*60*1000,
    maxAge:7 *24 * 60*60*1000,
    httpOnly : true,
  }
};

store.on("error", function(e){
  console.log("SESSION STORE ERROR", e);
});
 

// app.get("/", (req ,res)=>{
//     res.send("hii ,Iam root");
// });



app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());



passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// demoo user
// app.get("/demouser", async (req, res) => {

//     let fakeUser = new User({
//         email: "student@gmail.com",
//         username: "delta-student",
//     });

//     let registeredUser = await User.register(fakeUser, "helloworld");

//     res.send(registeredUser);
// });


// middleware for flash
app.use((req,res,next)=>{
  res.locals.success = req.flash("success");
   res.locals.error = req.flash("error");
   res.locals.currUser = req.user;

  console.log(res.locals.success);
  next();
})


// router ke method ko work karne ke liye

app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter)




main().catch(err => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);
  console.log("MongoDB connected");
};


// express error dikhna galat route pe jane eke bad
app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});

// middleware define to handle app.post 
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("Error.ejs",{message});
  // res.status(statusCode).send(message);
});


app.listen(8080, () =>{
    console.log("server listening to port 8080");
});

// index route

// new show se pahle taki new ko id na samje 

// new route

//CREATE ROUTE
// all data from new add
// try & catch used for below app.use to solve middleware error ids some value was missing

// app.get("/testListing", async (req, res) => {
//   let sampleListing = new Listing({
//     title: "My New Villa",
//     description: "By the beach",
//     price: 1200,
//     location: "Calangute, Goa",
//     country: "India",
//   });

//   await sampleListing.save();
//   console.log("sample was saved");
//   res.send("successful testing");
// });





