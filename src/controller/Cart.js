// // controllers/cartController.js
// const { Cart, ProductLaptop, Mouse } = require("../models/Cart");

// const addToCart = async (req, res) => {
//   try {
//     const { userId, productId, productType, quantity } = req.body;
//     let cart = await Cart.findOne({ userId });
//     if (!cart) {
//       cart = await Cart.create({ userId, items: [] });
//     }
//     const existingItem = cart.items.find((item) =>
//       item.productId.equals(productId)
//     );
//     if (existingItem) {
//       existingItem.quantity += quantity || 1;
//     } else {
//       cart.items.push({ productId, productType, quantity: quantity || 1 });
//     }
//     await cart.save();
//     return res.json(cart);
//   } catch (error) {
//     return res.status(500).send("Internal Server Error");
//   }
// };

// const viewCart = async (req, res) => {
//   try {
//     const { userId } = req.params;

//     const cart = await Cart.findOne({ userId }).populate("items.productId");

//     res.json(cart);
//   } catch (error) {
//     console.error("Error viewing cart:", error.message);
//     res.status(500).send("Internal Server Error");
//   }
// };

// module.exports = { addToCart, viewCart };
// controllers/cartController.js
const { User, Cart, Invoice, Hoadon } = require("../models");
const nodemailer = require("nodemailer");
const { createToPdf } = require("./invoicesController");
const LIMIT = 10;
const addToCart = async (req, res) => {
  try {
    const { userId, listProduct, name, email, phone, address, total } =
      req.body;
    const cartData = await User.findOne({ _id: userId });
    if (cartData === null) {
      res.status(404).json({ message: "Không thể lưu thông tin khách hàng" });
      return;
    }

    const idCart = cartData.cartID.toString();
    const cart = await Cart.findById(idCart);
    const hasExistingItem = cart.items.length > 0;
    const newItem = {
      products: listProduct.map((product) => ({
        idProduct: product._id,
        thumbnail: product.thumbnail,
        name: product.name,
        total: parseInt(product.total),
        description: product.description,
        quantity: 1,
      })),
      total: parseInt(total),
      status: "Đang đóng gói",
    };
    const totalType = typeof total === "number" ? total : parseInt(total);
    const tongTotal = cart.total + totalType;

    const cartUpdate = await Cart.findByIdAndUpdate(idCart, {
      name,
      email,
      phone,
      address,
      total: tongTotal,
      $push: {
        items: {
          $each: [newItem],
          $position: hasExistingItem ? cart.items.length : 0,
        },
      },
    });

    await createToPdf(userId, total, name, phone, address, email, listProduct);

    await Hoadon.create({
      name,
      phone,
      address,
      email,
      status: "Đang đóng gói",
      total: total,
      items: listProduct,
      idUser: userId,
    });
    return res.json({
      message: "Mua hàng thành công",
      data: cartUpdate,
    });
  } catch (error) {
    console.log("====================================");
    console.log(error);
    console.log("====================================");
    return res.status(500).send("Internal Server Error");
  }
};

const viewCart = async (req, res) => {
  try {
    const { userId } = req.body;

    const cart = await Cart.findOne({ userId }).populate("items.productId");

    res.json(cart);
  } catch (error) {
    console.error("Error viewing cart:", error.message);
    res.status(500).send("Internal Server Error");
  }
};
const getAllHoaDon = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const pageNumber = parseInt(page) || 1;
    const totalDocuments = await Hoadon.countDocuments({});
    const totalPages = Math.ceil(totalDocuments / LIMIT);
    const get = await Hoadon.find({})
      .skip((pageNumber - 1) * LIMIT)
      .limit(limit || LIMIT);

    if (get.length === 0) {
      return res.json({
        status: 404,
        message: "Không có sản phẩm nào!!!",
      });
    }

    return res.json({
      message: "Lấy all hóa đơn thành công",
      page: page || 1,
      totalPages: totalPages,
      data: get,
    });
  } catch (error) {
    console.error("Error viewing cart:", error.message);
    res.status(500).send("Internal Server Error");
  }
};
const getHoaDonByUser = async (req, res) => {
  try {
    const id = req.body.id;
    const get = await User.findOne({ _id: id }).populate("cartID");
    if (get === null) {
      return res.status(404).json({
        message: "Không có sản phẩm nào!!!",
      });
    }
    return res.json({
      message: "Lấy all hóa đơn thành công",

      data: get,
    });
  } catch (error) {
    console.error("Error viewing cart:", error.message);
    res.status(500).send("Internal Server Error");
  }
};
const updateHoaDonByUser = async (req, res) => {
  try {
    const { id, idUser, status } = req.body;

    const update = await Hoadon.findOneAndUpdate(
      { _id: id },
      { $set: { status: status } },
      { new: true }
    );

    if (update === null) {
      res.json({
        message: "Sửa status thất bại",
        status: 404,
      });
      return;
    }
    return res.json({
      status: 200,
      message: "Cập nhật thành công",
      data: update,
    });
  } catch (error) {
    console.error("Error viewing cart:", error.message);
    res.status(500).send("Internal Server Error");
  }
};
module.exports = {
  addToCart,
  viewCart,
  getAllHoaDon,
  getHoaDonByUser,
  updateHoaDonByUser,
};
