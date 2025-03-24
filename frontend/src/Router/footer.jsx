import React from 'react';


const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-white">Word Wave</h3>
            <p className="text-gray-400">
              Transforming the way we interact with text and speech using advanced AI technology.
            </p>
            
          </div>

          {/* Products */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Products</h4>
            <ul className="space-y-2">
              <FooterLink href="#">Text to Speech</FooterLink>
              <FooterLink href="#">Speech to Text</FooterLink>
              <FooterLink href="#">Translation</FooterLink>
             
            </ul>
          </div>

         

          {/* Company */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-2">
              <FooterLink href="#">About Us</FooterLink>
             
              <FooterLink href="#">Contact</FooterLink>
              <FooterLink href="#">Privacy Policy</FooterLink>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400">
            © 2025 VoiceAI. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <button className="text-sm text-gray-400 hover:text-white">
              Terms of Service
            </button>
            <button className="text-sm text-gray-400 hover:text-white">
              Privacy Policy
            </button>
            <button className="text-sm text-gray-400 hover:text-white">
              Cookie Policy
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

const FooterLink = ({ href, children }) => (
  <li>
    <a 
      href={href} 
      className="text-gray-400 hover:text-white transition-colors duration-200"
    >
      {children}
    </a>
  </li>
);



export default Footer;