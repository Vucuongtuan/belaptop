const express = require("express")
const routerMouseType = express.Router()
const {getMouseType,postMouseType,updateMouseType,deleteMouseType} = require('../../controller/MouseType');
const { checkMouseType, checkIdMouseType } = require("../../middleware/checkMouseType");


routerMouseType.get('/',getMouseType);
routerMouseType.post('/',checkMouseType,postMouseType);
routerMouseType.put('/update_id',updateMouseType);
routerMouseType.delete('/delete_id',checkIdMouseType, deleteMouseType);


module.exports = routerMouseType;

