// src/HomePage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-12 text-center max-w-2xl w-full">
        <h1 className="text-5xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-600 to-blue-600">
          Welcome to Your Form Application!
        </h1>
        <p className="text-lg text-gray-700 mb-10 leading-relaxed">
          Choose an option below to get started with building or rendering forms.
        </p>

        <div className="space-y-6">
          <Link
            to="/create"
            className="block w-full px-8 py-4 text-xl font-bold text-black bg-gradient-to-r from-green-500 to-teal-500 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
          >
            Create a New Form
          </Link>
          <Link
            to="/render-existing" 
            className="block w-full px-8 py-4 text-xl font-bold text-black bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
          >
            Render an Existing Form (from JSON)
          </Link>
        </div>
      </div>
    </div>
  );
}