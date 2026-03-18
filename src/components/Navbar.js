import { Link } from "react-router-dom";

const Navbar = () => (
  <nav style={{ padding: 20 }}>
    <Link to="/">Home</Link>{" | "}
    <Link to="/login">Login</Link>{" | "}
    <Link to="/about">About</Link>{" | "}
    <Link to="/register">Register</Link>
  </nav>
);

export default Navbar;
