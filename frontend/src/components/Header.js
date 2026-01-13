// NavbarComponent.js
import React, { useCallback, useEffect, useState } from 'react';
import { Navbar, Nav, Button, Dropdown } from 'react-bootstrap';
import "./style.css";
import { useNavigate } from 'react-router-dom';
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
const Header = () => {
  
const navigate = useNavigate();

  const handleShowLogin = () =>{
    navigate("/login");
  }

  const [user, setUser] = useState();
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    
      if (localStorage.getItem("user")) {
        const user = JSON.parse(localStorage.getItem("user"));
        
        setUser(user);
        
      }

      const savedTheme = localStorage.getItem("theme") || "dark";
      setTheme(savedTheme);
  }, []);

  useEffect(() => {
    document.body.classList.remove("theme-dark", "theme-light");
    document.body.classList.add(theme === "light" ? "theme-light" : "theme-dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleShowLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  }

  const handleProfile = () => {
    navigate("/profile");
  }

  const toggleTheme = () => {
    setTheme((t) => (t === "light" ? "dark" : "light"));
  }

  const particlesInit = useCallback(async (engine) => {
    // console.log(engine);
    await loadFull(engine);
  }, []);

  const particlesLoaded = useCallback(async (container) => {
    // await console.log(container);
  }, []);
  
  return (
    <>
    <div style={{ position: 'relative', overflow: 'visible' }}>
      <Particles
        id="tsparticles"
        init={particlesInit}
        loaded={particlesLoaded}
        options={{
          background: {
            color: {
              value: theme === "light" ? "#f7f7fb" : "#000",
            },
          },
          fpsLimit: 60,
          particles: {
            number: {
              value: 200,
              density: {
                enable: true,
                value_area: 800,
              },
            },
            color: {
              value: theme === "light" ? "#111827" : "#ffcc00",
            },
            shape: {
              type: 'circle',
            },
            opacity: {
              value: 0.5,
              random: true,
            },
            size: {
              value: 3,
              random: { enable: true, minimumValue: 1 },
            },
            links: {
              enable: false,
            },
            move: {
              enable: true,
              speed: 2,
            },
            life: {
              duration: {
                sync: false,
                value: 3,
              },
              count: 0,
              delay: {
                random: {
                  enable: true,
                  minimumValue: 0.5,
                },
                value: 1,
              },
            },
          },
          detectRetina: true,
        }}
        style={{
          position: 'absolute',
          zIndex: -1,
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      />
    <Navbar className="navbarCSS" collapseOnSelect expand="lg" style={{position: 'relative', zIndex: "2 !important"}}>
      {/* <Navbar className="navbarCSS" collapseOnSelect expand="lg" bg="dark" variant="dark"> */}
        <Navbar.Brand href="/" className="text-white navTitle">Expense Management System</Navbar.Brand>
        <Navbar.Toggle
            aria-controls="basic-navbar-nav"
            style={{
              backgroundColor: "transparent",
              borderColor: "transparent",
            }}
          >
            <span
              className="navbar-toggler-icon"
              style={{
                background: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='30' height='30' viewBox='0 0 30 30'%3e%3cpath stroke='rgba(255, 255, 255)' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e")`,
              }}
            ></span>
          </Navbar.Toggle>
        <div>
        <Navbar.Collapse id="responsive-navbar-nav" style={{color: "white"}}>
          {user ? (
            <>
            <Nav>
                <Dropdown align="end">
                  <Dropdown.Toggle as="button" className="profileBtn" aria-label="Profile menu">
                    <AccountCircleIcon sx={{ fontSize: 30, color: "white" }} />
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="profileMenu">
                    <Dropdown.Item onClick={handleProfile} className="profileMenuItem">
                      <PersonIcon sx={{ fontSize: 18 }} />
                      <span>Profile</span>
                    </Dropdown.Item>
                    <Dropdown.Item onClick={toggleTheme} className="profileMenuItem">
                    {theme === "light" ? (
                      <DarkModeIcon sx={{ fontSize: 18 }} />
                    ) : (
                      <LightModeIcon sx={{ fontSize: 18 }} />
                    )}
                      <span>
                        Switch to {theme === "light" ? "Dark" : "White"}
                      </span>
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={handleShowLogout} className="profileMenuItem">
                    <LogoutIcon sx={{ fontSize: 18 }} />
                    <span>Logout</span>
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Nav>
            </>
          ) : (

            <>
              <Nav>
                <Button variant="primary" onClick={handleShowLogin} className="ml-2">Login</Button>
              </Nav>
            </>
          )}
          
        </Navbar.Collapse>
      </div>
      </Navbar>
      </div>
    </>
  );
};

export default Header;
