import { Link } from 'react-router-dom';
import type { Salon } from '../types/salon';

interface Props {
  salon: Salon;
}

export default function SalonCard({ salon }: Props) {
  return (
    <Link
      to={`/salons/${salon.slug}`}
      className="group block bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="h-48 bg-gray-100 overflow-hidden">
        <div className="w-full h-full flex items-center justify-center text-gray-300 text-5xl">
          ✂
        </div>
      </div>
      <div className="p-4">
        <h2 className="font-semibold text-gray-900 group-hover:text-rose-600 transition-colors">
          {salon.name}
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          {salon.city} · {salon.address}
        </p>
      </div>
    </Link>
  );
}
