
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <Header />
      <main id="main-content" className="flex-1 pt-16">
        <div className="container px-4 md:px-6 pt-8 pb-16 mx-auto">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
