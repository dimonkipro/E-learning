import { NavDropdown } from "react-bootstrap";

// eslint-disable-next-line react/prop-types
const DarkModeToggle = ({ drop }) => {
  // Read the current theme from localStorage.
  const currentTheme = localStorage.getItem("theme") || "light";

  // Function to update theme and refresh page
  const handleThemeChange = (newTheme) => {
    localStorage.setItem("theme", newTheme);
    window.location.reload();
  };

  return (
    <NavDropdown
      title={
        currentTheme === "dark" ? (
          <i className="bi bi-moon-fill"></i>
        ) : (
          <i className="bi bi-sun-fill"></i>
        )
      }
      drop={drop}
      className="mx-2"
    >
      <NavDropdown.Item onClick={() => handleThemeChange("dark")}>
        <i className="bi bi-moon-fill"></i> Dark
      </NavDropdown.Item>

      <NavDropdown.Divider />

      <NavDropdown.Item onClick={() => handleThemeChange("light")}>
        <i className="bi bi-sun-fill"></i> Light
      </NavDropdown.Item>
    </NavDropdown>
  );
};

export default DarkModeToggle;
