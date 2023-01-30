import db from "../model/index.js";
import axios from "axios";
import {Op} from "sequelize"

export class Pay {
  async pay(req, res) {
    try {
      
   
    // console.log(req.body)
    let data = {
      MerchantID: "6cded376-3063-11e9-a98e-005056a205be" ,
      Amount: req.body.amount ,
      CallbackURL: "http://127.0.0.1:7000/api/v1/payment",
      Description: "افزایش اعتبار حساب کاربری ",
      // metadata: [{ email: "info@email.com" }, { mobile: "09121234567" }],
    };
    const response = await axios.post(
      "https://api.zarinpal.com/pg/v4/payment/request.json",
      data
    );
    // console.log(response.data.data.authority)
    // console.log(response.data.data)
    
    if (response.data.data.code == 100) {
      const trans=await db.Transaction.findOne({
        where:{
          [Op.and]:[{userId:req.body.userId },{subscriptionId:req.body.subscriptionId }]
        }
      })
      let newPayment;
      if (!trans) {
          newPayment = await db.Transaction.create({
          user: req.user ? req.user.username : req.body.email,
          amount: req.body.amount,
          resnumber: response.data.data.authority,
          subscriptionId: req.body.subscriptionId,
          userId: req.body.userId ? req.body.userId : null,
        });
      }else{
        const trans=await db.Transaction.update({
          user: req.user ? req.user.username : req.body.email,
          amount: req.body.amount,
          resnumber: response.data.data.authority,
          subscriptionId: req.body.subscriptionId,
          userId: req.body.userId ? req.body.userId : null,
        },{
          where:{
            [Op.and]:[{userId:req.body.userId },{subscriptionId:req.body.subscriptionId }]
          }
        })
      }


        res.redirect(`https://www.zarinpal.com/pg/StartPay/${response.data.data.authority}`);
      res.send(response.data.data);
    } else {
      res.send("");
    }
  } catch (error) {
      // console.log(error)
  }
  }

  async payCallbak(req, res, next) {
    try {
      // if(req.query.Status  && req.query.Status !== "OK"){
      //   return res.send('تراکنش ناموفق');
      // }
      // console.log(req.query);
      // console.log( req.query.Authityor);

      let payment = await db.Transaction.findOne({
        where: { resnumber: req.query.Authority },
      });
      if (!payment) return res.send("همچین تراکنشی وجود ندارد");
      let params = {
        MerchantID: "6cded376-3063-11e9-a98e-005056a205be",
        Amount: payment.amount,
        Authority: req.query.Authityor,
      };

      const response = await axios.post(
        "https://www.zarinpal.com/pg/rest/WebGate/PaymentVerification.json",
        params
      );
      //   if(response.data.data.code == 100){
      // console.log(response.data);
      if (response.data.Status != 100) {
        let payment1 = await db.Transaction.update(
          { status: true, payment: true },
          { where: { resnumber: req.query.Authority } }
        );
        // console.log(payment1 );
        const order = await db.Subscription.update(
          { status: true,month:payment?.createdAt },
          {
            where: { id: payment.subscriptionId },
          }
        );
          // console.log(order)     
        return res.send("تراکنش موفق");
      } else {
        return res.send("تراکنش ناموفق");
      }
    } catch (err) {
      next(err);
    }
  }
}
