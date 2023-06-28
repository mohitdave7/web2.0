const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const {save_user_information, get_total_amount} = require('./models/server_db');
const path  = require('path');
const publicPath = path.join(__dirname, './public');
var paypal = require('paypal-rest-sdk');
const session = require('express-session');



app.use(session({
    secret: 'my web app',
    cookie:{maxAge : 60000}
}))



//handling all the parsing
app.use(bodyParser.json());
app.use(express.static(publicPath));

//paypal configuration
paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': 'AcKiGWqOXoN9WbJc6dOe47u6yMeyvEvStNpzoveACYrahKpmUY9kKwEkuGdurYI-nhiWMhLY3WFLir9N',
    'client_secret': 'EELx-xltTaDGuM0I7G0TeE7_z519kyDy5ASMduOC2TuWD1xr84GVh5-vYu5ATWNBqeK9fCZESP0Tf0jD'
  });

app.post('/post_info', async (req, res) => {
    var email = req.body.email;
    var amount = req.body.amount;
    if (amount <= 1) {
      return res.send({ error: true, message: 'amount must be greater than one' });
    }
  
    try {
        var fee_amount = amount * 0.9;
      const result = await save_user_information({ amount: amount, email: email });
        req.session.paypal_amount = amount;
      var create_payment_json = {
                    "intent": "sale",
                    "payer": {
                        "payment_method": "paypal"
                    },
                    "redirect_urls": {
                        "return_url": "http://localhost:5000/success",
                        "cancel_url": "http://localhost:5000/cancel"
                    },
                    "transactions": [{
                        "item_list": {
                            "items": [{
                                "name": "Lottery",
                                "sku": "Funding",
                                "price": amount,
                                "currency": "USD",
                                "quantity": 1
                            }]
                        },
                        "amount": {
                            "currency": "USD",
                            "total": amount,
                        },
                        "payee" : { "email": "sb-y5twi26188419@business.example.com"},
                        "description": "Lottery Purchase."
                    }]
                };
      paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
          throw error;
        } else {
          let approvalUrl;
          for (var i = 0; i < payment.links.length; i++) {
            if (payment.links[i].rel == 'approval_url') {
              approvalUrl = payment.links[i].href;
              break;
            }
          }
          if (approvalUrl) {
            return res.send(approvalUrl);
          } else {
            console.log("Approval URL not found.");
            return res.status(500).send("Error creating PayPal payment");
          }
        }
      });
    } catch (error) {
      console.error("Error saving user information:", error.message);
      res.status(500).send("Error saving user information");
    }
  });

  app.get('/success',async (req,res)=>{
    const payerId =req.query.PayerID;
    const paymentId =req.query.paymentId;
    var execute_payment_json ={
        "payer_id": payerId,
        "transactions": [{
            amount:{
                "currency" : "USD",
                total : req.session.paypal_amount
            }
        }],
    }
    paypal.payment.execute(paymentId,execute_payment_json,function(err,payment){
        if(err){
            console.log(err.response);
            throw err;
        }else{
            console.log(payment);
        }

    })
    res.redirect('http://localhost:5000')

  })
  
app.get('/get_info', async (req,res)=>{
    try{

        var result = await get_total_amount();
        res.send(result)
    }catch(error){
        console.error("Error getting total amount:", error.message);
        res.status(500).send("Error Getting total amount");
      
    }
});






app.listen(5000,()=>{
    console.log('listening on port on 5000');
})