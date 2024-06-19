
const express = require('express');
const router = express.Router();

router.get('/add-product', (req, res) => {
    res.send(`
        <form action="/admin/add-product" method="POST">
            <label for="name">Product Name:</label>
            <input type="text" id="name" name="name"><br><br>
            <label for="size">Product Size:</label>
            <input type="text" id="size" name="size"><br><br>
            <button type="submit">Submit</button>
        </form>
    `);
});

router.post('/add-product', (req, res) => {
    const { name, size } = req.body;
    console.log(`Product Name: ${name}, Product Size: ${size}`);
    res.redirect('/admin/add-product');
});

module.exports = router;
