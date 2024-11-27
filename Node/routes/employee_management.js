const employeeModel = require('../models/employee_schema.js');
const express = require('express');
const router = express.Router();
const { body, param, validationResult } = require('express-validator');


router.get('/api/v1/emp/employees', (req, res) => {

        employeeModel.find()
        .then(employees => {
            res.status(200).send(employees);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message
            })
        })
    
});

router.post('/api/v1/emp/employees', [

    body('first_name').notEmpty().withMessage('First name is required'),
    body('last_name').notEmpty().withMessage('Last name is required'),
    body('email').isEmail().withMessage('Invalid email').normalizeEmail(),
    body('position').notEmpty().withMessage('Position is required'),
    body('department').notEmpty().withMessage('Department is required')
],(req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

        if(!req.body) {
            return res.status(400).send({
                message: "Employee content can not be empty"
            });
        }

        const employee = new employeeModel({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            position: req.body.position,
            department: req.body.department
        });

        employee.save()
        .then(data => {
            res.status(201).send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
});






router.get('/api/v1/emp/employees/:eid', [

    param('eid').isMongoId().withMessage('Invalid employee ID')

], (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const employeeId = req.params.eid;

    employeeModel.findById(employeeId)
        .then(employee => {
            if(!employee) {
                return res.status(404).send({
                    message: `Employee not found with id ${employeeId}`
                })
            }
            res.status(200).send(employee);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            })
        })
})


router.put('/api/v1/emp/employees/:eid', [

    param('eid').isMongoId().withMessage('Invalid employee ID'),
    body('email').optional().isEmail().withMessage('Invalid email').normalizeEmail(),
],(req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const employeeId = req.params.eid;

    const employeeFound = employeeModel.findById(employeeId) //find current Employee in the database so we can have default values if certain properties are not passed in the req body
        .then(employee => {
            if(!employee) {
                return res.status(404).send({
                    message: `Employee not found with id ${employeeId}`
                })
            }
        })

    const updateEmployee = {
        first_name: req.body.first_name || employeeFound.first_name, // set as the value listed in the database if a value is not found in the req body
        last_name: req.body.last_name || employeeFound.last_name,
        email: req.body.email || employeeFound.email,
        position: req.body.position || employeeFound.position,
        department: req.body.department || employeeFound.department,
        updated_at: Date.now()
    }

    employeeModel.findByIdAndUpdate(employeeId, updateEmployee, { new: true, useFindAndModify: false})
        .then(employee => {
            res.status(200).send(employee);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            })
        })
});

router.delete('/api/v1/emp/employees/:eid', [
    param('eid').isMongoId().withMessage('Invalid employee ID')
], (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const employeeId = req.params.eid;

        employeeModel.findByIdAndDelete(employeeId)
        .then(employee => {
            if (!employee) {
                return res.status(404).send({
                    message: `Employee not found with id ${employeeId}`
                })
            }
            res.status(200).send(employee);
        }).catch(err => {
            res.status(500).send({
                message: err.message
            })
        })
});




module.exports = router;