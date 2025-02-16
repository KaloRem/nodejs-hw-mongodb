import Contact from '../models/contactModel.js';
import cloudinary from '../services/cloudinaryService.js';
import createError from 'http-errors';

// Pobieranie kontaktów zalogowanego użytkownika
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

    // Filtr tylko dla kontaktów zalogowanego użytkownika
    const filter = { userId: req.user._id };

    if (type) {
      filter.contactType = type;
    }
    if (isFavourite !== undefined) {
      filter.isFavourite = isFavourite === 'true';
    }

    // Liczenie kontaktów użytkownika
    const totalItems = await Contact.countDocuments(filter);

    // Pobieranie kontaktów użytkownika
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

// Pobieranie jednego kontaktu użytkownika
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

// Tworzenie nowego kontaktu (dodanie userId)
export const createContact = async (req, res, next) => {
  try {
    console.log('📩 Otrzymane dane z Postmana:', req.body);
    console.log('🖼 Otrzymany plik:', req.file);
    const { name, phoneNumber, email, contactType } = req.body;
    let photoUrl = null;

    // Obsługa przesyłania zdjęcia do Cloudinary
    if (req.file) {
      console.log('📤 Przesyłanie pliku na Cloudinary...');
      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: 'contacts' }, (error, result) => {
            if (error) {
              console.error('❌ Błąd przesyłania na Cloudinary:', error);
              reject(createError(500, 'Error uploading image'));
            } else {
              console.log('✅ Przesłano zdjęcie:', result.secure_url);
              resolve(result.secure_url);
            }
          })
          .end(req.file.buffer);
      });

      photoUrl = uploadResult;
    }

    const newContact = await Contact.create({
      name,
      phoneNumber,
      email,
      contactType,
      userId: req.user._id,
      photo: photoUrl, // Przypisujemy link do zdjęcia
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

// Aktualizacja kontaktu (tylko jeśli kontakt należy do użytkownika)
export const updateContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const updatedContact = await Contact.findOneAndUpdate(
      { _id: contactId, userId: req.user._id },
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedContact) {
      return res
        .status(404)
        .json({ status: 404, message: 'Contact not found!' });
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

// Usuwanie kontaktu (tylko jeśli kontakt należy do użytkownika)
export const deleteContactById = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const deletedContact = await Contact.findOneAndDelete({
      _id: contactId,
      userId: req.user._id,
    });

    if (!deletedContact) {
      return res
        .status(404)
        .json({ status: 404, message: 'Contact not found!' });
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
