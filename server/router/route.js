import { Router } from "express"
const router = Router();

/** import all controllers */
import * as controller from '../controllers/appController.js'
import Auth, { localVariables } from '../middleware/auth.js'

/** POST Method */
router.route('/register').post(controller.register); // register user
// router.route('/registerMail').post(); //send the email
router.route('/authenticate').post((req, res) => res.end()); // authenticate user
router.route('/login').post(controller.verifyUser, controller.login); // login in app

/** GET Method */
router.route('/user/:username').get(controller.getUser) // user with username
router.route('/generateOTP').get(controller.verifyUser, localVariables, controller.generateOTP) // generate random OTP
router.route('/verifyOTP').get(controller.verifyOTP) // verify generated OTP
router.route('/createResetSession').get(controller.createResetSession) // reset all the variables


/** PUT Method */
router.route('/updateUser').put(Auth, controller.updateUser); // is used to update the user profile
router.route('/resetPassword').put(controller.verifyUser, controller.resetPassword); // used to reset password



export default router;