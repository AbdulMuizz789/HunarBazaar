import React, { useState } from 'react';
import ArtisanSearch from '../components/ArtisanSearch';
import { Link } from 'react-router-dom';

export default function FindArtisans() {
  const [results, setResults] = useState([]);

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Find Artisans</h1>
      <ArtisanSearch onResults={setResults} />
      
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {results.map((artisan) => (
          <div key={artisan._id} className="border p-4 rounded-lg shadow-sm">
            <Link to={`/profile/${artisan._id}`} className="hover:underline">
              <h2 className="text-xl font-semibold">{artisan.name}</h2>
            </Link>
            <p className="text-gray-600">{artisan.location}</p>
            <div className="flex items-center gap-1 my-2">
              <span className="text-yellow-500">
                {'★'.repeat(Math.round(artisan.rating?.average || 0))}
              </span>
              <span>({artisan.rating?.count || 0})</span>
            </div>
            <div className="mt-2">
              {artisan.skills?.map((skill) => (
                <span key={skill} className="inline-block bg-gray-100 px-2 py-1 rounded text-sm mr-2 mb-2">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}