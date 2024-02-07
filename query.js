const Pool=require('pg').Pool;

const pool=new Pool({
    user:'postgres',
    host:'127.0.0.1',
    database:'demo',
    password:"root",
    port:5432
});

const getData=(req,res)=>{
    pool.query('SELECT * from transactions limit 20',(error,result)=>{
        if(error){
            throw Error
        }
        res.status(200).json(result.rows)
    })
}


const  averageAmount= async (req,res)=>{
    await pool.query('SELECT AVG("amount") from transactions',(error,result)=>{
        if(error){
            throw Error
        }
        res.status(200).json(result.rows);
    })
}


const getDatabyDate=async(req,res)=>{
    const date=req.query.date
    await pool.query(`SELECT SUM(amount) FROM transactions where timestamp::date = $1`,[date],(error,result)=>{
        if(error){
            throw Error
        }
        res.status(200).json(result.rows);
    })
}

const topNuserInAMonth=async(req,res)=>{
    //pass the month in number and N is the number of user
    console.log(noOfUsers,month);
    await pool.query(`SELECT count(transactionid) as number_of_txn, userid, 
        EXTRACT(MONTH FROM timestamp) AS month
        FROM  transactions GROUP BY userid,EXTRACT(MONTH FROM timestamp)
        HAVING EXTRACT(MONTH FROM timestamp) = $1 
        order by number_of_txn
        LIMIT $2`,[month,noOfUsers],(error,result)=>{
        if(error){
            console.log(error);
            throw Error
        }
        res.status(200).json(result.rows);
    })



}
const topPotentialCustomer=async(req,res)=>{
    await pool.query(`WITH last_month_transactions AS (
        SELECT userid, COUNT(transactionid) AS count_last_month
        FROM public.transactions
        WHERE EXTRACT(MONTH FROM timestamp) = EXTRACT(MONTH FROM (CURRENT_DATE - interval '1 month')::date)
        GROUP BY userid
    ), 
    second_last_month_transactions AS (
        SELECT userid, COUNT(transactionid) AS count_second_last_month
        FROM public.transactions
        WHERE EXTRACT(MONTH FROM timestamp) = EXTRACT(MONTH FROM (CURRENT_DATE - interval '2 month')::date)
        GROUP BY userid
    )
    SELECT last_month.userid
    FROM last_month_transactions last_month
    JOIN second_last_month_transactions second_last_month
    ON last_month.userid = second_last_month.userid
    WHERE last_month.count_last_month > second_last_month.count_second_last_month
    `,(error,result)=>{
        if(error){
            console.log(error);
            throw Error
        }
        res.status(200).json(result.rows);
    })

}
const highestTransHour=async(req,res)=>{
    await pool.query(`select sum(amount) as total_amount, date_part('hour', timestamp) as hour
    FROM public.transactions
   group by  date_part('hour', timestamp)
   order by total_amount desc
   limit 1`,(error,result)=>{
        if(error){
            console.log(error);
            throw Error
        }
        res.status(200).json({"highest-trans-hour":result.rows[0].hour});
    })

}



const getLoyaltyScore=async(req,res)=>{
    await pool.query(``,(error,result)=>{
        if(error){
            console.log(error);
            throw Error
        }
        res.status(200).json({"highest-trans-hour":result.rows[0].hour});
    })

}



module.exports={getDatabyDate,averageAmount,topNuserInAMonth, topPotentialCustomer,highestTransHour,getLoyaltyScore};