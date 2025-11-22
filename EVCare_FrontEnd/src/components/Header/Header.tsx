import logo from "../../assets/EVCare.png";
import { useEffect, useState } from "react"; // (NEW) Đã thêm `useState`
import { Link, useNavigate } from "react-router";
import { Navbar, Logo, Menu, Buttons } from "./Header.styled";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../states/store";
import { Dropdown } from "react-bootstrap";
import { AiOutlineMenu } from "react-icons/ai";
import { deleteToken, logout } from "../../services/authService";
import HTTP_STATUS from "../../constants/Code/HttpStatusCode";
import { logoutRedux } from "../../states/authSlice";
import { closeModel3d, openLogin } from "../../states/uiSlice";
import { handleError } from "../../utils/errorHandler";
import DropdownMenu from "./DropdownMenu";
import { stopAdminDashboardConnection } from "../../signalr/adminConnection";
import { stopStaffDashboardConnection } from "../../signalr/staffConnection";
import { stopChatConnection } from "../../signalr/chatConnection";
import { stopTechnicianConnection } from "../../signalr/technicianConnection";
import { ChristmasTheme } from "../XmasTheme/ChristmasTheme";
import ThemeToggleRound from "../XmasTheme/ButtonTheme";

export default function Header() {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const user = useSelector((state: RootState) => state.auth.user);
  const [enabled, setEnabled] = useState(false);

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
    dispatch(closeModel3d());
    await stopAdminDashboardConnection();
    await stopStaffDashboardConnection();
    await stopChatConnection();
    await stopTechnicianConnection();
    navigate("/");
  };

  const dropdownTitle = <AiOutlineMenu />;

  const onClickService = () => {
    navigate("/service");
  };

  const onClickAbout = () => {
    navigate("/about");
  };

  const onClickContact = () => {
    navigate("/contact");
  };

  const onClickReview = () => {
    navigate("/review");
  };

  const mobileMenu: any = isMobile ? (
    <Buttons>
      <Dropdown>
        <Dropdown.Toggle id="dropdown-item-button" variant="light">
          {dropdownTitle}
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item onClick={onClickService}>Services</Dropdown.Item>
          <Dropdown.Item onClick={onClickAbout}>About Us</Dropdown.Item>
          <Dropdown.Item onClick={onClickContact}>Contacts</Dropdown.Item>
          <Dropdown.Item onClick={onClickReview}>Reviews</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </Buttons>
  ) : null;

  return (
    <Navbar $isScrolled={isScrolled}>
      {user?.role === "Customer" && <ChristmasTheme enabled={enabled} />}
      <Logo>
        <Link to="/">
          <img src={logo} alt="EVCare logo" />
        </Link>
      </Logo>

      <Menu>
        <Link to="/">Home</Link>
        <Link to="/service">Services</Link>
        <Link to="/about">About</Link>
        <Link to="/policy">Policies</Link>
        <Link to="/contact">Contact</Link>
        <Link to="/review">Reviews</Link>
      </Menu>
      {isAuthenticated ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <DropdownMenu handleLogout={handleLogout} />
          <ThemeToggleRound enabled={enabled} setEnabled={setEnabled} />
        </div>
      ) : (
        <Buttons>
          <button className="btn btn-fill" onClick={() => dispatch(openLogin())}>
            Get Started
          </button>
        </Buttons>
      )}

      {mobileMenu}
    </Navbar>
  );
}
