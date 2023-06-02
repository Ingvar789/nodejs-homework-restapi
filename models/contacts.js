const fs = require('fs/promises')
const path = require("path");
const {nanoid} = require("nanoid");
const contactsPath = path.join(__dirname, "./contacts.json");


const listContacts = async () => {
const contacts = await fs.readFile(contactsPath);
return JSON.parse(contacts);
}

const getContactById = async (contactId) => {
  const contacts = await listContacts();
  return contacts.find(item => item.id === contactId) || null;
}

const addContact = async (data) => {
  const allContacts = await listContacts();
  const newContact = {
    id: nanoid(),
    ...data,
  };
  allContacts.push(newContact);
  await fs.writeFile(contactsPath, JSON.stringify(allContacts, null, 2));
  return newContact;}

const removeContact = async (contactId) => {
  const contacts = await listContacts();
  const contactToRemove = contacts.findIndex(item => item.id === contactId);
  if (contactToRemove === -1){
    return null;
  }
  contacts.splice(contactToRemove,1);
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return `Contact with id ${contactId} was deleted.`;
}
const updateContact = async (id, body) => {
  const contacts = await listContacts();
  const contactToUpdate = contacts.findIndex(item => item.id === id);
  console.log(contactToUpdate);
  if(contactToUpdate === -1){
    return null;
  }
  contacts[contactToUpdate] = {id, ...body};
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return contacts[contactToUpdate];
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}
