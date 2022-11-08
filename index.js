const express = require('express')
const cors = require('cors')
const app = express();
const port = process.env.PORT || 5000

// middle waers
app.use(cors())
app.use(express.json())

app.get('/', (req, res)=>{
    res.send("Food COURT SERVER IS RUNNING")
})


app.listen(port, ()=>{
    console.log(`Food court is running on ${port}`);
})