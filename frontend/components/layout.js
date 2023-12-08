import React, { useContext, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { Container, Nav, NavItem } from "reactstrap";
import AppContext from "./context";
import styles from '../styles/Home.module.css'; // Ensure this path is correct to your CSS module
import TotalPrice from "./totalprice";
import Image from 'next/image';

const Layout = (props) => {
  const { user, setUser, isAuthenticated, setIsAuthenticated } = useContext(AppContext);
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      setUser({
        email: session.user.email,
        username: session.user.name,
        image: session.user.image,
      });
      setIsAuthenticated(true);
    } else {
      setUser(null);
      setIsAuthenticated(false);
    }
  }, [status, session, setUser, setIsAuthenticated]);

  const handleLogout = async (e) => {
    e.preventDefault();
    await signOut({ redirect: false });
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <div>
      <header>
        <Nav className="navbar navbar-dark" style={{ backgroundColor: 'black', display: 'flex', justifyContent: 'space-between', minHeight: '70px', padding: '0 20px' }}>
          {/* Left-aligned items */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
          <Link href="/" passHref>
              <NavItem>
               <span className="navbar-brand" style={{ color: 'white', cursor: 'pointer' }}>Home</span>
                </NavItem>
            </Link>
          </div>
          <div>
      {/* ... your existing layout markup */}
      <TotalPrice /> {/* This will display only the total price */}
    </div>
    

          {/* Right-aligned items */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {isAuthenticated && user ? (
              <>
                {user.image && (
                    <Image
                    src={user.image}
                    alt="Profile"
                    width={45}
                    height={45}
                    style={{ borderRadius: '50%', marginRight: '20px' }}
                  />
                )}
                  <h5 style={{ margin: '0 20px 0 0', lineHeight: '30px', color: 'white' }}>
              {user.username || user.email} {/* Display username or email as fallback */}
            </h5>
            <a onClick={handleLogout} style={{ color: 'white', cursor: 'pointer', textDecoration: 'none' }}>Logout</a>

              </>
            ) : (
              <>
                <NavItem style={{ marginRight: '20px' }}>
                  <Link href="/register" passHref>

                    <span className={`nav-link ${styles.signInButton}`}>Sign up</span>
                  </Link>
                </NavItem>
                <NavItem>
                  <Link href="/login" passHref>
                    <span className={`nav-link ${styles.signInButton}`}>Sign in</span>
                  </Link>
                </NavItem>
              </>
            )}
          </div>
        </Nav>
      </header>
      <Container>{props.children}</Container>
    </div>
  );
};

export default Layout;
