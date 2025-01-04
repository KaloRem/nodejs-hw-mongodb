// src/controllers/contactController.js
import createError from 'http-errors';
import * as contactService from '../services/contacts.js';

export const createContact = async (req, res, next) => {
  try {
    const { name, phoneNumber, email, isFavourite, contactType } = req.body;
    if (!name || !phoneNumber || !contactType) {
      throw createError(
        400,
        "Fields 'name', 'phoneNumber', and 'contactType' are required",
      );
    }
    const newContact = await contactService.createContact({
      name,
      phoneNumber,
      email,
      isFavourite,
      contactType,
    });
    res.status(201).json({
      status: 201,
      message: 'Successfully created a contact!',
      data: newContact,
    });
  } catch (err) {
    next(err);
  }
};

export const getContacts = async (req, res, next) => {
  try {
    const contacts = await contactService.getAllContacts(); // Отримання всіх контактів
    res.status(200).json({
      status: 200,
      message: 'Successfully patched a contact!',
      data: contacts,
    });
  } catch (err) {
    next(err);
  }
};

export const getContactById = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contact = await contactService.getContactById(contactId);
    if (!contact) {
      throw createError(404, 'Contact not found');
    }
    res
      .status(200)
      .json({ status: 200, message: 'Contact found', data: contact });
  } catch (err) {
    next(err);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const updatedData = req.body;
    const updatedContact = await contactService.updateContact(
      contactId,
      updatedData,
    );
    if (!updatedContact) {
      throw createError(404, 'Contact not found');
    }
    res.status(200).json({
      status: 200,
      message: 'Successfully patched a contact!',
      data: updatedContact,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const deletedContact = await contactService.deleteContact(contactId);
    if (!deletedContact) {
      throw createError(404, 'Contact not found');
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
