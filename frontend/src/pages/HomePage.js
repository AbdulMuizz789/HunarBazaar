import React from "react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white font-sans">
      {/* Navbar */}
      <header className="flex justify-between items-center px-8 py-6">
        <div className="text-xl font-bold flex items-center space-x-2">
          <div className="w-4 h-4 bg-gradient-to-tr from-pink-500 to-purple-500 rounded-full" />
          <span>HunarBazaar</span>
        </div>
        <nav className="space-x-6">
          <a href="/" className="hover:text-purple-400 transition">Home</a>
          <a href="/gigs" className="hover:text-purple-400 transition">Gigs</a>
          <a href="/login" className="hover:text-purple-400 transition">Login</a>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="px-8 py-16 relative overflow-hidden">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Empowering Artisan Collaboration</h1>
          <p className="text-lg text-gray-300 mb-8">Connecting local talent with global opportunities through intelligent recommendations.</p>

          <div className="flex space-x-6 mb-6">
            <div className="text-center">
              <div className="text-3xl mb-2">🧑‍🎨</div>
              <p>FIND ARTISANS</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">🤝</div>
              <p>COLLABORATE</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">💡</div>
              <p>GET INSPIRED</p>
            </div>
          </div>

          <p className="text-gray-400 mb-8 max-w-lg">
            HunarBazaar is a platform where skilled creators and clients come together. Whether you're looking for handcrafted goods, or a project partner, our hybrid recommendation system matches you based on skills, interests, and intent.
          </p>

          <div className="space-x-4">
            <button className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg shadow">Get Started</button>
            <button className="px-6 py-2 border border-gray-400 hover:bg-gray-700 rounded-lg shadow">View Gigs</button>
          </div>
        </div>

        {/* Gradient lines / abstract wave effect */}
        <img className="absolute right-0 top-0 bottom-0 w-1/2 opacity-30 pointer-events-none transform scale-x-[-1]" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQF8djlNe8HhWHA_q1LW-AMElaYWhFlD407EnBykoQz9S-cSH0QSL9d5N33Gvm72coAZpI&usqp=CAU" />
      </section>
    </div>
  );
}