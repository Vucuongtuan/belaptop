const { ProductLaptop, Mouse, Keybourd } = require("../../models");

const updateProduct = async (req, res, next) => {
  try {
    const { userId, listProduct, name, email, phone, address, total } =
      req.body;

    const [laptop, mouse, keyboard] = await Promise.all([
      ProductLaptop.findOne({ _id: listProduct[0]._id }),
      Mouse.findOne({ _id: listProduct[0]._id }),
      Keybourd.findOne({ _id: listProduct[0]._id }),
    ]);
    if (laptop !== null) {
      if (laptop.inventory === 0) {
        res.json({
          message: "Đẫ hết hàng",
          status: "failed",
        });
        return;
      }
      await ProductLaptop.updateMany(
        { _id: laptop._id },
        {
          totalPurchases: laptop.totalPurchases + 1,
          inventory: laptop.inventory - 1,
        }
      );
      next();
      return;
    } else if (mouse !== null) {
      if (mouse.inventory === 0) {
        res.json({
          message: "Đẫ hết hàng",
          status: "failed",
        });
        return;
      }
      await Mouse.updateMany(
        { _id: mouse._id },
        {
          totalPurchases: mouse.totalPurchases + 1,
          inventory: mouse.inventory - 1,
        }
      );
      next();
      return;
    } else if (keyboard !== null) {
      if (keyboard.inventory === 0) {
        res.json({
          message: "Đẫ hết hàng",
          status: "failed",
        });
        return;
      }
      await Keybourd.updateMany(
        { _id: keyboard._id },
        {
          totalPurchases: keyboard.totalPurchases + 1,
          inventory: keyboard.inventory - 1,
        }
      );
      next();
      return;
    } else {
      res.status(404).json({
        message: "Không tìm thấy sản phẩm",
      });
    }
  } catch (err) {
    console.log("middleware__updateProduct : ", err);
  }
};

module.exports = updateProduct;
