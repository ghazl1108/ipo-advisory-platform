// src/components/SiteFooter.jsx
import { Link } from "react-router-dom";

export default function SiteFooter() {
  return (
    <footer className="bg-slate-900 text-slate-200">
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link to="/" className="flex items-center">
              {/* Larger logo without text */}
              <img 
                src="/images/logo-white.png" 
                alt="IPO Prediction" 
                className="h-32 w-auto" // Increased from h-8 to h-14
                onError={(e) => {
                  console.error("White logo failed to load");
                  e.target.style.display = 'none';
                }}
              />
              {/* Removed the text "IPO Predict" */}
            </Link>
            <p className="text-slate-400 text-sm mt-4">
              AI-powered predictions for IPO success. Helping companies optimize their public offerings since 2023.
            </p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-slate-400 hover:text-white transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <a href="/#about" className="text-slate-400 hover:text-white transition-colors text-sm">
                  About
                </a>
              </li>
              <li>
                <Link to="/register" className="text-slate-400 hover:text-white transition-colors text-sm">
                  Register
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy" className="text-slate-400 hover:text-white transition-colors text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-slate-400 hover:text-white transition-colors text-sm">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="text-slate-400 text-sm">Email: contact@ipopredict.com</li>
              <li className="text-slate-400 text-sm">Phone: +1 (555) 123-4567</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-400 text-sm">
          <p>© {new Date().getFullYear()} IPO Prediction Service. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}