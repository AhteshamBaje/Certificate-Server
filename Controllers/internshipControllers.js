import InternshipLetter from "../models/internshipLetter.model.js";
import Internship from "../models/internshipLetter.model.js";

const internship = async (req, res) => {
    try {
        const { studentName, usn, course, topic, startDate, endDate } = req.body;

        if (!studentName || !usn || !course || !topic || !startDate || !endDate)
            return res.status(401).json({ success: false, message: "all fields required" });
        if (endDate < startDate)
            return res.status(400).json({ success: false, message: "enter the correct date" });

        const usnExisted = await InternshipLetter.findOne({ usn })
        if (usnExisted) {
            return res.status(400).json({ success: false, message: "usn already existed" });
        }


        const newInternshipStudents = new Internship({ studentName, usn, course, topic, startDate, endDate });
        await newInternshipStudents.save();

        return res.status(200).json({ success: true, message: "Internship Certificate generated", certificate: newInternshipStudents })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "server error occured" })
    };
};

const internshipData = async (req, res) => {
    const { id } = req.params;

    // if(!id){
    //     return res.status(400).json({success:false, message:"internship ID is required"})
    // }
    // if(!mongoose.Types.ObjectId.isValidate(id)){
    //     return res.status(401).json({success:false, message:"Invalid internship ID"})
    // };

    try {
        const data = await InternshipLetter.findById(id);
        if (!id) {
            return res.status(400).json({ success: false, message: "not getting data to Internship form", error: error.message })
        }
        return res.status(200).json({ success: true, message: "Data got in Internship form", data: data });
    } catch (error) {
        console.error("error fetching internship data", error);
        return res.status(400).json({ success: false, message: "server error while fetchimg internship data" })
    }

};

const studentsList = async (req, res) => {
    const { page } = req.params;
    const pageLimit = 10;

    const skipPage = (page - 1) * pageLimit;
    // console.log(skipPage);


    try {
        const totalDocuments = await InternshipLetter.countDocuments();
        const totalPages = Math.ceil(totalDocuments / pageLimit);

        const list = await InternshipLetter.find().skip(skipPage).limit(pageLimit);
        if (!list) {
            return res.status(402).json({ success: false, message: "list not found" })
        }
        return res.status(200).json({ success: true, message: "List found", data: list, totalPages });
    } catch (error) {
        return res.status(401).json({ success: false, message: "error occured from backend" })
    };
};

// Delete internship students ..
const deleteInternship = async (req, res) => {
    try {
        const { id } = req.params; // Extract id from request parameters

        const del = await InternshipLetter.findByIdAndDelete(id);
        if (!del) {
            return res.status(404).json({ success: false, message: "Internship not found" });
        }

        return res.status(200).json({ success: true, message: "Internship deleted successfully", data: del });
    } catch (error) {
        console.error("Error deleting internship:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

//update internship students
const updateInternship = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body; // Get updated data from request body

        if (!id) {
            return res.status(400).json({ success: false, message: "ID is required" });
        }

        const updated = await InternshipLetter.findByIdAndUpdate(id, updateData, { new: true });

        if (!updated) {
            return res.status(404).json({ success: false, message: "Internship not found" });
        }

        return res.status(200).json({ success: true, message: "Internship updated successfully", data: updated });
    } catch (error) {
        console.error("Error updating internship:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const searchData = async (req, res) => {
    const { name } = req.params;
    try {
        const data = await InternshipLetter.find({ studentName: { $regex: name, $options: "i" } });
        if (!data) {
            return res.status(400).json({ success: false, message: "searchData not found" });
        }
        return res.status(200).json({ success: true, message: "searchData found", data })
    } catch (error) {
        console.error("error fetching searchData", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });

    }
};


const uploadFile = async (req, res) => {
    try {
        const jsonData = req.body.jsonData; // Expecting an array of records
        // console.log(jsonData);

        if (!jsonData || jsonData.length === 0) {
            return res.status(400).json({ success: false, message: "No data provided" });
        }

        let insertedRecords = [];
        let skippedRecords = [];

        const existingInterns = await Internship.find({}, "usn");
        const existingUSNs = new Set(existingInterns.map(intern => intern.usn));

        for (const record of jsonData) {
            const { studentName, usn, course, topic, startDate, endDate } = record;

            if (!studentName || !usn || !course || !topic || !startDate || !endDate) {
                skippedRecords.push({ usn, reason: "Missing required fields" });
                continue;
            }

            const parsedStartDate = new Date(startDate);
            const parsedEndDate = new Date(endDate);

            if (isNaN(parsedStartDate) || isNaN(parsedEndDate)) {
                skippedRecords.push({ usn, reason: "Invalid date format" });
                continue;
            }

            if (parsedEndDate < parsedStartDate) {
                skippedRecords.push({ usn, reason: "End date before start date" });
                continue;
            }

            const usnExist = await Internship.findOne({ usn });
            if (usnExist) {
                continue;
            }

            if (existingUSNs.has(usn)) {
                skippedRecords.push({ usn, reason: "Duplicate USN" });
                continue;
            }

            // Create and save new internship record
            const newInternship = new Internship({
                studentName,
                usn,
                course,
                topic,
                startDate: parsedStartDate,
                endDate: parsedEndDate
            });

            await newInternship.save();
            insertedRecords.push(newInternship);
            existingUSNs.add(usn); // Add to set to prevent rechecking
        }

        return res.status(201).json({
            success: true,
            message: `${insertedRecords.length} new records added`,
            insertedRecords,
            skippedRecords
        });

    } catch (error) {
        console.error("Server error:", error);
        return res.status(500).json({ success: false, message: "Server error occurred" });
    }
};


const totalRecords = async (req, res) => {
    try {
        const records = await Internship.countDocuments();

        if (records === 0) {
            return res.status(404).json({ success: false, message: "No records" })
        } else {
            return res.status(200).json({ success: true, message: "Records found", totalRecords: records })
        }
    } catch (error) {
        console.error("server error while getting records", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

const issuedDate = async (req, res) => {
    try {
      const internship = await Internship.findById(req.params.id);
      if (!internship) return res.status(404).json({ message: "Internship not found" });
  
      internship.issuedDate = new Date();
      await internship.save();
  
      res.json({ message: "Issued date updated successfully", issuedDate: internship.issuedDate });
    } catch (error) {
      res.status(500).json({ message: "Error updating issued date", error });
    }
  };
  
export { internship, internshipData, studentsList, deleteInternship, updateInternship, searchData, uploadFile, totalRecords , issuedDate };