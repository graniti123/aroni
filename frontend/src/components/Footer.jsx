import React from 'react';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Separator } from './ui/separator';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">StyleHub</h3>
            <p className="text-gray-300 text-sm">
              Ihr Online-Shop für moderne Mode und Accessoires. 
              Entdecken Sie die neuesten Trends zu fairen Preisen.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white p-2">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white p-2">
                <Instagram className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white p-2">
                <Twitter className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Schnelle Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Damen</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Herren</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Accessoires</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Schuhe</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Sale</a></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Kundenservice</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Hilfe & FAQ</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Versand & Rückgabe</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Größentabelle</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Kontakt</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">AGB</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Newsletter</h4>
            <p className="text-gray-300 text-sm">
              Erhalten Sie exklusive Angebote und die neuesten Trends.
            </p>
            <div className="space-y-2">
              <Input 
                type="email" 
                placeholder="Ihre E-Mail-Adresse"
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
              />
              <Button className="w-full bg-white text-gray-900 hover:bg-gray-100">
                Abonnieren
              </Button>
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-gray-800" />

        {/* Contact Info & Copyright */}
        <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm text-gray-300">
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4" />
              <span>+49 (0) 30 12345678</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4" />
              <span>info@stylehub.de</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4" />
              <span>Berlin, Deutschland</span>
            </div>
          </div>
          
          <div className="text-sm text-gray-300">
            <p>&copy; 2025 StyleHub. Alle Rechte vorbehalten.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;