import { useParams, Link, useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import useStore from '../store/useStore';
import { getPublicTrips, getTripById } from '../data/trips';
import { getCityById } from '../data/cities';
import { getActivityById } from '../data/activities';

const SharedItinerary = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const { trips, addTrip, currentUser } = useStore();

  // Try to find trip in store first, then in public trips
  let trip = trips.find(t => t.id === tripId);
  if (!trip) {
    trip = getTripById(tripId);
  }

  if (!trip || (!trip.isPublic && trip.userId !== currentUser?.id)) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <p className="text-gray-600">This itinerary is not available or not public.</p>
          <Link to="/dashboard" className="text-primary hover:underline mt-4 inline-block">
            Go to Dashboard
          </Link>
        </div>
      </MainLayout>
    );
  }

  const handleCopyTrip = () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    const copiedTrip = {
      ...trip,
      id: Date.now().toString(),
      userId: currentUser.id,
      name: `${trip.name} (Copy)`,
      isPublic: false,
      createdAt: new Date().toISOString().split('T')[0],
    };

    addTrip(copiedTrip);
    alert('Trip copied successfully!');
    navigate(`/trip/${copiedTrip.id}/view`);
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      alert('Link copied to clipboard!');
    });
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{trip.name}</h1>
              <p className="text-gray-600 mb-2">{trip.description}</p>
              <p className="text-sm text-gray-500">
                {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
              </p>
            </div>
            {trip.coverImage && (
              <img
                src={trip.coverImage}
                alt={trip.name}
                className="w-32 h-32 object-cover rounded-lg"
              />
            )}
          </div>
        </div>

        {/* Share Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Share This Itinerary</h2>
          <div className="flex space-x-4">
            <button
              onClick={handleShare}
              className="flex-1 bg-primary text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <Copy size={18} />
              <span>Copy Link</span>
            </button>
            {currentUser && (
              <button
                onClick={handleCopyTrip}
                className="flex-1 bg-secondary text-white py-3 px-6 rounded-lg font-medium hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
              >
                <Copy size={18} />
                <span>Copy Trip</span>
              </button>
            )}
            <div className="flex space-x-2">
              <button className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center">
                <Facebook size={18} />
              </button>
              <button className="px-4 py-3 bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition-colors flex items-center justify-center">
                <Twitter size={18} />
              </button>
              <button className="px-4 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors flex items-center justify-center">
                <Instagram size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Trip Summary */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Trip Summary</h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600">Cities</p>
              <p className="text-2xl font-bold text-gray-900">{trip.cities?.length || 0}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Duration</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.ceil((new Date(trip.endDate) - new Date(trip.startDate)) / (1000 * 60 * 60 * 24)) + 1} days
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Budget</p>
              <p className="text-2xl font-bold text-gray-900">${trip.budget?.total || 0}</p>
            </div>
          </div>
        </div>

        {/* Itinerary Details */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">Itinerary</h2>
          {trip.cities && trip.cities.length > 0 ? (
            trip.cities.map((cityStop, index) => {
              const city = getCityById(cityStop.cityId);
              const activities = (cityStop.activities || []).map(id => getActivityById(id)).filter(Boolean);

              return (
                <div key={index} className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-start space-x-4 mb-4">
                    {city?.image && (
                      <img
                        src={city.image}
                        alt={city.name}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{cityStop.name}</h3>
                      <p className="text-gray-600 mb-2">
                        {new Date(cityStop.startDate).toLocaleDateString()} - {new Date(cityStop.endDate).toLocaleDateString()}
                      </p>
                      {city && <p className="text-sm text-gray-500">{city.description}</p>}
                    </div>
                  </div>

                  {activities.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-semibold text-gray-900 mb-3">Activities</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {activities.map((activity) => (
                          <div
                            key={activity.id}
                            className="border border-gray-200 rounded-lg p-4"
                          >
                            <h5 className="font-semibold text-gray-900 mb-1">{activity.name}</h5>
                            <p className="text-sm text-gray-600 mb-2">{activity.description}</p>
                            <ActivityMeta duration={activity.duration} cost={activity.cost} rating={activity.rating} />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <p className="text-gray-600">No cities added to this itinerary yet.</p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default SharedItinerary;

