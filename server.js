const bodyParser = require('body-parser')
const express = require('express')
const Student = require('./modals/Student')
const app = express()
const port = 5000
const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/StudentDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true

})

app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({ extended: true }))

app.use(bodyParser.json());

app.get('/', async (req, res) => {

    const students = await Student.find()

    res.render('index', { students })
})

app.post('/save', async (req, res) => {
    const { rollNo, name, degree, city } = req.body

    const students = new Student({ rollNo, name, degree, city })

    await students.save()

    res.redirect('/')
})

app.post('/delete-student/:id', async (req, res) => {
    try {
      const deletedStudent = await Student.findByIdAndDelete(req.params.id);
      if (!deletedStudent) {
        return res.status(404).send('Student not found');
      }
      res.redirect('/');
  
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  });

  app.post('/update-student/:id', async (req, res) => {
    try {
      const { rollNo, name, degree, city } = req.body; // Destructure data from request body
  
      const updatedStudent = await Student.findByIdAndUpdate(
        req.params.id,
        { $set: { rollNo, name, degree, city } }, // Update specific fields
        { new: true } // Return the updated document
      );
  
      if (!updatedStudent) {
        return res.status(404).send('Student not found');
      }
  
      res.redirect('/'); // Send the updated student data
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  });



app.listen(port, () => console.log('Server is running on Port No :', port))