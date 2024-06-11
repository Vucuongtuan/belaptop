const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    name: String,

    address: String,
    password: String,
    email: String,
    phone: String,
    cartID: { type: Schema.Types.ObjectId, ref: "cart" },
  },
  { collection: "User" }
);

const CartSchema = new Schema(
  {
    name: String,
    email: String,
    phone: Number,
    address: String,
    total: Number,
    items: [
      {
        products: [
          {
            idProduct: String,
            thumbnail: String,
            name: String,
            total: Number,
            description: String,
            quantity: { type: Number, default: 1 },
          },
        ],
        total: Number,
        status: { type: String, default: "Đang đóng gói" },
      },
    ],
  },
  { collection: "cart" }
);
const ProductTypeLaptopSchema = new Schema(
  {
    name_product_type: String,
    description: String,
    product_brand: {
      type: Schema.Types.ObjectId,
      ref: "brands",
      required: true,
    },
    create_date: {
      type: Date,
      default: Date.now,
    },
    update_date: {
      type: Date,
      default: Date.now,
    },
  },
  { collection: "type_product_laptop" }
);
const ProductLaptopSchema = new Schema(
  {
    name: String,
    total: Number,
    description: String,
    brands: String,
    thumbnail: [
      {
        type: String,
      },
    ],
    totalPurchases: Number,
    details: {
      cpu: String,
      ram: String,
      hard_drive: String,
      card_graphics: String,
      pin: String,
      screen: String,
      connector: [
        {
          type: String,
        },
      ],
      keyboard: String,
      audio: String,
      wifi_bluetooth: String,
      cam: String,
      system: String,
      weight: String,
      size: String,
      brands: String,
    },
    discount_percent: Number,
    inventory: Number,
    product_category: {
      type: Schema.Types.ObjectId,
      ref: "type_product_laptop",
      required: true,
    },
    product_brand: {
      type: Schema.Types.ObjectId,
      ref: "brands",
      required: true,
    },
    product_content: {
      type: Schema.Types.ObjectId,
      ref: "post_content",
      required: true,
    },
    create_product: { type: Date, default: Date.now },
    update_product: { type: Date, default: Date.now },
  },
  { collection: "product_laptop" }
);
const MouseTypeSchema = new Schema(
  {
    name_type: String,
    description: String,
    product_brand: {
      type: Schema.Types.ObjectId,
      ref: "brands",
      required: true,
    },
    create_date: { type: Date, default: Date.now() },
    update_date: { type: Date, default: Date.now() },
  },
  {
    collection: "type_product_mouse",
  }
);
const MouseSchema = new Schema(
  {
    name: String,
    total: Number,
    guarantee: String,
    description: String,
    totalPurchases: Number,
    brands: String,
    thumbnail: [
      {
        type: String,
      },
    ],
    details: {
      color: String,
      polling_rate: String,
      microprocessor: String,
      manufacturer: String,
      similar: String,
      connector: [
        {
          type: String,
        },
      ],
      wireless_technology: String,
      battery: String,
      sensor: String,
      resolution: String,
      max_acceleration: String,
      max_speed: String,
      size: String,
      weight: Number,
    },
    discount_percent: Number,
    inventory: Number,
    product_type__mouse: {
      type: Schema.Types.ObjectId,
      ref: "type_product_mouse",
      required: true,
    },
    product_brand: {
      type: Schema.Types.ObjectId,
      ref: "brands",
      required: true,
    },
    product_content: {
      type: Schema.Types.ObjectId,
      ref: "post_content",
      required: true,
    },
  },
  {
    collection: "product_mouse",
  }
);

const BannerQcSchema = new Schema(
  {
    thumbnail: String,
    description: String,
  },
  { collection: "banner-qc" }
);
const BrandsSchema = new Schema(
  {
    name: String,
    type: String,
    description: String,
    thumbnail: String,
  },
  {
    collection: "brands",
  }
);
const KeyboardSchema = new Schema(
  {
    name: String,
    total: Number,
    brands: String,
    thumbnail: [
      {
        type: String,
      },
    ],
    layout: String,
    description: String,
    totalPurchases: Number,
    switch_key: String,
    pin: String,
    personal: String,
    foam: String,
    weight: String,
    size: String,
    connector: [
      {
        type: String,
      },
    ],
    configuration: String,
    keycap: String,
    support: String,
    accessory: String,
    software: String,
    compatibility: String,
    discount_percent: Number,
    inventory: Number,
    create_date: { type: Date, default: Date.now() },
    update_date: { type: Date, default: Date.now() },
    product_type_keybourd: {
      type: Schema.Types.ObjectId,
      ref: "type_product_keybourd",
      required: true,
    },
    product_brand: {
      type: Schema.Types.ObjectId,
      ref: "brands",
      required: true,
    },
    product_content: {
      type: Schema.Types.ObjectId,
      ref: "post_content",
      required: true,
    },
  },
  {
    collection: "product_keyboard",
  }
);
const KeybourdTypeSchema = new Schema(
  {
    name_type: String,
    description: String,
    product_brand: {
      type: Schema.Types.ObjectId,
      ref: "brands",
      required: true,
    },

    create_date: { type: Date, default: Date.now() },
    update_date: { type: Date, default: Date.now() },
  },
  {
    collection: "type_product_keybourd",
  }
);
const PostContentSchema = new Schema(
  {
    name: String,
    description: String,
    content: String,
    productCollection: {
      type: Schema.Types.ObjectId,
      refPath: "productCollectionRef",
      required: true,
    },
    productCollectionRef: {
      type: String,
      enum: ["product_laptop", "product-mouse", "product_keyboard"],
    },
  },
  { collection: "post_content" }
);
const RevenueSchema = new Schema(
  {
    total: [String],
    products: [
      {
        _id: String,
        thumbnailUrl: String,
        name: String,
        revenue: [String],
      },
    ],
    create_product: { type: Date, default: Date.now },
    update_product: { type: Date, default: Date.now },
  },
  { collection: "revenue" }
);
const otpSchema = new mongoose.Schema({
  email: String,
  otp: String,
  createdAt: { type: Date, default: Date.now, expires: 300 }, // Set expiry for 5 minutes
});

