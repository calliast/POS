const utils = {
    isLoggedIn: function(req,res,next) {
        if (req.session.user) {
            return next()
        }
        res.redirect('/login')
    },
    currencyFormatter: new Intl.NumberFormat('id', {
        style: 'currency',
        currency: 'IDR',

    })
 }

 module.exports = utils