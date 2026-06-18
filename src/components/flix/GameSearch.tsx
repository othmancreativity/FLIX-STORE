import { useState, useMemo } from "react";
import { Search, X } from "lucide-react";

interface Game {
  id: string | number;
  title: string;
  image?: string;
  price?: number | string;
  category?: string;
  [key: string]: unknown;
}

interface GameSearchProps {
  games: Game[];
  onFilter: (filtered: Game[]) => void;
  placeholder?: string;
}

export default function GameSearch({ games, onFilter, placeholder = "ابحث عن لعبة..." }: GameSearchProps) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return games;
    const q = query.toLowerCase();
    return games.filter((g) =>
      g.title?.toLowerCase().includes(q) ||
      g.category?.toLowerCase().includes(q)
    );
  }, [query, games]);

  // أبلغ المكوّن الأب بالتغيير
  const handleChange = (value: string) => {
    setQuery(value);
    const q = value.toLowerCase();
    const result = !value.trim()
      ? games
      : games.filter((g) =>
          g.title?.toLowerCase().includes(q) ||
          g.category?.toLowerCase().includes(q)
        );
    onFilter(result);
  };

  return (
    <div className="w-full max-w-2xl mx-auto mb-8 px-4">
      <div className="relative flex items-center">
        {/* أيقونة البحث */}
        <Search
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          size={20}
        />

        {/* حقل البحث */}
        <input
          type="text"
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={placeholder}
          dir="rtl"
          className="
            w-full
            bg-white/10 backdrop-blur-md
            border border-white/20
            rounded-2xl
            py-3 pr-12 pl-10
            text-white placeholder-gray-400
            text-base
            outline-none
            focus:border-orange-400 focus:ring-2 focus:ring-orange-400/30
            transition-all duration-200
            shadow-lg
          "
        />

        {/* زر مسح البحث */}
        {query && (
          <button
            onClick={() => handleChange("")}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* عداد النتائج */}
      {query && (
        <p className="text-center text-sm text-gray-400 mt-2">
          {filtered.length === 0
            ? "مفيش نتائج 😔"
            : `${filtered.length} لعبة`}
        </p>
      )}
    </div>
  );
}
