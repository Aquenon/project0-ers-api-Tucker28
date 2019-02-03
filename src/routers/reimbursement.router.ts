import express from 'express';

export const reimbursementRouter = express.Router();

reimbursementRouter.get('', function (req, res) {
    res.send('Got a GET request at /reimbursement')
})

reimbursementRouter.post('', function (req, res) {
    res.send('Got a POST request at /reimbursement')
})

reimbursementRouter.put('', function (req, res) {
    res.send('Got a PUT request at /reimbursement')
})

reimbursementRouter.patch('', function (req, res) {
    res.send('Got a PATCH request at /reimbursement')
})
reimbursementRouter.delete('', function (req, res) {
    res.send('Got a DELETE request at /reimbursement')
})
