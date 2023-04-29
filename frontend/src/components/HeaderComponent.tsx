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
import styles from "@/styles/HeaderComponent.module.css";
import { User } from "@/models/User";

const settings = ["Profile", "My Appointments", "Logout"];

export const Header = () => {
  const userContext = useContext(UserContext);
  const [pages, setPages] = useState(["Book Now", "Doctors", "About Us", "Contact Us"]);
  const [image, setImage] = useState("/noImage");
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
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
    if (userContext.isAuthenticated) {
      const user: User = new User();
      const image: string = user.getCookieJson().profile_picture;
      setImage(axios.defaults.baseURL + image);
    }
  }, [userContext.isAuthenticated]);
  return (
    <div style={{ margin: "0", padding: "0" }}>
      <AppBar position="fixed" style={{ backgroundColor: "#FF007F", position: "relative" }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Typography
              className={styles.disableSelect}
              variant="h6"
              noWrap
              sx={{
                mr: 2,
                display: { xs: "none", md: "flex" },
                fontWeight: 300,
                color: "white",
                fontFamily: "Satisfy",
                textDecoration: "none",
              }}
            >
              <Link href="/">Krsp Solutions</Link>
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
              className={styles.disableSelect}
              variant="h5"
              noWrap
              component="a"
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
                <Link
                  key={page}
                  onClick={handleCloseNavMenu}
                  href={`/${page.replace(" ", "")}`}
                  className={styles.link}
                >
                  {page}
                </Link>
              ))}
            </Box>
            <Box sx={{ flexGrow: 0 }}>
              {userContext.isAuthenticated && (
                <Tooltip title="Your Profile">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar src={image} alt={`${userContext.name}`} />
                  </IconButton>
                </Tooltip>
              )}
              {!userContext.isAuthenticated && (
                <Button
                  variant="contained"
                  style={{
                    backgroundColor: "#00BFFF",
                  }}
                  href="/Login"
                >
                  Login
                </Button>
              )}
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
