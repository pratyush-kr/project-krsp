import React, { useState, useContext, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import Link from "next/link";
import axios from "axios";
import { UserContext } from "@/contexts/UserContext";
import { UserInfoCookie } from "@/types/UserInfoCookie";
import styles from "@/styles/HeaderComponent.module.css";

const settings = ["Profile", "My Appointments", "Logout"];

export const Header = () => {
    const [pages, setPages] = useState(["Book Now", "Doctors", "About Us", "Contact Us"]);
    const [image, setImage] = useState("");
    const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
    const user = useContext(UserContext);
    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        document.documentElement.style.overflowX = "auto";
        document.body.style.overflowX = "auto";
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        document.documentElement.style.overflowX = "hidden";
        document.body.style.overflowX = "hidden";
        setAnchorElUser(null);
    };
    useEffect(() => {
        const cookie: string | null = localStorage.getItem("user_info");
        if (cookie === null) {
            user.setUsername("");
            setPages(["Book Now", "Doctors", "About Us", "Contact Us"]);
            return;
        }
        const jwt_cookie: UserInfoCookie = JSON.parse(cookie);
        user.setUsername(jwt_cookie.name);
        if (jwt_cookie.is_doctor) {
            setPages(["Doctors", "About Us", "Contact Us"]);
        } else {
            setPages(["Book Now", "Doctors", "About Us", "Contact Us"]);
        }
        const imgPath = jwt_cookie.profile_picture;
        setImage(axios.defaults.baseURL + imgPath);
    }, [user]);
    return (
        <div style={{ width: "100%", margin: "0", padding: "0" }}>
            <AppBar position="fixed" style={{ backgroundColor: "#FF007F", position: "relative" }}>
                <Container maxWidth="xl">
                    <Toolbar disableGutters>
                        <Typography
                            className="disable-select"
                            variant="h6"
                            noWrap
                            component="a"
                            href="/"
                            sx={{
                                mr: 2,
                                display: { xs: "none", md: "flex" },
                                fontWeight: 300,
                                color: "white",
                                fontFamily: "Satisfy",
                                textDecoration: "none",
                            }}
                        >
                            Krsp Solutions
                        </Typography>
                        <Box
                            sx={{
                                flexGrow: 1,
                                display: { xs: "flex", md: "none" },
                            }}
                        >
                            <IconButton
                                size="large"
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleOpenNavMenu}
                                color="inherit"
                            >
                                <MenuIcon />
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorElNav}
                                anchorOrigin={{
                                    vertical: "bottom",
                                    horizontal: "left",
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: "top",
                                    horizontal: "left",
                                }}
                                open={Boolean(anchorElNav)}
                                onClose={handleCloseNavMenu}
                                sx={{
                                    display: { xs: "block", md: "none" },
                                }}
                            >
                                {pages.map((page) => (
                                    <MenuItem key={page} onClick={handleCloseNavMenu}>
                                        <Typography textAlign="center">{page}</Typography>
                                    </MenuItem>
                                ))}
                            </Menu>
                        </Box>
                        <Typography
                            className="disable-select"
                            variant="h5"
                            noWrap
                            component="a"
                            href=""
                            sx={{
                                mr: 2,
                                display: { xs: "flex", md: "none" },
                                flexGrow: 1,
                                fontFamily: "Satisfy",
                                fontWeight: 700,
                                color: "inherit",
                                textDecoration: "none",
                            }}
                        >
                            Krsp Solutions
                        </Typography>
                        <Box
                            sx={{
                                flexGrow: 1,
                                display: { xs: "none", md: "flex" },
                            }}
                        >
                            {pages.map((page) => (
                                <Button
                                    key={page}
                                    onClick={handleCloseNavMenu}
                                    sx={{
                                        my: 2,
                                        color: "white",
                                        display: "block",
                                    }}
                                    href={`/${page.replace(" ", "")}`}
                                >
                                    {page}
                                </Button>
                            ))}
                        </Box>
                        <Box sx={{ flexGrow: 0 }}>
                            <Tooltip title="Your Profile">
                                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                    <Avatar
                                        style={{
                                            display: user.isAuthenticated === true ? "inherit" : "none",
                                        }}
                                        src={image}
                                        alt={`${user.name}`}
                                    />
                                </IconButton>
                            </Tooltip>
                            <Button
                                variant="contained"
                                style={{
                                    backgroundColor: "#00BFFF",
                                    display: user.isAuthenticated === false ? "inline-block" : "none",
                                }}
                                href="/Login"
                            >
                                Login
                            </Button>
                            <Menu
                                sx={{ mt: "45px" }}
                                id="menu-appbar"
                                anchorEl={anchorElUser}
                                anchorOrigin={{
                                    vertical: "top",
                                    horizontal: "right",
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: "top",
                                    horizontal: "right",
                                }}
                                open={Boolean(anchorElUser)}
                                onClose={handleCloseUserMenu}
                            >
                                {settings.map((setting) => (
                                    <Link key={setting} href={`/${setting.replace(" ", "")}`}>
                                        <MenuItem
                                            onClick={handleCloseUserMenu}
                                            // component="a"
                                        >
                                            <Typography>{setting}</Typography>
                                        </MenuItem>
                                    </Link>
                                ))}
                            </Menu>
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>
        </div>
    );
};
