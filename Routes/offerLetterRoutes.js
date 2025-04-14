import express from 'express'
import { deleteOfferLeter, OfferApi, offerLetterData, offerLetterList, searchData2, totalRecords, updateOfferLetter, uploadOffer } from '../Controllers/offerLetterController.js';

const OfferRouter = express.Router();

OfferRouter.post('/offer', OfferApi);
OfferRouter.get('/data/:id', offerLetterData);
OfferRouter.delete('/deleteOfferLeter/:id', deleteOfferLeter);
OfferRouter.get('/OfferLetterList/:page', offerLetterList);
OfferRouter.put('/updateOffer/:id', updateOfferLetter);
OfferRouter.get('/searchData2/:Name', searchData2);
OfferRouter.post('/offer/upload', uploadOffer);
OfferRouter.get('/totalRecords2' , totalRecords);

export default OfferRouter