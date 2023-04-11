import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import axios from "axios";
import { Button } from "@mui/material";
import { UserContext } from "@/contexts/UserContext";
import { useContext } from "react";

interface Props {
    isOpen: boolean;
}

const LoginDialog: React.FC<Props> = ({ isOpen }) => {
    const user = useContext(UserContext);
    const [msg, setMsg] = useState("");
    const [data, setData] = useState({
        email: "",
        password: "",
    });
    const handleDataChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const name = event.target.name;
        const value = event.target.value;
        setData({ ...data, [name]: value });
    };
    const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = {
            email: data.email,
            password: data.password,
        };
        axios.defaults.withCredentials = true;
        console.log(axios.defaults.baseURL);
        axios
            .post(axios.defaults.baseURL + "/krsp/user/login/", formData)
            .then((res) => {
                user.login();
                localStorage.setItem("user_info", JSON.stringify(res.data));
                user.setUsername(res.data["name"]);
            })
            .catch((err) => {
                console.log(err);
                const msg = err.response.data.msg;
                setMsg(msg);
            });
    };
    return (
        <Dialog open={isOpen}>
            <DialogTitle>Login</DialogTitle>
            <DialogContent>
                <DialogContentText>Login to continue</DialogContentText>
            </DialogContent>
            <DialogContent>
                <form onSubmit={handleLogin} style={{ width: "30vw" }}>
                    <TextField
                        type="email"
                        label="Email"
                        value={data.email}
                        onChange={handleDataChange}
                        name="email"
                        sx={{ margin: "1vh", width: "95%" }}
                    />
                    <TextField
                        type="password"
                        label="Password"
                        value={data.password}
                        name="password"
                        onChange={handleDataChange}
                        sx={{ margin: "1vh", width: "95%" }}
                    />
                    {msg !== "" && <p style={{ color: "red" }}>{msg}</p>}
                    <Button
                        variant="contained"
                        sx={{ margin: "1vh", width: "95%" }}
                        type="submit"
                        disabled={data.email === "" || data.password === ""}
                    >
                        Login
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default LoginDialog;
