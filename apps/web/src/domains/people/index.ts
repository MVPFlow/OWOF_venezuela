export { personSchema, createPersonSchema, updatePersonSchema } from "./schemas/person.schema";
export type { PersonInput, CreatePersonInput, UpdatePersonInput } from "./schemas/person.schema";

export type { Person, CreatePersonPayload, UpdatePersonPayload, PersonFormData } from "./types";

export { createPerson } from "./actions/createPerson";
export { updatePerson } from "./actions/updatePerson";
export { archivePerson } from "./actions/archivePerson";

export { getPeople } from "./queries/getPeople";

export { PersonForm } from "./components/PersonForm";
export { PersonCard } from "./components/PersonCard";
export { PersonList } from "./components/PersonList";
