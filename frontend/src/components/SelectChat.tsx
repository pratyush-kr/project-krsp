import React, { useContext, useEffect, useState } from "react";
import { SearchContainer } from "@/components/SearchContainer";
import { Rooms } from "@/models/ChatRoom";
import { Room as RoomType } from "@/types/ChatRoom";
import { UserContext } from "@/contexts/UserContext";
import { Avatar } from "@mui/material";
import styles from "@/styles/SelectChat.module.css";
import { People } from "@/types/People";
import axios from "axios";
import { previewData } from "next/dist/client/components/headers";

interface Props {
    selectRoom: (room_id: number) => void;
    setPeopleSelected: (value: boolean) => void;
    setName: (value: string) => void;
    openChatWith: People;
    setOpenChatWith: React.Dispatch<React.SetStateAction<People>>;
}

export const SelectChat = (props: Props) => {
    const userContext = useContext(UserContext);
    const [rooms, setRooms] = useState<RoomType[]>();

    const [options, setOptions] = useState<People[]>([]);
    useEffect(() => {
        const loader = async () => {
            const rooms = await Rooms.loadRooms(userContext);
            setRooms(rooms);
        };
        loader();
    }, []);

    useEffect(() => {
        const startChatting = async () => {
            if (props.openChatWith?.room_id === null) {
                const room_id: string = await Rooms.createRoom(props.openChatWith);
                props.setOpenChatWith((prevState) => ({ ...prevState, room_id: room_id }));
                props.setPeopleSelected(false);
            }
        };
        startChatting();
    }, [props.openChatWith]);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        const room_id = event.currentTarget.getAttribute("data-room-id");
        if (room_id !== null) {
            const roomId: number = parseInt(room_id);
            props.selectRoom(roomId);
            props.setPeopleSelected(false);
            props.setOpenChatWith((prevState) => ({ ...prevState, room_id: room_id }));
            const selectedRoom: RoomType[] | undefined = rooms?.filter((room) => room.room_id === roomId);
            console.log(selectedRoom);
            if (selectedRoom !== undefined) props.setName(selectedRoom[0].name);
            else props.setName("");
        }
    };
    return (
        <div>
            <SearchContainer
                setOpenChatWith={props.setOpenChatWith}
                setOptions={setOptions}
                options={options}
            />
            <div>
                {rooms?.map((room) => {
                    return (
                        <div
                            className={styles.room}
                            key={room.room_id}
                            data-room-id={room.room_id}
                            onClick={handleClick}
                        >
                            <Avatar src={axios.defaults.baseURL + room.image} alt={room.name} />
                            <div className={styles.text}>
                                <span className={styles.name}>{room.name}</span>
                                <span className={styles.chat}>{room.last_message?.slice(0, 40) + "..."}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
