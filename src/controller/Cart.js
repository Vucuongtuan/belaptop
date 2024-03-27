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

const addToCart = async (req, res) => {
  try {
    const { userId, listProduct, name, email, phone, address } = req.body;
    const cartData = await User.findOne({ userId });
    if (cartData.length === 0) {
      res.json({ message: "Không thể lưu thông tin khách hàng" });
    }
    const idCart = cartData.data._id;
    const insertDataCart = await Cart.findByIdAndUpdate(
      { _id: idCart },
      {
        name: name,
        email: email,
        phone: phone,
        address: address,
        items: listProduct,
      }
    );
    return res.json({
      message: "Mua hàng thành công",
      data: insertDataCart,
    });
  } catch (error) {
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

module.exports = { addToCart, viewCart };
