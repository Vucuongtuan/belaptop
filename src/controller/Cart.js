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
const { User, Cart } = require("../models");
const LIMIT = 10;
const addToCart = async (req, res) => {
  try {
    const { userId, listProduct, name, email, phone, address } = req.body;
    const cartData = await User.findOne({ _id: userId });
    if (cartData === null) {
      res.status(404).json({ message: "Không thể lưu thông tin khách hàng" });
      return;
    }

    const idCart = cartData.cartID.toString();
    const cart = await Cart.findById(idCart);
    const hasExistingItem = cart.items.length > 0;

    const cartUpdate = await Cart.findByIdAndUpdate(idCart, {
      $push: {
        items: {
          $each: [
            {
              products: listProduct,
              status: "Đang đóng gói",
            },
          ],
          $position: hasExistingItem ? cart.items.length : 0,
        },
      },
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
    const totalDocuments = await Cart.countDocuments({});
    const totalPages = Math.ceil(totalDocuments / LIMIT);
    const get = await Cart.find({})
      .skip((pageNumber - 1) * LIMIT)
      .limit(limit || LIMIT);

    if (get.length === 0) {
      return res.status(404).json({
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
    const { id, idItem, status } = req.body;
    const get = await User.findById(id);
    const idCart = get.cartID;
    const update = await Cart.findOneAndUpdate(
      { idCart, "items._id": idItem },
      { $set: { "items.$.status": status } },
      { new: true }
    );
    return res.json({
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
