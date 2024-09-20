import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  return (
    <div>
      <Container className="home-container">
        <h2 className="heading">Choose your store from options below</h2>
        <Row className="row">
          <Col>
            <Link to="/LosAngeles">
              <button className="store-button">Los Angeles</button>
            </Link>
          </Col>
          <Col>
            <Link to="/Houston">
              <button className="store-button">Houston</button>
            </Link>
          </Col>
          <Col>
            <Link to="/Dallas">
              <button className="store-button">Dallas</button>
            </Link>
          </Col>
          <Col>
            <Link to="/Atlanta">
              <button className="store-button">Atlanta</button>
            </Link>
          </Col>
        </Row>
        <Row>
          <Col>
            <Link to="/NewJersey">
              <button className="store-button">New Jersey</button>
            </Link>
          </Col>
          <Col>
            <Link to="/NewYork">
              <button className="store-button">New York</button>
            </Link>
          </Col>
          <Col>
            <Link to="/Lombard">
              <button className="store-button">Lombard</button>
            </Link>
          </Col>
          <Col>
            <Link to="/Chicago">
              <button className="store-button">Chicago</button>
            </Link>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Home;
