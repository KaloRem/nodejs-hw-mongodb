import Contact from '../models/contactModel.js';
import cloudinary from '../services/cloudinaryService.js';
import createError from 'http-errors';

// All contacts
export const getContacts = async (req, res, next) => {
  try {
    const {
      page = 1,
      perPage = 10,
      sortBy = 'name',
      sortOrder = 'asc',
      type,
      isFavourite,
    } = req.query;

    const skip = (page - 1) * perPage;

    const filter = { userId: req.user._id };

    if (type) {
      filter.contactType = type;
    }
    if (isFavourite !== undefined) {
      filter.isFavourite = isFavourite === 'true';
    }

    const totalItems = await Contact.countDocuments(filter);

    const contacts = await Contact.find(filter)
      .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
      .limit(Number(perPage))
      .skip(skip);

    const totalPages = Math.ceil(totalItems / perPage);

    res.status(200).json({
      status: 200,
      message: 'Contacts fetched successfully!',
      data: {
        data: contacts,
        page: Number(page),
        perPage: Number(perPage),
        totalItems,
        totalPages,
        hasPreviousPage: page > 1,
        hasNextPage: page < totalPages,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Contacts by ID
export const getContactById = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contact = await Contact.findOne({
      _id: contactId,
      userId: req.user._id,
    });

    if (!contact) {
      return res
        .status(404)
        .json({ status: 404, message: 'Contact not found!' });
    }

    res.status(200).json({
      status: 200,
      message: 'Contact fetched successfully!',
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

// Creating new contact
export const createContact = async (req, res, next) => {
  try {
    console.log('📩 Received data from Postman:', req.body);
    console.log('🖼 Received file:', req.file);

    if (!req.body.name) {
      console.error('❌ `name` is empty! Problem with `multer`?');
      return res.status(400).json({ message: '"name" is required' });
    }

    const { name, phoneNumber, email, contactType } = req.body;
    let photoUrl = null;

    if (req.file) {
      try {
        console.log('📤 Uploading a file to Cloudinary...');
        photoUrl = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: 'contacts' },
            (error, result) => {
              if (error) {
                console.error('❌ Upload error on Cloudinary:', error);
                reject(createError(500, 'Photo upload error'));
              } else {
                console.log('✅ Photo uploaded:', result.secure_url);
                resolve(result.secure_url);
              }
            },
          );
          stream.end(req.file.buffer);
        });
      } catch (error) {
        console.error('❌ Cloudinary error:', error);
        return next(createError(500, 'Failed to upload photo'));
      }
    }

    const newContact = await Contact.create({
      name,
      phoneNumber,
      email,
      contactType,
      userId: req.user._id,
      photo: photoUrl,
    });

    res.status(201).json({
      status: 201,
      message: 'Contact created successfully!',
      data: newContact,
    });
  } catch (error) {
    console.error('❌ Error creating contact:', error);
    next(error);
  }
};

// Updating contact
export const updateContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const { name, phoneNumber, email, contactType } = req.body;

    let updateData = { name, phoneNumber, email, contactType };

    if (req.file) {
      try {
        console.log('📤 Uploading a new photo to Cloudinary...');
        const photoUrl = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: 'contacts' },
            (error, result) => {
              if (error) {
                console.error('❌ Upload error on Cloudinary:', error);
                reject(createError(500, 'Photo upload error'));
              } else {
                console.log(
                  '✅ A new photo has been uploaded:',
                  result.secure_url,
                );
                resolve(result.secure_url);
              }
            },
          );
          stream.end(req.file.buffer);
        });

        updateData.photo = photoUrl;
      } catch (error) {
        console.error('❌ Cloudinary error:', error);
        return next(createError(500, 'Failed to upload photo'));
      }
    }

    const updatedContact = await Contact.findOneAndUpdate(
      { _id: contactId, userId: req.user._id },
      updateData,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedContact) {
      return next(createError(404, 'Contact not found!'));
    }

    res.status(200).json({
      status: 200,
      message: 'Contact updated successfully!',
      data: updatedContact,
    });
  } catch (error) {
    next(error);
  }
};

// Deleting contact
export const deleteContactById = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const deletedContact = await Contact.findOneAndDelete({
      _id: contactId,
      userId: req.user._id,
    });

    if (!deletedContact) {
      return next(createError(404, 'Contact not found!'));
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
