import React from 'react';
import { Home, Shirt, Cpu, Gamepad2, LayoutGrid } from 'lucide-react';

export const CATEGORIES = [
  { id: 'All', name: 'All Categories', icon: LayoutGrid, count: 17 },
  { id: 'Home, Living & Lifestyle', name: 'Home, Living & Lifestyle', icon: Home, count: 6 },
  { id: 'Apparel, Fashion & Accessories', name: 'Apparel, Fashion & Accessories', icon: Shirt, count: 6 },
  { id: 'Electronics & Gadgets', name: 'Electronics & Gadgets', icon: Cpu, count: 5 },
  { id: 'Hobbies, Toys & Entertainment', name: 'Hobbies, Toys & Entertainment', icon: Gamepad2, count: 5 },
];

export default function CategoryFilter({ selectedCategory, onSelectCategory }) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
      {CATEGORIES.map((cat) => {
        const Icon = cat.icon;
        const isSelected = selectedCategory === cat.id;
        return (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all ${
              isSelected
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 ring-2 ring-indigo-600 ring-offset-2'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-sm'
            }`}
          >
            <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-slate-500'}`} />
            <span>{cat.name}</span>
          </button>
        );
      })}
    </div>
  );
}
