import React, { useContext, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { Container, Nav, NavItem } from "reactstrap";
import AppContext from "./context";

const Layout = (props) => {
  const { user, setUser, isAuthenticated, setIsAuthenticated } = useContext(AppContext);
  const { data: session, status } = useSession();

  console.log("Layout component rendered"); // Check if Layout is rendered

  useEffect(() => {
    console.log("Session status:", status); // Check the session status
    console.log("Session data:", session);  // Check the session data

    if (status === "authenticated") {
      setUser({ email: session.user.email, username: session.user.name });
      setIsAuthenticated(true);
    } else {
      setUser(null);
      setIsAuthenticated(false);
    }
  }, [status, session, setUser, setIsAuthenticated]);

  const handleLogout = async (e) => {
    e.preventDefault();
    await signOut({ redirect: false }); // NextAuth sign-out process
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <div>
      <header>
        <Nav className="navbar navbar-dark bg-dark">
          <NavItem>
            <Link href="/" passHref>
              <span className="navbar-brand">Home</span>
            </Link>
          </NavItem>

          {isAuthenticated && user ? (
            <React.Fragment>
              <NavItem className="ml-auto">
                <h5>{user.username}</h5> {/* Display user's name from context */}
              </NavItem>
              <NavItem>
                <a href="/" className="nav-link" onClick={handleLogout}>Logout</a>
              </NavItem>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <NavItem className="ml-auto">
                <Link href="/register" passHref>
                  <span className="nav-link">Sign up</span>
                </Link>
              </NavItem>
              <NavItem>
                <Link href="/login" passHref>
                  <span className="nav-link">Sign in</span>
                </Link>
              </NavItem>
            </React.Fragment>
          )}
        </Nav>
      </header>
      <Container>{props.children}</Container>
    </div>
  );
};

export default Layout;
