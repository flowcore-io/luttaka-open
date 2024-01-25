export interface ContactProps {
  contactid: string | undefined;
  name: string | undefined;
  gender: string | undefined;
  email: string | undefined;
}

export interface ContactTableMeta {
  updateData: (payload: ContactProps) => void;
  deleteData: (contactid: string) => void;
}
