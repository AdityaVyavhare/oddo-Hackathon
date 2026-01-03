import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Reveal from "../components/Reveal";
import { mockTrips } from "../data/trips";
import useStore from "../store/useStore";
import { getCityById } from "../data/cities";
import { getActivityById } from "../data/activities";

const Calendar = () => {
  const { tripId } = useParams();
  const { trips } = useStore();
  const [expandedDays, setExpandedDays] = useState(new Set());
  const [viewMode, setViewMode] = useState("calendar"); // 'calendar' or 'timeline'

  let trip = trips.find((t) => t.id === tripId);

  // Fallback to mock data if trip not found
  if (!trip) {
    trip = mockTrips.find((t) => t.id === tripId) || mockTrips[0];
  }

  if (!trip) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <p className="text-gray-600">Trip not found</p>
        </div>
      </MainLayout>
    );
  }

  const toggleDay = (date) => {
    const newExpanded = new Set(expandedDays);
    if (newExpanded.has(date)) {
      newExpanded.delete(date);
    } else {
      newExpanded.add(date);
    }
    setExpandedDays(newExpanded);
  };

  // Generate all days in the trip
  const generateDays = () => {
    const days = [];
    const start = new Date(trip.startDate);
    const end = new Date(trip.endDate);

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      days.push(new Date(d));
    }
    return days;
  };

  const getDayActivities = (date) => {
    const dateStr = date.toISOString().split("T")[0];
    const activities = [];

    trip.cities?.forEach((cityStop) => {
      const cityStart = new Date(cityStop.startDate);
      const cityEnd = new Date(cityStop.endDate);

      if (date >= cityStart && date <= cityEnd) {
        const city = getCityById(cityStop.cityId);
        const cityActivities = (cityStop.activities || [])
          .map((id) => getActivityById(id))
          .filter(Boolean);

        activities.push({
          city: cityStop.name,
          cityId: cityStop.cityId,
          activities: cityActivities,
        });
      }
    });

    return activities;
  };

  const renderCalendarView = () => {
    const days = generateDays();

    return (
      <div className="space-y-4">
        {days.map((day, index) => {
          const dateStr = day.toISOString().split("T")[0];
          const dayActivities = getDayActivities(day);
          const isExpanded = expandedDays.has(dateStr);

          return (
            <div key={index} className="bg-white rounded-lg shadow">
              <button
                onClick={() => toggleDay(dateStr)}
                className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-500">
                      {day.toLocaleDateString("en-US", { weekday: "short" })}
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {day.getDate()}
                    </p>
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-gray-900">
                      {day.toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                    <p className="text-sm text-gray-500">
                      {dayActivities.length}{" "}
                      {dayActivities.length === 1 ? "city" : "cities"}
                    </p>
                  </div>
                </div>
                <span className="text-gray-400">{isExpanded ? "▼" : "▶"}</span>
              </button>

              {isExpanded && (
                <div className="px-4 pb-4 space-y-4">
                  {dayActivities.length > 0 ? (
                    dayActivities.map((item, idx) => (
                      <div key={idx} className="border-l-4 border-primary pl-4">
                        <h4 className="font-semibold text-primary mb-2">
                          {item.city}
                        </h4>
                        {item.activities.length > 0 ? (
                          <div className="space-y-2">
                            {item.activities.map((activity) => (
                              <div
                                key={activity.id}
                                className="bg-gray-50 rounded-lg p-3"
                              >
                                <p className="font-medium text-sm text-gray-900">
                                  {activity.name}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {activity.duration} min • ${activity.cost}
                                </p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500">
                            No activities scheduled
                          </p>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">
                      No activities scheduled for this day
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const renderTimelineView = () => {
    const days = generateDays();

    return (
      <div className="relative">
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-primary"></div>
        <div className="space-y-8 pl-16">
          {days.map((day, index) => {
            const dayActivities = getDayActivities(day);

            return (
              <div key={index} className="relative">
                <div className="absolute -left-12 top-0 w-8 h-8 bg-primary rounded-full border-4 border-white shadow"></div>
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {day.toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </h3>
                  {dayActivities.length > 0 ? (
                    <div className="space-y-4 mt-4">
                      {dayActivities.map((item, idx) => (
                        <div
                          key={idx}
                          className="border-l-4 border-primary pl-4"
                        >
                          <h4 className="font-semibold text-primary mb-2">
                            {item.city}
                          </h4>
                          {item.activities.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {item.activities.map((activity) => (
                                <div
                                  key={activity.id}
                                  className="bg-gray-50 rounded-lg p-3"
                                >
                                  <p className="font-medium text-sm text-gray-900">
                                    {activity.name}
                                  </p>
                                  <p className="text-xs text-gray-500 mt-1">
                                    {activity.duration} min • ${activity.cost}
                                  </p>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500">
                              No activities scheduled
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No activities scheduled</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Calendar: {trip.name}
            </h1>
            <p className="text-gray-600 mt-1">View your trip timeline</p>
          </div>
          <Link
            to={`/trip/${tripId}/view`}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            Back to Trip
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex space-x-2">
            <button
              onClick={() => setViewMode("calendar")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                viewMode === "calendar"
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Calendar View
            </button>
            <button
              onClick={() => setViewMode("timeline")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                viewMode === "timeline"
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Timeline View
            </button>
          </div>
        </div>

        {viewMode === "calendar" ? renderCalendarView() : renderTimelineView()}
      </div>
    </MainLayout>
  );
};

export default Calendar;