const BlogSchema = new Schema(
  {
    title: String,
    body: String,
    thumbnail: String,
    description: String,
    author: String,
    idAuthor: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    idProduct: String,
    date_create: { type: Date, default: Date.now },
  },
  { collection: "blogs" }
);
const LikeAndCommentSchema = new Schema({
  idProduct: String,
  comments: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      name: String,
      comment: String,
      rating: {
        type: Number,
        min: 1,
        max: 5,
      },
      date_create: { type: Date, default: Date.now() },
      likes: [
        {
          userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
        },
      ],
      replies: [
        {
          userId: String,
          name: String,
          comment: String,
          date_create: { type: Date, default: Date.now() },
        },
      ],
    },
  ],
});
const AdminSchema = new mongoose.Schema({
  email: String,
  password: String,
  phone: String,
  dateOfBirth: Date,
  name: String,
  gender: String,
  address: String,
  create_date: { type: Date, default: Date.now },
  update_date: { type: Date, default: Date.now },
});
const adminOnline = new Schema({
  idAdmin: String,
  name: String,
  date_create: { type: Date, default: Date.now() },
});
const InvoiceSchema = new Schema(
  {
    userId: String,
    total: String,
    name: String,
    phone: String,
    address: String,
    email: String,
    pdf: String,
    listProduct: [
      {
        name: String,
        total: String,
        idProduct: String,
      },
    ],
    date_create: { type: Date, default: Date.now },
  },
  { collection: "invoices" }
);
const HoadonSchema = new Schema({
  name: String,
  email: String,
  phone: String,
  address: String,
  invoice: String,
  status: String,
  total: Number,
  idUser: String,
  items: [
    {
      idProduct: String,
      thumbnail: String,
      name: String,
      total: Number,
      description: String,
      quantity: Number,
    },
  ],
});
const Hoadon = mongoose.model("Hoadon", HoadonSchema);
const Invoice = mongoose.model("invoices", InvoiceSchema);
const AdminOnline = mongoose.model("AdminOnline", adminOnline);
const LikeAndComment = mongoose.model(
  "LikeAndCommentSchema",
  LikeAndCommentSchema
);
const Blog = mongoose.model("blogs", BlogSchema);
const OTP = mongoose.model("Otp", otpSchema);
const User = mongoose.model("User", UserSchema);
const Brands = mongoose.model("brands", BrandsSchema);
const ProductTypeLaptop = mongoose.model(
  "type_product_laptop",
  ProductTypeLaptopSchema
);
const ProductLaptop = mongoose.model("product_laptop", ProductLaptopSchema);
const MouseType = mongoose.model("type_product_mouse", MouseTypeSchema);
const Mouse = mongoose.model("product_mouse", MouseSchema);
const Cart = mongoose.model("cart", CartSchema);
const BannerQc = mongoose.model("banner_qc", BannerQcSchema);
const Keybourd = mongoose.model("product_keyboard", KeyboardSchema);
const KeybourdType = mongoose.model(
  "type_product_keybourd",
  KeybourdTypeSchema
);
const Admin = mongoose.model("admin", AdminSchema);
const PostContent = mongoose.model("post_content", PostContentSchema);
const Revenue = mongoose.model("all_products", RevenueSchema);
module.exports = {
  User,
  ProductTypeLaptop,
  ProductLaptop,
  MouseType,
  Mouse,
  Cart,
  BannerQc,
  Brands,
  Keybourd,
  KeybourdType,
  PostContent,
  Revenue,
  OTP,
  Admin,
  Blog,
  LikeAndComment,
  AdminOnline,
  Invoice,
  Hoadon,
};
