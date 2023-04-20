export interface Chat {
  user_id: string;
  room_id: string;
  message: string;
  date: string;
  time: string;
}
export interface Room {
  room_id: number | null;
  name: string;
  description: string;
  last_message: string | null;
  image: string;
}

export interface Rooms {
  chatRooms: Room[];
}
