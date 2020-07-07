const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const morgan = require("morgan");
const exphbs = require("express-handlebars");
const methodOverride = require("method-override");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const connectDB = require("./config/database");

// Load Config
dotenv.config({ path: "./config/config.env" });

// Passport Config
require("./config/passport")(passport);

// Connect To Database
connectDB();

const app = express();

// Body Parser Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Method Override Middleware
app.use(methodOverride(function(request, response) {
    if (request.body && typeof request.body === "object" && "_method" in request.body) {
        // look in urlencoded POST bodies and delete it
        let method = request.body._method;
        delete request.body._method;
        return method;
    }
}));

// Morgan Middleware
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

// Handlebars Helpers
const { formatDate, scriptTags, truncate, editIcon, select } = require("./helpers/hbsHelper");

// Handlebars Middleware
app.engine(".hbs", exphbs({ helpers: {
    formatDate,
    scriptTags,
    truncate,
    editIcon,
    select
}, defaultLayout: "main", extname: ".hbs" }));
app.set("view engine", ".hbs");

// Sessions Middleware
app.use(session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    cookies: { secure: true },
    store: new MongoStore({ mongooseConnection: mongoose.connection })
}));

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Global Variable Middleware
app.use(function(request, response, next) {
    response.locals.user = request.user || null;
    next();
});

// Static Folder
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/", require("./routes/index"));
app.use("/auth", require("./routes/auth"));
app.use("/stories", require("./routes/stories"));

const PORT = process.env.PORT || 8828;
app.listen(PORT, console.log(`Benion Story Books: Server Started In ${ process.env.NODE_ENV } Mode, On Port ${ process.env.PORT }`));