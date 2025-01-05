import Contact from '../models/contactModel.js';

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

    // Об'єкт фільтрації
    const filter = {};
    if (type) {
      filter.contactType = type; // Додаємо фільтрацію за типом контакту
    }
    if (isFavourite !== undefined) {
      filter.isFavourite = isFavourite === 'true'; // Додаємо фільтрацію за обраними
    }

    // Підрахунок загальної кількості відфільтрованих контактів
    const totalItems = await Contact.countDocuments(filter);

    // Пошук контактів з фільтрацією, сортуванням та пагінацією
    const contacts = await Contact.find(filter)
      .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 }) // Сортування
      .limit(Number(perPage)) // Кількість контактів на сторінці
      .skip(skip); // Пропуск попередніх сторінок

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
    const contact = await Contact.findById(contactId);

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
    const newContact = await Contact.create(req.body);
    res.status(201).json({
      status: 201,
      message: 'Contact created successfully!',
      data: newContact,
    });
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const updatedContact = await Contact.findByIdAndUpdate(
      contactId,
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

export const deleteContactById = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const deletedContact = await Contact.findByIdAndDelete(contactId);

    if (!deletedContact) {
      return res
        .status(404)
        .json({ status: 404, message: 'Contact not found!' });
    }

    res.status(200).json({
      status: 200,
      message: 'Contact deleted successfully!',
    });
  } catch (error) {
    next(error);
  }
};
