
import * as Fa from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="w-full px-4 py-2 sm:px-6 lg:px-28 relative z-10 bg-black backdrop-blur-sm">
      <div className="w-full">
        <div className="flex items-center justify-center gap-6 py-3 md:gap-8">
          <a 
            href="https://www.youtube.com/@mahakamayatanzania" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="transform transition-all duration-300 hover:scale-110"
          >
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/10 hover:bg-gradient-to-r from-rose-500 to-orange-500 flex items-center justify-center transition-all duration-300 hover:shadow-lg">
              <Fa.FaYoutube className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
          </a>
          
          <a 
            href="https://www.facebook.com/Mahakamayatanzania?_rdc=1&_rdr#" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="transform transition-all duration-300 hover:scale-110"
          >
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/10 hover:bg-gradient-to-r from-rose-500 to-orange-500 flex items-center justify-center transition-all duration-300 hover:shadow-lg">
              <Fa.FaFacebookF className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
          </a>
          
          <a 
            href="https://www.instagram.com/judiciarytanzania?igsh=a2E2aHp5dnN6cWd2" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="transform transition-all duration-300 hover:scale-110"
          >
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/10 hover:bg-gradient-to-r from-rose-500 to-orange-500 flex items-center justify-center transition-all duration-300 hover:shadow-lg">
              <Fa.FaInstagram className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
          </a>
          
          <a 
            href="https://www.twitter.com/judiciarytz" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="transform transition-all duration-300 hover:scale-110"
          >
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/10 hover:bg-gradient-to-r from-rose-500 to-orange-500 flex items-center justify-center transition-all duration-300 hover:shadow-lg">
              <Fa.FaTwitter className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
          </a>
          
          <a 
            href="https://tanzaniajudiciary.blogspot.com/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="transform transition-all duration-300 hover:scale-110"
          >
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/10 hover:bg-gradient-to-r from-rose-500 to-orange-500 flex items-center justify-center transition-all duration-300 hover:shadow-lg">
              <Fa.FaBloggerB className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
          </a>
        </div>
        
        <div className="text-center">
          <p className={`text-xs sm:text-sm pb-2 md:text-base font-extralight transition-colors text-white duration-300`}>
            Judiciary e-Service Portal &copy; {new Date().getFullYear()}/{new Date().getFullYear() + 1}. The Judiciary of Tanzania, All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}