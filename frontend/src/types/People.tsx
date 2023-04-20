export interface People {
  user_id: string;
  name: string;
  last_message: string;
  profile_picture: string;
  room_id: string | null;
  setPeople: React.Dispatch<React.SetStateAction<People>>;
  peopleSelected: boolean;
  select: () => void;
  unSelect: () => void;
}
