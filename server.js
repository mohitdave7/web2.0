const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const {save_user_information, get_total_amount} = require('./models/server_db');
const path  = require('path');
const publicPath = path.join(__dirname, './public');
//handling all the parsing
app.use(bodyParser.json());
app.use(express.static(publicPath));
app.post('/', async(req,res)=>{
    var email = req.body.email;
    var amount = req.body.amount;
    if(amount <= 1){
        return_info ={};
        return_info.error = true;
        return_info.message = 'amount must be greater than one';
        return res.send(return_info);
    }
  try {
    const result = await save_user_information({ "amount": amount, "email": email });
    res.send(result);
  } catch (error) {
    console.error("Error saving user information:", error.message);
    res.status(500).send("Error saving user information");
  }
})
app.get('/get_total_amount', async (req,res)=>{
    try{

        var result = await get_total_amount();
        console.log(result);
        res.send(result)
    }catch(error){
        console.error("Error getting total amount:", error.message);
        res.status(500).send("Error Getting total amount");
      
    }
});




app.listen(5000,()=>{
    console.log('listening on port on 5000');
})