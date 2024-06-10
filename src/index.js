const express = require("express");
const app = express();
const db = require("./config");
const session = require("express-session");
const accountAPI = require("./service/apiAccount/");
const routerProductType = require("./service/apiProductType/");
const bodyParser = require("body-parser");
const routerProduct = require("./service/apiProduct");
const path = require("path");
const routerMouseType = require("./service/apiMouseType");
const routerMouse = require("./service/apiMouse");
const cors = require("cors");
const routerQcBanner = require("./service/apiQcBanner");
const routerAllProduct = require("./service/apiAllProduct");
const routerBrands = require("./service/apiBrands");
const routerKeybourd = require("./service/apiKeybourd");
const routerKeybourdType = require("./service/apiKeybourdType");
const routerPost = require("./service/apiPostContent");
const routerCart = require("./service/apiCart");
const routerAdmin = require("./service/apiAdmin");
const routerUpload = require("./service/apiUploadImage");
const cookieParser = require("cookie-parser");
const routerToken = require("./service/apiCheckToken");
const routerBlog = require("./service/apiBlog");
const routerComment = require("./service/apiComment");
const invoicesRouter = require("./service/apiInvoice");
const http = require("http").createServer(app);
const io = require("socket.io")(http);
global.io = io;
//setup session cookies
app.use(cookieParser());
app.use(
  session({
    secret: "mySecretKey",
    resave: true,
    saveUninitialized: false,
    cookie: {
      maxAge: 3600000,
      httpOnly: true,
    },
  })
);
app.get("/token", (req, res) => {
  res.json({
    token: req.session.userTokens,
  });
});
app.use(cors());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.get("/post", (req, res) => {
  res.render("post");
});
app.get("/", (req, res) => {
  const data = {
    pageTitle: "Trang chủ",
    message: "List Api",
  };
  res.render("index", data);
});

//static file image
app.use("/image", express.static(path.join(__dirname, "./assets/image")));
app.use(
  "/image/banner",
  express.static(path.join(__dirname, "./assets/image/banner"))
);
app.use(
  "/image/brands",
  express.static(path.join(__dirname, "./assets/image/brands"))
);
app.use(
  "/image/laptop/",
  express.static(path.join(__dirname, "./assets/image/laptop"))
);
app.use(
  "/image/mouse",
  express.static(path.join(__dirname, "./assets/image/mouse"))
);
app.use(
  "/image/keyboard",
  express.static(path.join(__dirname, "./assets/image/keyboard"))
);
app.use(
  "/image/spa",
  express.static(path.join(__dirname, "./assets/image/spa"))
);
app.use("/public", express.static(path.join(__dirname, "./assets/public")));
//static file path
app.use(
  "/assets/brands/",
  express.static(path.join(__dirname, "./assets/brands"))
);
//invoice send mail
app.use(
  "/invoicePDF",
  express.static(path.join(__dirname, "./assets/invoicePDF"))
);

//config .env
require("dotenv").config();

app.use(express.json());
//static routes
app.use("/models/", express.static(path.join(__dirname, "./models/index.js")));

//create bodyParser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//connect db
db.connect();

//router
app.use("/account/", accountAPI);
app.use("/product_type/laptop/", routerProductType);
app.use("/product/laptop/", routerProduct);
app.use("/product_type/mouse/", routerMouseType);
app.use("/product/mouse/", routerMouse);
app.use("/banner/", routerQcBanner);
app.use("/all-product/", routerAllProduct);
app.use("/brands/", routerBrands);
app.use("/product_type/keyboard/", routerKeybourdType);
app.use("/product/keyboard/", routerKeybourd);
app.use("/post-content/", routerPost);
app.use("/cart/", routerCart);
app.use("/admin/", routerAdmin);
app.use("/upload/", routerUpload);
app.use("/token/", routerToken);
app.use("/blog/", routerBlog);
app.use("/comment/", routerComment);
app.use("/invoices", invoicesRouter);

//create connections socket.io
io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("my-event", (data) => {
    console.log("Received data:", data);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

//create and config redis
const initRedis = require("./lib/init.redis");
initRedis.initRedis();

//run server
const port = 4000;
http.listen(port, function () {
  console.log("====================================");
  console.log("Run server on port :" + port);
  console.log("====================================");
});
