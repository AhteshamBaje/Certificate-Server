import mongoose, { Schema } from 'mongoose'

const offerLetter = new Schema({
    name : {
        type : String,
        require : true
    },
    email : {
        type : String,
        require : true,
        unique : true
    },
    salary : {
        type : Number,
        required : true
    },
    jobRole : {
        type : String,
        require : true
    },
    startDate: {
        type: Date,
        required: true,
      },
    RefereneNo : {
        type : String,
        require : true
    },
    issuedDate: {
      type: Date,
      default: null,
    },
});

offerLetter.pre('save', async function (next) {
    if (this.isNew) {
      const currentYear = new Date().getFullYear();
      let randomFourDigit;
      let uniqueRefereneNo;
      let existingCertificate;
  
      do {
        randomFourDigit = Math.floor(1000 + Math.random() * 9000);
        uniqueRefereneNo = `FS/OFF-LTR/${currentYear}/${randomFourDigit}`;
        existingCertificate = await this.constructor.findOne({
            RefereneNo: uniqueRefereneNo,
        });
      } while (existingCertificate); // Ensure uniqueness
  
      this.RefereneNo = `FS/OFF-LTR/${currentYear}/${randomFourDigit}` ;
    }
  
    // No need to delete records, just ensure certificateNumber is set
    if (!this.RefereneNo) {
      return next(new Error('OFF-LTR number generation failed'));
    }
  
    next();
  });

const OFFER = mongoose.model("offer-letter" , offerLetter);

export default OFFER
 