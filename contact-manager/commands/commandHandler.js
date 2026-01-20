// commands/commandHandler.js
const { ContactService, ServiceError } = require("../services/contactService");
const { ValidationError } = require("../utils/validation");

function printHelp() {
  console.log(`Usage: node app.js [command] [arguments]

Commands:
  add "name" "email" "phone"  - Add a new contact
  list                        - List all contacts
  search "query"              - Search contacts by name or email
  delete "email"              - Delete contact by email
  help                        - Show this help message

Examples:
  node app.js add "John Doe" "john@example.com" "555-123-4567"
  node app.js search "john"
  node app.js delete "john@example.com"
`);
}

function printInvalidCommand(cmd) {
  console.log(`✗ Error: Unknown command '${cmd}'`);
  console.log("Usage: node app.js [add|list|search|delete|help] [arguments]");
}

function handleCommand(argv) {
  const command = argv[2];
  const args = argv.slice(3);

  const service = new ContactService("contacts.json");

  if (!command || command === "help") {
    printHelp();
    return;
  }

  try {
    if (command === "add") {
      const [name, email, phone] = args;

      if (!name || !email || !phone) {
        console.log("✗ Error: Missing arguments for add command");
        console.log('Usage: node app.js add "name" "email" "phone"');
        return;
      }

      service.addContact(name, email, phone);
      return;
    }

    if (command === "list") {
      service.listContacts();
      return;
    }

    if (command === "search") {
      const [query] = args;
      if (!query) {
        console.log("✗ Error: Missing search query");
        console.log('Usage: node app.js search "query"');
        return;
      }
      service.searchContacts(query);
      return;
    }

    if (command === "delete") {
      const [email] = args;
      if (!email) {
        console.log("✗ Error: Missing email for delete command");
        console.log('Usage: node app.js delete "email"');
        return;
      }
      service.deleteContact(email);
      return;
    }

    printInvalidCommand(command);
  } catch (err) {
    if (err instanceof ValidationError || err instanceof ServiceError) {
      console.log(`✗ Error: ${err.message}`);
      return;
    }
    console.log("✗ Error: Unexpected error");
  }
}

module.exports = {
  handleCommand,
};