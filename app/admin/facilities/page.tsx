"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FacilityType } from "@prisma/client";

interface Facility {
  id: string;
  name: string;
  description: string | null;
  facilityType: FacilityType;
  isActive: boolean;
  imageUrl: string | null;
  resort: {
    id: string;
    name: string;
  };
}

export default function AdminFacilitiesPage() {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const response = await fetch('/api/admin/facilities');
        if (response.ok) {
          const data = await response.json();
          setFacilities(data.facilities || []);
        }
      } catch (error) {
        console.error('Error fetching facilities:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFacilities();
  }, []);

  const facilityTypeLabels: Record<FacilityType, string> = {
    POOL: "Pool",
    RESTAURANT: "Restaurant",
    SPA: "Spa",
    GYM: "Gym",
    BAR: "Bar",
    BEACH_ACCESS: "Beach Access",
    PARKING: "Parking",
    CONFERENCE_ROOM: "Conference Room",
    TENNIS_COURT: "Tennis Court",
    GOLF_COURSE: "Golf Course",
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-gray-600">Loading facilities...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Facility Management</h2>
        <Link
          href="/admin/facilities/new"
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
        >
          Add New Facility
        </Link>
      </div>

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Facility
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {facilities.map((facility) => (
                <tr key={facility.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-4">
                      {facility.imageUrl && (
                        <img
                          src={facility.imageUrl}
                          alt={facility.name}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                      )}
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {facility.name}
                        </div>
                        <div className="text-sm text-gray-600">
                          {facility.description}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      {facilityTypeLabels[facility.facilityType]}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      facility.isActive 
                        ? "bg-green-100 text-green-800" 
                        : "bg-red-100 text-red-800"
                    }`}>
                      {facility.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Link
                        href={`/admin/facilities/${facility.id}/edit`}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Edit
                      </Link>
                      <button
                        className="text-red-600 hover:text-red-900"
                        onClick={async () => {
                          if (confirm(`Are you sure you want to delete "${facility.name}"?`)) {
                            try {
                              const response = await fetch(`/api/admin/facilities/${facility.id}`, {
                                method: 'DELETE',
                              });
                              
                              if (response.ok) {
                                setFacilities(prev => prev.filter(f => f.id !== facility.id));
                              } else {
                                alert('Failed to delete facility');
                              }
                            } catch (error) {
                              alert('Error deleting facility');
                            }
                          }
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {facilities.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-600 mb-4">No facilities found</div>
          <Link
            href="/admin/facilities/new"
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
          >
            Add Your First Facility
          </Link>
        </div>
      )}
    </div>
  );
}
