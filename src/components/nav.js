import { Nav } from "rsuite";
import HomeIcon from '@rsuite/icons/legacy/Home';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
// import MenuIcon from '@mui/icons-material/Menu';
import '../css/nav.css'
import { useEffect, useLayoutEffect, useState } from "react";
import React from "react";
import { Link } from "react-router-dom";


function HomeNav(){
  const menuClickedHandler = (e, input) => {
    if(e.target.innerHTML[0] !== "<" && e.target.innerHTML !== "") setChosenNav(e.target.innerHTML)
    else setChosenNav(input)
  }

  const [chosenNav, setChosenNav] = useState("Home")
  const [menu, setMenu] = useState(
    <div style={{"display": "inline-flex"}}>
      <HomeIcon style={{"position": "relative", "top": "calc(50% - 8px)"}}></HomeIcon>
      <Link to="/" className={`rs-nav-item homepage_nav ${(chosenNav === "Home") ? "menu_clicked" : ""}`} onClick={menuClickedHandler}>Home</Link>
    </div>
  )

  useEffect(() => {
    if(window.innerWidth <= 500){
      setMenu(    
        <div className="menu_icon_wrapper">
          <Link to="/" onClick={(e) => menuClickedHandler(e, "Home")}><HomeIcon className="menu_icon" onClick={(e) => menuClickedHandler(e, "Home")}></HomeIcon></Link>
        </div>
      )
    }
    else{
      setMenu(
        <div style={{"display": "inline-flex"}}>
          <HomeIcon style={{"position": "relative", "top": "calc(50% - 8px)"}}></HomeIcon>
          <Link to="/" className={`rs-nav-item homepage_nav ${(chosenNav === "Home") ? "menu_clicked" : ""}`} onClick={menuClickedHandler}>Home</Link>
        </div>
      )
    }
  }, [chosenNav])
  useLayoutEffect(() => {
    function handleResize(){
      if(window.innerWidth <= 500){
        setMenu(    
          <div className="menu_icon_wrapper">
            <Link to="/" onClick={(e) => menuClickedHandler(e, "Home")}><HomeIcon className="menu_icon" onClick={(e) => menuClickedHandler(e, "Home")}></HomeIcon></Link>
          </div>
        )
      }
      else{
        setMenu(
          <div style={{"display": "inline-flex"}}>
            <HomeIcon style={{"position": "relative", "top": "calc(50% - 8px)"}}></HomeIcon>
            <Link to="/" className={`rs-nav-item homepage_nav ${(chosenNav === "Home") ? "menu_clicked" : ""}`} onClick={menuClickedHandler}>Home</Link>
          </div>
        )
      }
    }
    window.addEventListener('resize', handleResize)
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, [chosenNav]);

  
  return(
    <NavCustom menu={menu} menuClickedHandler={menuClickedHandler} chosenNav={chosenNav}></NavCustom>
  )
}

const NavCustom = (props) => {
  return(
    <Nav className="home_nav">
      {props.menu}
      <div className="middle_nav">
          {/* <Link to="/admin" className={`rs-nav-item ${(props.chosenNav === "Admin") ? "menu_clicked" : ""}`} onClick={props.menuClickedHandler}>Admin</Link> */}
          <Link to="/playlist" className={`rs-nav-item ${(props.chosenNav === "Playlist") ? "menu_clicked" : ""}`} onClick={props.menuClickedHandler}>Playlist</Link>
          <Link to="/artist" className={`rs-nav-item ${(props.chosenNav === "Artists") ? "menu_clicked" : ""}`} onClick={props.menuClickedHandler}>Artists</Link>
          <Link to="/song" className={`rs-nav-item ${(props.chosenNav === "Songs") ? "menu_clicked" : ""}`} onClick={props.menuClickedHandler}>Songs</Link>
          <Link to="/top100" className={`rs-nav-item ${(props.chosenNav === "Top 100") ? "menu_clicked" : ""}`} onClick={props.menuClickedHandler}>Top 100</Link>
      </div>
      <div className="right_nav">
        <div className="search_icon_wrapper">
          <SearchIcon></SearchIcon>
        </div>
        <div className="user_wrapper">
          <AccountCircleIcon></AccountCircleIcon>
        </div>
      </div>
    </Nav>
  )
};

export default HomeNav;