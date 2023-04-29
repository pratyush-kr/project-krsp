import React, { useState } from "react";
import PersonIcon from "@mui/icons-material/Person";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { IconButton } from "@mui/material";
import { SvgIcon } from "@mui/material";
import Link from "next/link";

interface Props {
  settings: string[];
}

const ProfileIcon = ({ settings }: Props) => {
  const [anchorElUser, setAnchorElUser] = useState<HTMLElement | null>(null);
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElUser(event.currentTarget);
  };
  return (
    <Box sx={{ flexGrow: 0, display: "flex", justifyContent: "center" }}>
      <Tooltip title="Your Profile">
        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
          <SvgIcon fontSize="large">
            <PersonIcon color="secondary" />
          </SvgIcon>
        </IconButton>
      </Tooltip>
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
            <MenuItem onClick={handleCloseUserMenu}>
              <Typography>{setting}</Typography>
            </MenuItem>
          </Link>
        ))}
      </Menu>
    </Box>
  );
};

export default ProfileIcon;
