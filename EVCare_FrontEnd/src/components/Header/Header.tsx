import logo from "../../assets/EVCare.png";
import { useEffect, useState } from "react"; // (NEW) Đã thêm `useState`
import { Link, useNavigate } from "react-router";
import Authentication from "../../pages/Shared/Auth/Authentication";
import { Navbar, Logo, Menu, Buttons } from "./Header.styled";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../states/store";
import { Dropdown, DropdownButton } from "react-bootstrap";
import { AiOutlineMenu } from "react-icons/ai";
import { deleteToken, logout } from "../../services/authService";
import HTTP_STATUS from "../../constants/Code/HttpStatusCode";
import { logoutRedux } from "../../states/authSlice";
import { openLogin } from "../../states/uiSlice";
import { handleError } from "../../utils/errorHandler";
import DropdownMenu from "./DropdownMenu";
import { stopAdminDashboardConnection } from "../../signalr/adminConnection";

export default function Header() {
  // const [showAuth, setShowAuth] = useState(false);
  const [tongle, setTongle] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  const [isMobile, setIsMobile] = useState(window.innerWidth < 750);
  const dispatch = useDispatch<AppDispatch>();

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 750);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      setTongle(true);
    };
  }, []);

  const handleLogout = async () => {
    const response = await logout();
    if (!response) {
      handleError("Error when logout");
      return;
    }
    if (response.statusCode != HTTP_STATUS.OK) {
      handleError("Error when logout");
    }
    deleteToken();
    dispatch(logoutRedux());
    stopAdminDashboardConnection();
    navigate("/");
  };

  return (
    <Navbar $isScrolled={isScrolled}>
      <Logo>
        <Link to="/">
          <img src={logo} alt="EVCare logo" />
        </Link>
      </Logo>

      <Menu>
        <Link to="/">Home</Link>
        <Link to="/service">Service</Link>
        <Link to="/about">About</Link>
        <Link to="/policy">Policies</Link>
        <Link to="/contact">Contact</Link>
        <Link to="/review">Reviews</Link>
      </Menu>
      {isAuthenticated ? (
        <div
          style={{
            display: "flex",
          }}
        >
          <DropdownMenu handleLogout={handleLogout} />
        </div>
      ) : (
        <Buttons>
          <button
            className="btn btn-fill"
            onClick={() => dispatch(openLogin())}
          >
            Get Started
          </button>
        </Buttons>
      )}

      {isMobile ? (
        <Buttons>
          {tongle && (
            <DropdownButton id="dropdown-item-button" title={<AiOutlineMenu />}>
              <Dropdown.Item as="button" onClick={() => navigate("/service")}>
                Service
              </Dropdown.Item>
              <Dropdown.Item as="button" onClick={() => navigate("/about")}>
                About Us
              </Dropdown.Item>
              <Dropdown.Item as="button" onClick={() => navigate("/contact")}>
                Contact
              </Dropdown.Item>
              <Dropdown.Item as="button" onClick={() => navigate("/review")}>
                Reviews
              </Dropdown.Item>
            </DropdownButton>
          )}
        </Buttons>
      ) : undefined}

      <Authentication />
    </Navbar>
  );
}
