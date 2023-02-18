import ForgetPassword from "../../models/ForgetPassword.js";
import moment from 'moment/moment.js';


export const deleteForgetPassword = () => {

    ForgetPassword.remove({ createdAt: { $lte: moment().subtract('20','minutes') } })

}