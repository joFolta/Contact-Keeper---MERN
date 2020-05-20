import React, { useReducer } from "react";
import uuid from "uuid";
import ContactContext from "./contactContext";
import contactReducer from "./contactReducer";
import {
  ADD_CONTACT,
  DELETE_CONTACT,
  SET_CURRENT,
  CLEAR_CURRENT,
  UPDATE_CONTACT,
  FILTER_CONTACTS,
  CLEAR_FILTER,
} from "../types";

const ContactState = (props) => {
  const initialState = {
    contacts: [
      {
        id: 1,
        name: "Geoge Lucas",
        email: "geogelucas123@gmail.com",
        phone: "624-242-2021",
        type: "personal",
      },
      {
        id: 2,
        name: "Susan Strong",
        email: "sstrong@gmail.com",
        phone: "555-111-5555",
        type: "personal",
      },
      {
        id: 3,
        name: "Kevin Lopez",
        email: "kevinlopez@gmail.com",
        phone: "999-999-9999",
        type: "professional",
      },
    ],
  };

  const [state, dispatch] = useReducer(contactReducer, initialState);

  // Add Contact

  // Delete Contact

  // Set Current Contact

  // Clear Current Contact

  // Update Contact

  // Filter Contacts

  // Clear Filter

  return (
    <ContactContext.Provider
      value={{
        contacts: state.contacts,
      }}
    >
      {props.children}
    </ContactContext.Provider>
  );
};

export default ContactState;
