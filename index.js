const express=require('express');

const bodyParser=require('body-parser');

const {getDatabyDate,averageAmount,topNuserInAMonth, topPotentialCustomer,highestTransHour,getLoyaltyScore}=require('./query')

const app=express();

app.use(bodyParser.json());

app.use(
    bodyParser.urlencoded({extended:true})
)



app.get('/',(req,res)=>{
    res.send('Kclimb assignment....');
})


app.get('/avg-trans-amt',averageAmount);

app.get('/all-trans',getDatabyDate);

app.post('/top-users',topNuserInAMonth)

app.get('/potential-users',topPotentialCustomer)

app.get('/hightest-trans-hour',highestTransHour)

app.get('/loyalty-score',getLoyaltyScore)


const PORT=3000
app.listen(PORT,()=>{
    console.log("Server started");
})