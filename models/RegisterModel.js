import mongoose, { Schema } from "mongoose";

const RegisterSchema = new Schema(
    {
        name : {
            type : String ,
            required : true,
        },
        email : {
            type : String ,
            required : true,
            unique : true,
        },
        password : {
            type : String,
            required : true,
            unique : true,
        },
    }
);

const Register = mongoose.model('register' , RegisterSchema);

export default Register;