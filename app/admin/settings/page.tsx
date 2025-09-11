"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminSettingsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState({
    primaryColor: "#4f46e5", // Indigo
    secondaryColor: "#7c3aed", // Purple
    accentColor: "#059669", // Emerald
    backgroundColor: "#f9fafb", // Gray-50
    textColor: "#111827", // Gray-900
    lightTextColor: "#6b7280", // Gray-500
    siteName: "Simcate Gardens",
    siteDescription: "A luxurious beachfront resort offering the perfect blend of relaxation and adventure",
    contactEmail: "info@simcategardens.com",
    contactPhone: "+1 (808) 555-0123",
    enableReviews: true,
    enableNewsletter: true,
    maintenanceMode: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // TODO: Implement settings API
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      alert("Settings updated successfully!");
      router.refresh();
    } catch (error) {
      alert("An error occurred while updating settings");
    } finally {
      setIsLoading(false);
    }
  };

  const handleColorChange = (field: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCheckboxChange = (field: string) => {
    setSettings(prev => ({
      ...prev,
      [field]: !prev[field as keyof typeof prev],
    }));
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Site Settings</h2>
        <p className="text-gray-600 mt-1">Customize your resort&apos;s appearance and functionality</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Branding Settings */}
        <div className="bg-white shadow-sm rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Branding</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="siteName" className="block text-sm font-medium text-gray-700 mb-2">
                Site Name
              </label>
              <input
                type="text"
                id="siteName"
                value={settings.siteName}
                onChange={(e) => setSettings(prev => ({ ...prev, siteName: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
              />
            </div>

            <div>
              <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-2">
                Contact Email
              </label>
              <input
                type="email"
                id="contactEmail"
                value={settings.contactEmail}
                onChange={(e) => setSettings(prev => ({ ...prev, contactEmail: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
              />
            </div>

            <div>
              <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700 mb-2">
                Contact Phone
              </label>
              <input
                type="tel"
                id="contactPhone"
                value={settings.contactPhone}
                onChange={(e) => setSettings(prev => ({ ...prev, contactPhone: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="siteDescription" className="block text-sm font-medium text-gray-700 mb-2">
                Site Description
              </label>
              <textarea
                id="siteDescription"
                rows={3}
                value={settings.siteDescription}
                onChange={(e) => setSettings(prev => ({ ...prev, siteDescription: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
              />
            </div>
          </div>
        </div>

        {/* Color Settings */}
        <div className="bg-white shadow-sm rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Color Scheme</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label htmlFor="primaryColor" className="block text-sm font-medium text-gray-700 mb-2">
                Primary Color
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  id="primaryColor"
                  value={settings.primaryColor}
                  onChange={(e) => handleColorChange("primaryColor", e.target.value)}
                  className="w-12 h-10 border border-gray-300 rounded-md cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.primaryColor}
                  onChange={(e) => handleColorChange("primaryColor", e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-500"
                  placeholder="#4f46e5"
                />
              </div>
            </div>

            <div>
              <label htmlFor="secondaryColor" className="block text-sm font-medium text-gray-700 mb-2">
                Secondary Color
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  id="secondaryColor"
                  value={settings.secondaryColor}
                  onChange={(e) => handleColorChange("secondaryColor", e.target.value)}
                  className="w-12 h-10 border border-gray-300 rounded-md cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.secondaryColor}
                  onChange={(e) => handleColorChange("secondaryColor", e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-500"
                  placeholder="#7c3aed"
                />
              </div>
            </div>

            <div>
              <label htmlFor="accentColor" className="block text-sm font-medium text-gray-700 mb-2">
                Accent Color
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  id="accentColor"
                  value={settings.accentColor}
                  onChange={(e) => handleColorChange("accentColor", e.target.value)}
                  className="w-12 h-10 border border-gray-300 rounded-md cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.accentColor}
                  onChange={(e) => handleColorChange("accentColor", e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-500"
                  placeholder="#059669"
                />
              </div>
            </div>

            <div>
              <label htmlFor="backgroundColor" className="block text-sm font-medium text-gray-700 mb-2">
                Background Color
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  id="backgroundColor"
                  value={settings.backgroundColor}
                  onChange={(e) => handleColorChange("backgroundColor", e.target.value)}
                  className="w-12 h-10 border border-gray-300 rounded-md cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.backgroundColor}
                  onChange={(e) => handleColorChange("backgroundColor", e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-500"
                  placeholder="#f9fafb"
                />
              </div>
            </div>

            <div>
              <label htmlFor="textColor" className="block text-sm font-medium text-gray-700 mb-2">
                Text Color
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  id="textColor"
                  value={settings.textColor}
                  onChange={(e) => handleColorChange("textColor", e.target.value)}
                  className="w-12 h-10 border border-gray-300 rounded-md cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.textColor}
                  onChange={(e) => handleColorChange("textColor", e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-500"
                  placeholder="#111827"
                />
              </div>
            </div>

            <div>
              <label htmlFor="lightTextColor" className="block text-sm font-medium text-gray-700 mb-2">
                Light Text Color
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  id="lightTextColor"
                  value={settings.lightTextColor}
                  onChange={(e) => handleColorChange("lightTextColor", e.target.value)}
                  className="w-12 h-10 border border-gray-300 rounded-md cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.lightTextColor}
                  onChange={(e) => handleColorChange("lightTextColor", e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-500"
                  placeholder="#6b7280"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Feature Settings */}
        <div className="bg-white shadow-sm rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Features</h3>
          <div className="space-y-4">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={settings.enableReviews}
                onChange={() => handleCheckboxChange("enableReviews")}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm text-gray-700">Enable Guest Reviews</span>
            </label>

            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={settings.enableNewsletter}
                onChange={() => handleCheckboxChange("enableNewsletter")}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm text-gray-700">Enable Newsletter Signup</span>
            </label>

            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={settings.maintenanceMode}
                onChange={() => handleCheckboxChange("maintenanceMode")}
                className="rounded border-gray-300 text-red-600 focus:ring-red-500"
              />
              <span className="text-sm text-gray-700">Maintenance Mode</span>
            </label>
          </div>
        </div>

        {/* Preview */}
        <div className="bg-white shadow-sm rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Color Preview</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div 
                className="w-16 h-16 rounded-lg mx-auto mb-2 border border-gray-300"
                style={{ backgroundColor: settings.primaryColor }}
              ></div>
              <p className="text-xs text-gray-600">Primary</p>
            </div>
            <div className="text-center">
              <div 
                className="w-16 h-16 rounded-lg mx-auto mb-2 border border-gray-300"
                style={{ backgroundColor: settings.secondaryColor }}
              ></div>
              <p className="text-xs text-gray-600">Secondary</p>
            </div>
            <div className="text-center">
              <div 
                className="w-16 h-16 rounded-lg mx-auto mb-2 border border-gray-300"
                style={{ backgroundColor: settings.accentColor }}
              ></div>
              <p className="text-xs text-gray-600">Accent</p>
            </div>
            <div className="text-center">
              <div 
                className="w-16 h-16 rounded-lg mx-auto mb-2 border border-gray-300"
                style={{ backgroundColor: settings.backgroundColor }}
              ></div>
              <p className="text-xs text-gray-600">Background</p>
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Updating..." : "Update Settings"}
          </button>
        </div>
      </form>
    </div>
  );
}
