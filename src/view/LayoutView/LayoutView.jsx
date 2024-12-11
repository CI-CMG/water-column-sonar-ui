import { Outlet } from "react-router-dom";
import { Link } from "react-router-dom";
import * as React from "react";
import PropTypes from 'prop-types';
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from "@mui/material/Toolbar";
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';

import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';

// import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
// import Container from "@mui/material/Container";
// import MenuItem from "@mui/material/MenuItem";
// import AdbIcon from "@mui/icons-material/Adb";
import Button from '@mui/material/Button';


// https://codesandbox.io/embed/z9zxcc?module=/src/Demo.js&fontsize=12

// https://codesandbox.io/embed/w7rtjg?module=/src/Demo.js&fontsize=12
const drawerWidth = 240;
const navItems = ["Home", "Map", "About"];

function DrawerAppBar(props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        Water Column Sonar
      </Typography>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item} disablePadding>
            <ListItemButton sx={{ textAlign: 'center' }}>
              <ListItemText primary={item} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar component="nav">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
          >
            Water Column
          </Typography>
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            {navItems.map((item) => (
              <Button key={item} sx={{ color: '#fff' }}>
                {item}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </AppBar>
      <nav>
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
      </nav>
      <Box component="main" sx={{ p: 3 }}>
        <Toolbar />
        <Typography>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Similique unde
          fugit veniam eius, perspiciatis sunt? Corporis qui ducimus quibusdam,
          aliquam dolore excepturi quae. Distinctio enim at eligendi perferendis in
          Voluptates perspiciatis, in pariatur impedit, nam facilis libero dolorem
          dolores sunt inventore perferendis, aut sapiente modi nesciunt.
        </Typography>
      </Box>
    </Box>
  );
}

DrawerAppBar.propTypes = {
  window: PropTypes.func,
};


export default function LayoutView() {

  return (
    <div className="LayoutView">
      
      <br />
      <br />
      <div id="wrap">
        <div id="top">
          <header role="banner" id="HeaderContent">
            <Link to="/">home</Link>
            <br />

            <Link to="/cruises">cruises</Link>
            <br />

            <Link to="/map">map</Link>
            <br />

            <Link to="/zarr">zarr</Link>
            <br />

            <Link to="/water-column">water column</Link>
            <br />
          </header>

          <main role="main" className="main">
            <div className="water-column-main" id="MainContent">
              <Outlet />
            </div>
          </main>
        </div>

        <div id="bottom">
          <footer role="contentinfo" id="FooterContent"></footer>
        </div>
      </div>
    </div>
  );
}
