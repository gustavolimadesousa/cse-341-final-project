const router = require('express').Router();

router.use('/', require('./swagger'));

router.get('/', (req, res) => {
    //#swagger.tags=['Hello World']
    res.send('Welcome to the home page!');
});

router.use('/products', require('./products'));

module.exports = router;