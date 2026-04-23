import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';
import { getClubs } from '../services/clubService';
import { Award } from 'lucide-react';

const ClubsPage = () => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getClubs().then(r => setClubs(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const icons = ['🖥️', '⚽', '🎨', '🔬', '📚', '🎭', '🎵', '🏆'];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-9">
          <h1 className="text-2xl font-bold text-gray-900">Campus Clubs</h1>
          <p className="text-sm text-gray-500 mt-1">Explore all registered clubs on campus</p>
        </div>

        {loading ? <LoadingSpinner /> : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {clubs.map((club, i) => (
              <div key={club._id} className="card hover:shadow-md transition-shadow">
                <div className="text-3xl mb-4">{icons[i % icons.length]}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{club.name}</h3>
                <p className="text-sm text-gray-500">{club.description || 'No description available.'}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClubsPage;
