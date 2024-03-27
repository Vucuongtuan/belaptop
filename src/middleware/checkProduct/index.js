const { Product } = require("../../models");

const checkProduct = async (req,res,next) => {
  try {
    const name_product = req.body.name_product;
    const checkProduct = await Product.find({ name_product: name_product });
console.log('====================================');
console.log("check middeware : " + checkProduct);
console.log('====================================');
    if (checkProduct.length === 0) {
      next();
    }
    res.json({
      name_product: checkProduct.name_product,
      message: "Đã có tên sản phẩm này rồi",
    });
  } catch (err) {
    res.json({
      message: "Lỗi kết nối ,vui long thử lai sau",
    });
  }
};

module.exports = { checkProduct };
