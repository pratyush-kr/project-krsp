import React, { useContext, useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { makeStyles } from "@mui/styles";
import { InputAdornment, TextField, Autocomplete, Avatar } from "@mui/material";
import { People } from "@/types/People";
import axios from "axios";
import { Config } from "@/types/Config";
import { User } from "@/models/User";
import { UserContext } from "@/contexts/UserContext";
import { JwtCookie } from "@/types/JwtCookie";
import ChatOption from "./ChatOption";

var index = -1;

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

interface Props {
  options: People[];
  setOptions: (value: People[]) => void;
}

export function SearchContainer(props: Props) {
  const [search, setSearch] = useState<string>();
  const userContext = useContext(UserContext);
  const classes = useStyles();
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
      <Autocomplete
        className={classes.input}
        options={props.options}
        getOptionLabel={(option) => option.name}
        renderOption={(props, option) => {
          index += 1;
          return <ChatOption props={props} option={option} index={index === 0 ? "zero" : "other"} />;
        }}
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
    </div>
  );
}
