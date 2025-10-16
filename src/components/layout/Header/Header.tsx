

const Header = () => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="mx-auto flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Search Bar */}
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search"
            className="block w-96 rounded-full border-gray-200 bg-gray-100 py-2 pl-10 pr-4 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm"
          />
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-x-3">
          <img 
            className="h-10 w-10 rounded-full" 
            src="https://placehold.co/40x40/E2E8F0/4A5568?text=AR" 
            alt="Ankita Roy's avatar" 
          />
          <div>
            <p className="text-md font-semibold text-gray-800">Ankita Roy</p>
            <p className="text-sm text-gray-500">Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;