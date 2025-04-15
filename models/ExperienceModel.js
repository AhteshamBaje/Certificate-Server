import mongoose, { Schema } from "mongoose";

const ExperienceSchema = new Schema(
  {
    employeName: {
      type: String,
      required: true
    },
    email :{
      type : String,
      required : true,
      unique : true,
    },
    jobRole: {
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
    ReferenceNumber: {
      type: String,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);


// ✅ Fixed middleware to ensure unique `certificateNumber`
ExperienceSchema.pre('save', async function (next) {
  if (this.isNew) {
    const currentYear = new Date().getFullYear();
    let randomFourDigit;
    let uniqueReferenceNumber;
    let existingReferenceNumber;

    let splitedTitle = this.jobRole.split(" ");
    let TitleId = "";
    for (let i = 0; i < splitedTitle.length; i++) {
      let word = splitedTitle[i];
      TitleId += word[0] 
    }

    do {
      randomFourDigit = Math.floor(1000 + Math.random() * 9000);
      uniqueReferenceNumber = `FS/${TitleId}/${currentYear}/${randomFourDigit}`;
      existingReferenceNumber = await this.constructor.findOne({
        ReferenceNumber: uniqueReferenceNumber,
      });
    } while (existingReferenceNumber); // Ensure uniqueness

    if(this.ReferenceNumber){
      const parts = this.ReferenceNumber.split('/');
      this.ReferenceNumber = `FS/${TitleId}/${currentYear}/${parts[3]}`;
    }else{
      this.ReferenceNumber = `FS/${TitleId}/${currentYear}/${randomFourDigit}`;
    }
  }

  // No need to delete records, just ensure certificateNumber is set
  if (!this.ReferenceNumber) {
    return next(new Error('Reference Number  generation failed'));
  }

  next();
});

const EXPERIENCE = mongoose.model('experience' , ExperienceSchema)

export default EXPERIENCE;