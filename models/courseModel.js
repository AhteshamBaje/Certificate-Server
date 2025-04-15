import mongoose, { Schema } from "mongoose";

const CourseSchema = new Schema(
  {
    studentName: {
      type: String,
      required: true
    },
    email :{
      type : String,
      required : true,
      unique : true,
    },
    title: {
      type: String,
      required: true
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
    },
    certificateNumber: {
      type: String,
      unique: true,
    },
    issuedDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);


// ✅ Fixed middleware to ensure unique `certificateNumber`
CourseSchema.pre('save', async function (next) {
  if (this.isNew) {
    const currentYear = new Date().getFullYear();
    let randomFourDigit;
    let uniqueCertificateNumber;
    let existingCertificate;

    let splitedTitle = this.title.split(" ");
    let TitleId = "";
    for (let i = 0; i < splitedTitle.length; i++) {
      let word = splitedTitle[i];
      TitleId += word[0] 
    }

    do {
      randomFourDigit = Math.floor(1000 + Math.random() * 9000);
      uniqueCertificateNumber = `FS/${TitleId}/${currentYear}/${randomFourDigit}`;
      existingCertificate = await this.constructor.findOne({
        certificateNumber: uniqueCertificateNumber,
      });
    } while (existingCertificate); // Ensure uniqueness

    if(this.certificateNumber){
      const parts = this.certificateNumber.split('/');
      this.certificateNumber = `FS/${TitleId}/${currentYear}/${parts[3]}`;
    }else{
      this.certificateNumber = `FS/${TitleId}/${currentYear}/${randomFourDigit}`;
    }
  }

  // No need to delete records, just ensure certificateNumber is set
  if (!this.certificateNumber) {
    return next(new Error('Certificate number generation failed'));
  }

  next();
});

const Course = mongoose.model('course' , CourseSchema)

export default Course;