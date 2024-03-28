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
    const { userId, listProduct, name, email, phone, address, total } =
      req.body;
    const idUser = await User.findOne({ _id: userId });
    // if (idUser.length === 0) {
    //   res.json({ message: "Không thể lưu thông tin khách hàng" });
    // }
    console.log("====================================");
    console.log(idUser.cartID);
    console.log("====================================");
    const idCart = idUser.cartID;
    const insertDataCart = await Cart.findByIdAndUpdate(
      idCart,
      {
        name: name,
        email: email,
        phone: phone,
        address: address,
        total: total,
        items: listProduct,
      },
      { new: true }
    );
    return res.json({
      message: "Mua hàng thành công",
      data: insertDataCart,
    });
  } catch (error) {
    console.log("====================================");
    console.log(error);
    console.log("====================================");
    return res.status(500).send(error);
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
