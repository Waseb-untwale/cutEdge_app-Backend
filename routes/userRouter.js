const userCtrl = require('../controllers/userCtrl')
const router = require('express').Router()
const verifyUser = require('../middleware/authmiddleware')

router.post('/register', userCtrl.register)
router.post('/login', userCtrl.login)
router.get("/logout", userCtrl.logout)
router.put('/upDateProfile',verifyUser,userCtrl.updateProfile)
router.put('/upDatePassword', verifyUser,userCtrl.updatePassword)
router.get('/getProfile',verifyUser, userCtrl.getProfile)
module.exports = router
