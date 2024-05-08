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
const { createInvoice } = require("../middleware/invoice/createInvoice");
const { User, Cart, ProductLaptop, Keybourd, Mouse } = require("../models");

const addToCart = async (req, res) => {
  try {
    const { userId, listProduct, name, email, phone, address, total } =
      req.body;
    const idUser = await User.findOne({ _id: userId });

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
    for (const productId of listProduct) {
      const search = await Promise.all([
        ProductLaptop.findById(productId._id),
        Mouse.findById(productId._id),
        Keybourd.findById(productId._id),
      ]);
      if (search[0] !== null) {
        const convertNumber = parseInt(search[0].totalPurchases);
        const updateNumber = convertNumber + 1;
        const string = updateNumber.toString();

        await ProductLaptop.findByIdAndUpdate(productId._id, {
          $set: { totalPurchases: string },
          $inc: { inventory: -1 },
        });
      } else if (search[1] !== null) {
        const convertNumber = parseInt(search[1].totalPurchases);
        const updateNumber = convertNumber + 1;
        const string = updateNumber.toString();

        await Mouse.findByIdAndUpdate(productId._id, {
          $set: { totalPurchases: string },
          $inc: { inventory: -1 },
        });
      } else if (search[2] !== null) {
        const convertNumber = parseInt(search[2].totalPurchases);
        const updateNumber = convertNumber + 1;
        const string = updateNumber.toString();

        await Keybourd.findByIdAndUpdate(productId._id, {
          $set: { totalPurchases: string },
          $inc: { inventory: -1 },
        });
      }
    }
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
