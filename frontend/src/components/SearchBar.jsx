import { FiSearch } from 'react-icons/fi';

function SearchBar({ value, onChange, onSubmit, placeholder = 'Search...' }) {
  return (
    <form onSubmit={onSubmit} className="glass-panel flex items-center gap-3 rounded-2xl px-4 py-3">
      <FiSearch className="text-[#64748b]" />
      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-transparent text-sm text-[#334155] outline-none placeholder:text-[#94a3b8]"
      />
      <button type="submit" className="brand-primary hidden rounded-xl px-3 py-2 text-xs font-semibold sm:block">
        Search
      </button>
    </form>
  );
}

export default SearchBar;
