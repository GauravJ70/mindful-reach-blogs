
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted py-8 border-t" role="contentinfo" aria-label="Site footer">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h2 className="font-bold text-xl mb-4">MindfulReach</h2>
            <p className="text-sm text-muted-foreground mb-4">
              An inclusive, professional, and accessible blogging website tailored to users of all abilities.
            </p>
            <p className="text-sm text-muted-foreground">
              © {currentYear} MindfulReach. All rights reserved.
            </p>
          </div>

          <div>
            <h2 className="font-bold text-lg mb-4">Quick Links</h2>
            <ul className="space-y-2 list-none pl-0">
              <li>
                <Link to="/" className="text-sm transition-colors hover:text-primary">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-sm transition-colors hover:text-primary">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm transition-colors hover:text-primary">
                  About
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm transition-colors hover:text-primary">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/author" className="text-sm transition-colors hover:text-primary">
                  Author
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="font-bold text-lg mb-4">Accessibility</h2>
            <p className="text-sm text-muted-foreground mb-2">
              We are committed to making our content accessible to everyone.
            </p>
            <ul className="space-y-2 list-none pl-0">
              <li>
                <Link to="/about#accessibility" className="text-sm transition-colors hover:text-primary">
                  Accessibility Statement
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm transition-colors hover:text-primary">
                  Report an Accessibility Issue
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
