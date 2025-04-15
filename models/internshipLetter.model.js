import mongoose, { Schema } from 'mongoose';

const InternshipSchema = new Schema(
  {
    studentName: {
      type: String,
      required: true,
    },
    usn: {
      type: String,
      required: true,
      unique:true,
    },
    course: {
      type: String,
      required: true,
    },
    topic : {
      type : String,
      required : true
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
InternshipSchema.pre('save', async function (next) {
  if (this.isNew) {
    const currentYear = new Date().getFullYear();
    let randomFourDigit;
    let uniqueCertificateNumber;
    let existingCertificate;

    do {
      randomFourDigit = Math.floor(1000 + Math.random() * 9000);
      uniqueCertificateNumber = `FS/INT/${currentYear}/${randomFourDigit}`;
      existingCertificate = await this.constructor.findOne({
        certificateNumber: uniqueCertificateNumber,
      });
    } while (existingCertificate); // Ensure uniqueness

    this.certificateNumber = `FS/INT/${currentYear}/${randomFourDigit}` ;
  }

  // No need to delete records, just ensure certificateNumber is set
  if (!this.certificateNumber) {
    return next(new Error('Certificate number generation failed'));
  }

  next();
});

// ✅ Fixed model name to match schema
const Internship = mongoose.model('Internship', InternshipSchema);

export default Internship;
