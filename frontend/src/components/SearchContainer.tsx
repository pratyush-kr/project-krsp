import React, { FormEvent, SyntheticEvent, useContext, useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { makeStyles } from "@mui/styles";
import styles from "@/styles/SearchContainer.module.css";
import { InputAdornment, TextField, Autocomplete, Avatar } from "@mui/material";
import { People } from "@/types/People";
import axios from "axios";
import { Config } from "@/types/Config";
import { User } from "@/models/User";
import { UserContext } from "@/contexts/UserContext";
import { JwtCookie } from "@/types/JwtCookie";

interface Props {
    setOpenChatWith: (value: People) => void;
    options: People[];
    setOptions: (value: People[]) => void;
}

const useStyles = makeStyles((theme) => ({
    container: {
        display: "flex",
        justifyContent: "center",
        width: "100%",
    },
    search: {
        display: "flex",
        alignItems: "center",
        backgroundColor: "#fff",
        borderRadius: "50px",
        padding: "0.5rem 1rem",
        boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.15)",
    },
    input: {
        width: "25vw",
        fontFamily: "inherit",
    },
    searchIcon: {
        color: "rgba(0, 0, 0, 0.5)",
    },
}));

export function SearchContainer(props: Props) {
    const [search, setSearch] = useState<string>();
    const userContext = useContext(UserContext);
    const classes = useStyles();
    const handleChange = (event: SyntheticEvent<Element, Event>, value: People | null) => {
        if (value) props.setOpenChatWith(value);
    };
    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event?.preventDefault();
    };
    const startChat = (event: SyntheticEvent<Element, Event>, option: People) => {
        console.log(option);
        handleChange(event, option);
    };
    useEffect(() => {
        const getPeople = async () => {
            const user: User = new User();
            const validToken = user.verifyToken();
            if (!validToken) {
                localStorage.removeItem("user_info");
                userContext.logout();
                return;
            }
            const cookie: JwtCookie = user.getCookieJson();
            const config: Config = {
                headers: {
                    Authorization: `Bearer ${cookie.jwt}`,
                },
            };
            const response = await axios.get(
                axios.defaults.baseURL + `/krsp/chat/get_people/?slug=${search}`,
                config
            );
            props.setOptions(response.data);
        };
        getPeople();
    }, [search]);
    return (
        <div className={classes.container}>
            <form onSubmit={handleSubmit}>
                <Autocomplete
                    className={classes.input}
                    options={props.options}
                    getOptionLabel={(option) => option.name}
                    renderOption={(props, option) => (
                        <li {...props} className={styles.room} onClick={(event) => startChat(event, option)}>
                            <Avatar src={axios.defaults.baseURL + option.profile_picture} alt={option.name} />
                            <div className={styles.text}>
                                <span className={styles.name}>{option.name}</span>
                                <span className={styles.chat}>
                                    {option.last_message?.slice(0, 40) + "..."}
                                </span>
                            </div>
                        </li>
                    )}
                    onChange={handleChange}
                    renderInput={(params) => (
                        <TextField
                            className={classes.input}
                            label="Search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            {...params}
                            InputProps={{
                                ...params.InputProps,
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    )}
                />
            </form>
        </div>
    );
}

/* <Autocomplete
        sx={{ width: "15vw" }}
        options={options}
        // value={searchValue}
        renderInput={(params) => (
            <TextField
                {...params}
                label="Search"
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon />
                        </InputAdornment>
                    ),
                }}
                type="submit"
            />
        )}
    /> 
*/
