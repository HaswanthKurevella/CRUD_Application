const express = require("express")
const bodyParser = require("body-parser")
const app = express()
const mongoose = require('mongoose')
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: true }))
mongoose.connect('mongodb://127.0.0.1:27017/track')
    .then((result) => {
        console.log('connected to db');
    })
    .catch((err) => {
        console.log(err);
    });

const employeeSchema = new mongoose.Schema(
    {
        name: String,
        age: Number,
        salary: Number,
        city: String
    }
)

const employeeModel = mongoose.model("employ1", employeeSchema)

app.get('/', (req, res) => {
    res.render('index')

})

app.post('/insert', (req, res) => {
    const newEmployee = new employeeModel(
        {
            name: req.body.name,
            age: req.body.age,
            city: req.body.city,
            salary: req.body.salary
        }
    )
    employeeModel.insertMany([newEmployee])
        .then((docs) => {
            console.log(docs)
            res.redirect('/seedb')
        })
        .catch((err) => console.log(err))

})
app.post('/goseedb',(req,res)=>{
    res.redirect('/seedb')
})
app.post('/goinsert',(req,res)=>{
    res.redirect('/')
})
app.post('/update', (req, res) => {
    employeeModel.findOneAndUpdate({ _id: req.body.Id},
    {$set:{ name: req.body.name,age: req.body.age,city: req.body.city,
     salary: req.body.salary}})
        .then(() => {
            console.log('Inserted successfully')
            res.redirect('/seedb')
        })
        .catch((err) => {
            console.log(err)
        })
})
app.post('/updatedocs',(req,res)=>{

    const uid=req.body.UId
    employeeModel.findOne({_id:uid})
    .then((udata) => {
        res.render('update', { db: udata })
        console.log(udata)
    })
    .catch((error) => console.log(error))

})

app.get('/seedb', (req, res) => {
    employeeModel.find()
        .then((udata) => {
            res.render('seedb', { db: udata })
            console.log("data retrived successfully")
        })
        .catch((error) => console.log(error))


})
app.get('/delete',(req,res)=>{
    employeeModel.find()
        .then((udata) => {
            console.log(udata)
            res.render('delete', { db: udata })
        })
        .catch((error) => console.log(error))
})

app.post('/deletedocs',(req,res)=>{
    console.log(req.body.Id);
    employeeModel.deleteOne({_id:req.body.Id})
        .then(()=>{
            res.redirect('/delete')
        })
        .catch((err)=>console.log(err))
})

app.listen(3000, () => {
    console.log('server started at port 3000')
})
