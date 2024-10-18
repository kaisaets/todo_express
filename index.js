const express = require('express')
const path = require('path')
const fs = require('node:fs')

const app = express()

app.use(express.urlencoded({ extended: true}))

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

const readFile = (filename) => {
    return new Promise((resolve, reject)  => {
        fs.readFile(filename, 'utf8', (err,data) => {
            if (err){
                console.log(err)
                return
            } 
            const tasks = JSON.parse(data)
            resolve(tasks)
        })
    })
}  

const writeFile = (filename, data) => {
    return new Promise((resolve, reject)  => {
        fs.writeFile(filename, data, 'utf8', err => {
            if (err){
                console.error(err)
                return
            } 
            resolve(true)
        })
    })
}  

app.get('/', (req, res)=>{
    readFile('./tasks.json')
    .then((tasks) => {
        console.log(tasks) 
        res.render('index', {tasks: tasks})
    })    
})

app.post('/', (req, res) => {
    console.log('form sent data')
    let task = req.body.task
    readFile('./tasks.json')
    .then((tasks) => {
        let index
        if(tasks.length === 0){
            index = 1
        } else {
            index = tasks[tasks.length-1].id+1 
        }  
        const newTask ={
            id: index,
            task: task
        } 
        tasks.push(newTask)
        console.log(tasks)
        const data = JSON.stringify(tasks, null, 2)
        writeFile('./tasks.json', data)
        res.redirect('/')
    })
})
app.get('/delete-task/:taskId', (req, res) => {
    let deletedTaskId = parseInt(req.params.taskId)
    readFile('./tasks.json')
    .then(tasks => {
        tasks.forEach((task, index) => {
            if(task.id === deletedTaskId){
                tasks.splice(index, 1)
            } 
        })
        const data = JSON.stringify(tasks, null, 2)
        writeFile('./tasks.json', data)
        
        res.redirect('/')
    })
})

app.listen(3001, () => {
    console.log('Server is started http://localhost:3001')
} )