import OFFER from "../models/offerLetterModel.js";

const OfferApi = async (req, res) => {
    try {
        const { name, email, salary, jobRole, startDate, endDate } = req.body;

        if (!name || !email || !salary || !jobRole || !startDate)
            return res.status(401).json({ success: false, message: "all fields required" });
        if (endDate < startDate)
            return res.status(400).json({ success: false, message: "enter the correct date" });

        const isEmailExisted = await OFFER.findOne({ email })
        if (isEmailExisted) {
            return res.status(400).json({ success: false, message: " Email already existed" });
        }

        const newOfferStudents = new OFFER({ name, email, salary, jobRole, startDate });
        await newOfferStudents.save();

        return res.status(200).json({ success: true, message: "Offer Letter Certificate generated", newOfferStudents })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "server error occured" })
    };
};

const offerLetterData = async (req, res) => {
    const { id } = req.params;

    try {
        const data = await OFFER.findById(id);
        if (!id) {
            return res.status(400).json({ success: false, message: "not getting data to Offer Letter form", error: error.message })
        }
        return res.status(200).json({ success: true, message: "Data got in Offer Letter form", data: data });
    } catch (error) {
        console.error("error fetching Offer Letter data", error);
        return res.status(400).json({ success: false, message: "server error while fetchimg Offer Letter data" })
    }

};

const offerLetterList = async (req, res) => {
    const { page } = req.params;
    const pageLimit = 10;
    typeof (page);

    const skipPage = (page - 1) * pageLimit;
    console.log(skipPage);

    try {
        const totalDocuments = await OFFER.countDocuments();
        const totalPages = Math.ceil(totalDocuments / pageLimit);

        const list = await OFFER.find().skip(skipPage).limit(pageLimit);
        if (!list) {
            return res.status(404).json({ success: false, message: "list not found" })
        }
        return res.status(200).json({ success: true, message: "List found", data: list, totalPages });
    } catch (error) {
        return res.status(500).json({ success: false, message: "error occured from backend" })
    };
};

// Delete offer-letter students ..
const deleteOfferLeter = async (req, res) => {
    try {
        const { id } = req.params; // Extract id from request parameters
        console.log({ id });

        if (!id) {
            return res.status(400).json({ success: false, message: "ID is required" });
        }

        const del = await OFFER.findByIdAndDelete(id);
        if (!del) {
            return res.status(404).json({ success: false, message: "Offer Letter not found" });
        }

        return res.status(200).json({ success: true, message: "Offer Letter deleted successfully", data: del });
    } catch (error) {
        console.error("Error deleting Offer Letter:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

//update offer-letter students
const updateOfferLetter = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body; // Get updated data from request body

        if (!id) {
            return res.status(400).json({ success: false, message: "ID is required" });
        }

        const updated = await OFFER.findByIdAndUpdate(id, updateData, { new: true });

        if (!updated) {
            return res.status(404).json({ success: false, message: "Offer Letter not found" });
        }

        return res.status(200).json({ success: true, message: "Offer Letter updated successfully", data: updated });
    } catch (error) {
        console.error("Error updating Offer Letter:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};


const searchData2 = async (req, res) => {
    const { Name } = req.params;
    try {
        const data = await OFFER.find({ name: { $regex: Name, $options: "i" } });
        if (!data) {
            return res.status(401).json({ success: false, message: "Searchdata2 not found" });
        }
        return res.status(200).json({ success: true, message: "searchdata2 Found", data })
    } catch (error) {
        console.error("error fetching searchdata2", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    };
};

const uploadOffer = async (req, res) => {
    try {
        const jsonData = req.body.jsonData; // Expecting an array of records
        console.log(jsonData);

        if (!jsonData || jsonData.length === 0) {
            return res.status(400).json({ success: false, message: "No data provided" });
        }

        let insertedRecords = [];
        let skippedRecords = [];

        const existingEmploye = await OFFER.find({}, "email");
        const existingEmail = new Set(existingEmploye.map(employe => employe.email));


        for (const record of jsonData) {
            const { name, email, salary, jobRole, startDate } = record;

            if (!name || !email || !salary || !jobRole || !startDate) {
                skippedRecords.push({ email, reason: "missing required fields" });
                return res.status(400).json({ success: false, message: "All fields are required" });
            }

            const parsedStartDate = new Date(startDate);

            if (isNaN(parsedStartDate)) {
                return res.status(400).json({ success: false, message: "Invalid date format" });
            }


            // Check if email already exists
            const emailExisted = await OFFER.findOne({ email });
            if (emailExisted) {
                continue;
            }

            if (existingEmail.has(email)) {
                skippedRecords.push({ email, reason: "Duplicate email" });
                continue;
            }

            // Create and save new Offer-Letter record
            const newOffer = new OFFER({
                name,
                email,
                salary,
                jobRole,
                startDate: parsedStartDate,
            });

            await newOffer.save();
            insertedRecords.push(newOffer);
            existingEmail.add(email);
        }

        return res.status(201).json({
            success: true,
            message:  `${insertedRecords.length} new records added`,
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
        const records = await OFFER.countDocuments();

        if (records === 0) {
            return res.status(404).json({ success: false, message: "No records" })
        }
        return res.status(200).json({ success: true, message: "Records found", totalRecords: records })
    } catch (error) {
        console.error("server error while getting records", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
}



export { OfferApi, offerLetterData, offerLetterList, deleteOfferLeter, updateOfferLetter, searchData2, uploadOffer, totalRecords }