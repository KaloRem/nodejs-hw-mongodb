import Contact from '../models/contactModel.js';
import cloudinary from '../services/cloudinaryService.js';
import createError from 'http-errors';

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

export const createContact = async (req, res, next) => {
  try {
    console.log('📩 Otrzymane dane z Postmana:', req.body);
    console.log('🖼 Otrzymany plik:', req.file);

    if (!req.body.name) {
      console.error('❌ `name` jest pusty! Problem z `multer`?');
      return res.status(400).json({ message: '"name" is required' });
    }

    const { name, phoneNumber, email, contactType } = req.body;
    let photoUrl = null;

    if (req.file) {
      try {
        console.log('📤 Przesyłanie pliku na Cloudinary...');
        photoUrl = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: 'contacts' },
            (error, result) => {
              if (error) {
                console.error('❌ Błąd przesyłania na Cloudinary:', error);
                reject(createError(500, 'Błąd przesyłania zdjęcia'));
              } else {
                console.log('✅ Przesłano zdjęcie:', result.secure_url);
                resolve(result.secure_url);
              }
            },
          );
          stream.end(req.file.buffer);
        });
      } catch (error) {
        console.error('❌ Błąd Cloudinary:', error);
        return next(createError(500, 'Nie udało się przesłać zdjęcia'));
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
    console.error('❌ Błąd tworzenia kontaktu:', error);
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const { name, phoneNumber, email, contactType } = req.body;

    let updateData = { name, phoneNumber, email, contactType };

    if (req.file) {
      try {
        console.log('📤 Przesyłanie nowego zdjęcia na Cloudinary...');
        const photoUrl = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: 'contacts' },
            (error, result) => {
              if (error) {
                console.error('❌ Błąd przesyłania na Cloudinary:', error);
                reject(createError(500, 'Błąd przesyłania zdjęcia'));
              } else {
                console.log('✅ Przesłano nowe zdjęcie:', result.secure_url);
                resolve(result.secure_url);
              }
            },
          );
          stream.end(req.file.buffer);
        });

        updateData.photo = photoUrl;
      } catch (error) {
        console.error('❌ Błąd Cloudinary:', error);
        return next(createError(500, 'Nie udało się przesłać zdjęcia'));
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
      return next(createError(404, 'Kontakt nie został znaleziony!'));
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

export const deleteContactById = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const deletedContact = await Contact.findOneAndDelete({
      _id: contactId,
      userId: req.user._id,
    });

    if (!deletedContact) {
      return next(createError(404, 'Kontakt nie został znaleziony!'));
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
