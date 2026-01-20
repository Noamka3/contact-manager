// services/contactService.js
const { readJsonFile, writeJsonFile, FileError } = require("../utils/fileUtils");
const { validateContact, ValidationError } = require("../utils/validation");

class ServiceError extends Error {
  constructor(message) {
    super(message);
    this.name = "ServiceError";
  }
}

class ContactService {
  constructor(filename = "contacts.json") {
    this.filename = filename;
  }

  loadContactsWithLogs() {
    console.log(`Loading contacts from ${this.filename}...`);

    try {
      const data = readJsonFile(this.filename);

      // מצפה למערך; אם לא מערך נחשב פגום
      if (!Array.isArray(data)) {
        console.log("✗ Corrupted file - creating new contact list");
        return [];
      }

      console.log(`✓ Loaded ${data.length} contacts`);
      return data;
    } catch (err) {
      if (err instanceof FileError) {
        if (err.message === "File not found") {
          console.log("✗ File not found - creating new contact list");
          return [];
        }
        if (err.message === "Corrupted file") {
          console.log("✗ Corrupted file - creating new contact list");
          return [];
        }
        // כל שגיאת קובץ אחרת
        console.log("✗ Error: Failed to read contacts file");
        return [];
      }

      console.log("✗ Error: Unexpected error while loading contacts");
      return [];
    }
  }

  saveContactsWithLogs(contacts) {
    try {
      writeJsonFile(this.filename, contacts);
      console.log(`✓ Contacts saved to ${this.filename}`);
    } catch (err) {
      console.log("✗ Error: Failed to save contacts (write failure)");
    }
  }

  addContact(name, email, phone) {
    // ולידציה
    try {
      validateContact({ name, email, phone });
    } catch (err) {
      if (err instanceof ValidationError) throw err;
      throw new ServiceError("Invalid contact data");
    }

    const contacts = this.loadContactsWithLogs();

    const exists = contacts.some((c) => c.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      throw new ServiceError("Contact with this email already exists");
    }

    const newContact = { name, email, phone };
    contacts.push(newContact);

    console.log(`✓ Contact added: ${name}`);
    this.saveContactsWithLogs(contacts);
  }

  listContacts() {
    const contacts = this.loadContactsWithLogs();

    console.log("\n=== All Contacts ===");
    if (contacts.length === 0) {
      console.log("No contacts yet");
      return;
    }

    contacts.forEach((c, idx) => {
      console.log(`${idx + 1}. ${c.name} - ${c.email} - ${c.phone}`);
    });
  }

  searchContacts(query) {
    if (!query || typeof query !== "string") {
      throw new ValidationError('Search "query" is required');
    }

    const contacts = this.loadContactsWithLogs();
    const q = query.toLowerCase();

    const matches = contacts.filter((c) => {
      return (
        (c.name && c.name.toLowerCase().includes(q)) ||
        (c.email && c.email.toLowerCase().includes(q))
      );
    });

    console.log(`\n=== Search Results for "${query}" ===`);
    if (matches.length === 0) {
      console.log(`No contacts found matching "${query}"`);
      return;
    }

    matches.forEach((c, idx) => {
      console.log(`${idx + 1}. ${c.name} - ${c.email} - ${c.phone}`);
    });
  }

  deleteContact(email) {
    if (!email || typeof email !== "string") {
      throw new ValidationError("Email is required for delete");
    }

    const contacts = this.loadContactsWithLogs();

    const index = contacts.findIndex((c) => c.email.toLowerCase() === email.toLowerCase());
    if (index === -1) {
      throw new ServiceError(`No contact found with email: ${email}`);
    }

    const removed = contacts.splice(index, 1)[0];
    console.log(`✓ Contact deleted: ${removed.name}`);
    this.saveContactsWithLogs(contacts);
  }
}

module.exports = {
  ContactService,
  ServiceError,
};
