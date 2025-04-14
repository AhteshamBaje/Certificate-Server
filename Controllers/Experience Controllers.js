import Course from "../models/courseModel.js";
import EXPERIENCE from "../models/ExperienceModel.js";

const Experience = async (req, res) => {
    try {
        const { EName, email, jobRole, startDate, endDate } = req.body;

        if (!EName || !email || !jobRole || !startDate || !endDate)
            return res.status(401).json({ success: false, message: "all fields required" });
        if (endDate < startDate)
            return res.status(400).json({ success: false, message: "enter the correct date" });

        const emailExisted = await EXPERIENCE.findOne({ email })
        if (emailExisted) {
            return res.status(400).json({ success: false, message: "email already existed" });
        }


        const newExperienceStudents = new EXPERIENCE({ EName, email, jobRole, startDate, endDate });
        await newExperienceStudents.save();

        return res.status(200).json({ success: true, message: "Course Certificate generated", ReferenceCertificate: newExperienceStudents })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "server error occured" })
    };
};

const experienceData = async (req, res) => {
    const { id } = req.params;

    try {
        const data = await EXPERIENCE.findById(id);
        if (!id) {
            return res.status(400).json({ success: false, message: "not getting data to Course form", error: error.message })
        }
        return res.status(200).json({ success: true, message: "Data got in Course form", data: data });
    } catch (error) {
        console.error("error fetching Course data", error);
        return res.status(400).json({ success: false, message: "server error while fetchimg Course data" })
    }

};

const ExperienceList = async (req, res) => {
    const { page } = req.params;
    const pageLimit = 10;

    const skipPage = (page - 1) * pageLimit;
    // console.log(skipPage);


    try {
        const totalDocuments = await EXPERIENCE.countDocuments();
        const totalPages = Math.ceil(totalDocuments / pageLimit);

        const list = await EXPERIENCE.find().skip(skipPage).limit(pageLimit);
        if (!list) {
            return res.status(402).json({ success: false, message: "list not found" })
        }
        return res.status(200).json({ success: true, message: "List found", data: list, totalPages });
    } catch (error) {
        console.error(error);
        return res.status(401).json({ success: false, message: "error occured from backend" })
    };
};

// Delete internship students ..
const deleteExperience = async (req, res) => {
    try {
        const { id } = req.params; // Extract id from request parameters

        const del = await Course.findByIdAndDelete(id);
        if (!del) {
            return res.status(404).json({ success: false, message: "Course not found" });
        }

        return res.status(200).json({ success: true, message: "Course deleted successfully", data: del });
    } catch (error) {
        console.error("Error deleting Course:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const searchExpData = async (req, res) => {
    const { name } = req.params;

    console.log(name);
    
    try {
        const data = await Course.find({ studentName: { $regex: name, $options: "i" } });
        if (!data) {
            return res.status(400).json({ success: false, message: "searchData not found" });
        }
        return res.status(200).json({ success: true, message: "searchData found", data })
    } catch (error) {
        console.error("error fetching searchData", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });

    }
};

const uploadExpFile = async (req, res) => {
    try {
        console.log("runn");
        
        const jsonData = req.body.jsonData; // Expecting an array of records
        console.log(jsonData);

        if (!jsonData || jsonData.length === 0) {
            return res.status(400).json({ success: false, message: "No data provided" });
        }

        let insertedRecords = [];
        let skippedRecords = [];

        // const existingInterns = await Course.find({}, "email");
        // const existingEmail = new Set(existingInterns.map(intern => intern.email));

        for (const record of jsonData) {
            const { studentName, email, title, startDate, endDate } = record;

            if (!studentName || !email || !title || !startDate || !endDate) {
                skippedRecords.push({ email, reason: "Missing required fields" });
                continue;
            }

            const parsedStartDate = new Date(startDate);
            const parsedEndDate = new Date(endDate);

            if (isNaN(parsedStartDate) || isNaN(parsedEndDate)) {
                skippedRecords.push({ email, reason: "Invalid date format" });
                continue;
            }

            if (parsedEndDate < parsedStartDate) {
                skippedRecords.push({ email, reason: "End date before start date" });
                continue;
            }

            const emailExist = await Course.findOne({ email });
            if (emailExist) {
                continue;
            }

            // if (existingEmail.has(email)) {
            //     skippedRecords.push({ email, reason: "Duplicate email" });
            //     continue;
            // }

            // Create and save new Course record
            const newCourse = new Course({
                studentName,
                email,
                title,
                startDate: parsedStartDate,
                endDate: parsedEndDate
            });

            await newCourse.save();
            insertedRecords.push(newCourse);
            // existingEmail.add(email); // Add to set to prevent rechecking
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

const totalExpRecords = async (req, res) => {
    try {
        const records = await Course.countDocuments();

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

const expUpdateForm = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body; // Get updated data from request body

        if (!id) {
            return res.status(400).json({ success: false, message: "ID is required" });
        }

        const updated = await Course.findByIdAndUpdate(id, updateData, { new: true });

        // let titleName = titleId[0].CharAt(0) + titleId[1].CharAt(0);

    
        if (!updated) {
            return res.status(404).json({ success: false, message: "Course not found" });
        }

        return res.status(200).json({ success: true, message: "Course updated successfully", data: updated });
    } catch (error) {
        console.error("Error updating Course record:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export { Experience, experienceData, ExperienceList, deleteExperience, searchExpData, uploadExpFile, totalExpRecords , expUpdateForm}