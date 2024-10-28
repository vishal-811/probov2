import logo from "../assets/logo.avif";

const Navbar = () => {
  return (
    <div className="bg-[#f5f5f5] border-b border-[#e3e3e3]">
      <div>
        <img src={logo} alt="Probo logo" />
      </div>

      <div>
         <div>
          For 18 years and above only,
         </div>
         <button>
           Download app
         </button>
         <button>
           Trade On
         </button>
      </div>
    </div>
  );
};

export default Navbar;
