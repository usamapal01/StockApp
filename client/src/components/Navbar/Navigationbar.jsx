import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { Link } from "react-router-dom";
import "./Navigationbar.css";
import logo from "../../assets/logo.png";

function Navigationbar() {
  return (
    <Navbar expand="lg" className="background">
      <Container fluid>
        <Navbar.Brand href="#">
          <img
            src={logo}
            alt="Logo"
            className="rounded-circle"
            style={{ width: "45px", height: "45px" }} // Adjust size as needed
          />
        </Navbar.Brand>
        <Nav className="ms-auto">
          <Link to="/">
            <button className="nav-button">Home</button>
          </Link>
        </Nav>
      </Container>
    </Navbar>
  );
}

export default Navigationbar;
