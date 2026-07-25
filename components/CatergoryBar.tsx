"use client";

import { useCategory } from "./CategoryContext";

const categories = [
  "All",
  "Anime/Cartoon",
  "Music",
  "Gaming",
  "Education",
  "Entertainment",
  "Technology",
  "Sports",
  "Movies",
  "News",
  "Comedy",
  "Cooking",
  "Travel",
  "Anime",
  "Live",
];

export default function CategoryBar() {
  const { category, setCategory } = useCategory();

  return (
  <div className="sticky top-[50px] md:top-[72px] z-20 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800">
      <div className="hide-scrollbar flex gap-3 overflow-x-auto whitespace-nowrap px-4 py-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`
              flex-shrink-0
              px-4
              py-1.5
              rounded-full
              text-sm
              font-medium
              transition-all
              duration-300
              border
              ${
                category === cat
                  ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white border-blue-500 shadow-lg shadow-blue-500/30 scale-105"
                  : "bg-slate-800/70 text-gray-300 border-slate-700 hover:bg-slate-700 hover:text-white hover:scale-105"
              }
            `}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}