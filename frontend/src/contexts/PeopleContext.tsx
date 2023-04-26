import { People } from "@/types/People";
import { profile } from "console";
import React, { createContext, useState } from "react";

interface Props {
  children: React.ReactNode;
}

export const people_default: People = {
  user_id: "",
  name: "",
  last_message: "",
  profile_picture: "",
  room_id: null,
  setPeople: () => {},
  select: () => {},
  unSelect: () => {},
  peopleSelected: true,
};
export const PeopleContext = createContext<People>(people_default);

export const PeopleContextProvider: React.FC<Props> = ({ children }) => {
  const [people, setPeople] = useState<People>(people_default);
  const [peopleSelected, setPeopleSelected] = useState<boolean>(false);
  const select = () => {
    setPeopleSelected(true);
  };
  const unSelect = () => {
    setPeopleSelected(false);
  };
  return (
    <PeopleContext.Provider
      value={{
        user_id: people.user_id,
        name: people.name,
        last_message: people.last_message,
        profile_picture: people.profile_picture,
        room_id: people.room_id,
        setPeople: setPeople,
        select: select,
        unSelect: unSelect,
        peopleSelected: peopleSelected,
      }}
    >
      {children}
    </PeopleContext.Provider>
  );
};
