const express = require('express');
const router = express.Router();
const dotenv = require('dotenv');

const userModel = require('../models/User');
const {errors, messages} = require('../messages');
const { isLoggedIn } = require('../middlewares/auth');
const products = require('../products');

dotenv.config();

router.get('/info', isLoggedIn, async (req, res) => {
  try {
    const username = req.locals?.loggedInUsername;

    const user = await userModel.findOne({username});
    return res.status(200).json({...user._doc, password: "REDACTED"})
  } catch (err) {
    const {content, code} = errors["UNKNOW_ERROR"];
    return res.status(code).json({content});
  }  
});

router.post('/deposit', isLoggedIn, async (req, res) => {
  try {
    const username = req.locals?.loggedInUsername;
  
    if (!req.body.cardNumber || !req.body.amount) {
      const {content, code} = errors["EMPTY_FIELDS"];
      return res.status(code).json({content});
    }
  
    if (!/^(?:4[0-9]{12}(?:[0-9]{3})?)$/.test(req.body.cardNumber)) { //visa. ex: 4917484589897107, ...
      const {content, code} = errors["WRONG_CARD_NUMBER"];
      return res.status(code).json({content});
    }
    // TODO: check card amount, etc, ...
    if (req.body.amount > 0) {
      await userModel.findOneAndUpdate({username}, {
        $inc: {
          credit: req.body.amount
        }
      });
      const {content, code} = messages["SUCCESS"];
      return res.status(code).cookie("auth", jwtCookie, {
        maxAge: 7200000, //expire after 2 hours
        httpOnly: true,
        secure: true
      }).json({content})
    } else {
      const {content, code} = errors["UNKNOW_ERROR"];
      return res.status(code).json({content});
    }
  } catch (err) {
    const {content, code} = errors["UNKNOW_ERROR"];
    return res.status(code).json({content});
  }
});

router.post('/purchase', isLoggedIn, async (req, res) => {
  try {
    const username = req.locals?.loggedInUsername;
    const credit = req.locals?.credit;
    
    if (!req.body.quantity || !req.body.productId) {
      const {content, code} = errors["EMPTY_FIELDS"];
      return res.status(code).json({content});
    }
  
    const [product] = products.filter(({id}) => id === req.body.productId);
    if (product.instock >= req.body.quantity && /^[0-9]$/.test(req.body.quantity.toString())) {
      const total = req.body.quantity * product.price;
      if (total > 0 && total < credit) {
        // TODO: update to add owned product
        await userModel.findOneAndUpdate({username}, {
          $inc: {
            credit: total * -1
          }
        });
        const {content, code} = messages["SUCCESS"];
        return res.status(code).json({content});
      }
    }
    const {content, code} = errors["NEED_MORE_CREDIT_OR_AMOUNT_INVALID"];
    res.status(code).json({content});
  } catch (err) {
    const {content, code} = errors["UNKNOW_ERROR"];
    res.status(code).json({content});
  } 
});

module.exports = router;
