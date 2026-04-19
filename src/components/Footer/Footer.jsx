// import './Footer.css';
// import { Link } from 'react-router-dom';

// export default function Footer() {
//   return (
//     <footer className="footer">
//       <div className="footer-inner">
//         {/* Brand */}
//         <div className="footer-brand">
//           <div className="footer-logo">
//             <span className="footer-logo-hindi">ABHIVRIDDHI</span>
//             <span className="footer-logo-en">ORGANICS</span>
//           </div>
//           <p className="footer-address">
//             Abhivriddhi Organics, Post Mouhar, Near Society Office / Near
//             Panchayat Office, Tikaitan Tola, Kothi, Didaunh Satna Madhya
//             Pradesh, 485666
//           </p>
//           <div className="footer-socials">
//             <a href="#" aria-label="Instagram" className="social-link">
//               <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                 <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
//                 <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
//                 <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
//               </svg>
//             </a>
//             <a href="#" aria-label="Facebook" className="social-link">
//               <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                 <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
//               </svg>
//             </a>
//           </div>
//         </div>

//         {/* Quick Links */}
//         <div className="footer-links-group">
//           <h4 className="footer-links-title">Quick Links</h4>
//           <ul className="footer-links">
//             <li><a href="#">Products</a></li>
//             <li><a href="#">Contact Us</a></li>


//           </ul>
//         </div>
//       </div>

//       {/* Bottom bar */}
//       <div className="footer-bottom">
//         <div className="footer-bottom-links">
//           <a href="#">Privacy Policy</a>
//           <a href="#">Shipping</a>
//           <Link to="/terms">Terms & Conditions</Link>
//           <a href="#">Cancellation &amp; Return Policy</a>
//         </div>
//         <span className="footer-copy">Team Abhivriddhi Organics</span>
//       </div>
//     </footer>
//   );
// }


import './Footer.css';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        {/* Brand */}
        <div className="footer-brand">
          <div className="footer-logo">
            <img src="/images/footer-logo.png" alt="Abhivriddhi Organics" className="footer-logo-img" />
          </div>
          <p className="footer-address">
            Abhivriddhi Organics, Post Mouhar, Near Society Office / Near
            Panchayat Office, Tikaitan Tola, Kothi Didaundh, Satna, Madhya
            Pradesh, 485666
          </p>
          <div className="footer-socials">
            <a href="https://www.instagram.com/abhivriddhi_organics/?hl=en" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="social-link">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
            <a href="https://www.facebook.com/share/1CguCXoqy2/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="social-link">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-links-group">
          <h4 className="footer-links-title">Quick Links</h4>
          <ul className="footer-links">
            <li><Link to="/products">Products</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
          </ul>
        </div>

        {/* Policy Links - Desktop Only */}
        <div className="footer-links-group footer-policies-desktop">
          <h4 className="footer-links-title">Policies</h4>
          <ul className="footer-links">
            <li><Link to="/privacy-policy">Privacy Policy</Link></li>
            <li><Link to="/shipping-policy">Shipping</Link></li>
            <li><Link to="/terms">Terms & Conditions</Link></li>
            <li><Link to="/cancellation-policy">Cancellation & Return Policy</Link></li>
          </ul>
        </div>
        {/* Centered Copyright within the main green area */}
        {/* <div className="footer-copyright-inner">
          <p>© 2026 Abhivriddhi Organics. All rights reserved.</p>
        </div> */}
      </div>

      {/* Admin and Powered By (Above White Line) */}
      <div className="footer-admin-powered">
        <Link to="/admin/login" className="admin-access-link" style={{ margin: 0 }}>Admin Access</Link>
        <a href="https://inxspotagency.framer.website/" target="_blank" rel="noopener noreferrer" style={{ color: '#ffffff', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.5px', textDecoration: 'none' }}>Powered by <strong>INSPOT</strong></a>
      </div>

      {/* Bottom bar */}
      <div className="footer-bottom">
        <div className="footer-bottom-links">
          <Link to="/privacy-policy">Privacy Policy</Link>
          <Link to="/shipping-policy">Shipping</Link>
          <Link to="/terms">Terms & Conditions</Link>
          <Link to="/cancellation-policy">Cancellation & Return Policy</Link>
        </div>

        <div className="footer-bottom-flex">
          {/* <div className="footer-powered">
            <span>Powered by -</span>
            <img src="/images/inv-logo.png" alt="Powered By" className="powered-logo" />
          </div> */}

          <span className="footer-copyright-center">© 2026 Abhivriddhi Organics. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}
