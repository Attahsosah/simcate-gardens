"use client";

import React, { useState, useRef, useEffect } from "react";
import { Calendar, X, ChevronDown } from "lucide-react";
import { format, addDays, differenceInDays } from "date-fns";

interface ModernDatePickerProps {
  onChange: (range: { from: Date; to: Date } | undefined) => void;
  placeholder?: string;
}

export default function ModernDatePicker({ onChange, placeholder = "Select dates" }: ModernDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [checkInDate, setCheckInDate] = useState<Date | null>(null);
  const [checkOutDate, setCheckOutDate] = useState<Date | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setShowCalendar(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCheckInChange = (date: string) => {
    const newDate = new Date(date);
    setCheckInDate(newDate);
    
    // If checkout is before checkin, clear it
    if (checkOutDate && newDate >= checkOutDate) {
      setCheckOutDate(null);
    }
    
    // Update parent component
    if (checkOutDate && newDate < checkOutDate) {
      onChange({ from: newDate, to: checkOutDate });
    } else {
      onChange(undefined);
    }
  };

  const handleCheckOutChange = (date: string) => {
    const newDate = new Date(date);
    setCheckOutDate(newDate);
    
    // Update parent component
    if (checkInDate && newDate > checkInDate) {
      onChange({ from: checkInDate, to: newDate });
    } else {
      onChange(undefined);
    }
  };

  const clearDates = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCheckInDate(null);
    setCheckOutDate(null);
    onChange(undefined);
  };

  const getNights = () => {
    if (checkInDate && checkOutDate) {
      return differenceInDays(checkOutDate, checkInDate);
    }
    return 0;
  };

  const formatDateForInput = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const getMinDate = () => {
    return formatDateForInput(new Date());
  };

  const getMinCheckOutDate = () => {
    if (checkInDate) {
      return formatDateForInput(addDays(checkInDate, 1));
    }
    return getMinDate();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Input Field */}
      <div
        className="relative cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center justify-between p-4 border border-gray-300 rounded-lg bg-white hover:border-indigo-400 transition-colors">
          <div className="flex items-center space-x-3">
            <Calendar className="h-5 w-5 text-indigo-600" />
            <div className="text-gray-700">
              {checkInDate && checkOutDate ? (
                <span className="font-medium">
                  {format(checkInDate, "MMM dd")} - {format(checkOutDate, "MMM dd")}
                </span>
              ) : (
                <span className="text-gray-500">{placeholder}</span>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {checkInDate && checkOutDate && (
              <button
                onClick={clearDates}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-4 w-4 text-gray-500" />
              </button>
            )}
            <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </div>
        </div>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50">
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Select Dates</h3>
                <p className="text-sm text-gray-600">Choose your check-in and check-out dates</p>
              </div>
              <button
                onClick={() => {
                  setIsOpen(false);
                  setShowCalendar(false);
                }}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {/* Date Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Check-in Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Check-in Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={checkInDate ? formatDateForInput(checkInDate) : ''}
                    onChange={(e) => handleCheckInChange(e.target.value)}
                    min={getMinDate()}
                    className="w-full p-3  text-gray-800 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  />
                  <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-800 pointer-events-none" />
                </div>
              </div>

              {/* Check-out Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Check-out Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={checkOutDate ? formatDateForInput(checkOutDate) : ''}



                    
                    onChange={(e) => handleCheckOutChange(e.target.value)}
                    min={getMinCheckOutDate()}
                    disabled={!checkInDate}
                    className={`w-full p-3 border text-slate-800 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                      !checkInDate ? 'bg-gray-50 cursor-not-allowed' : ''
                    }`}
                  />
                  <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Selection Summary */}
            {checkInDate && checkOutDate && (
              <div className="mb-6 p-4 bg-indigo-50 rounded-xl border border-indigo-200">
                <div className="text-center">
                  <div className="text-sm font-semibold text-indigo-800 mb-1">Selected Stay</div>
                  <div className="text-lg font-bold text-indigo-900">
                    {getNights()} night{getNights() !== 1 ? 's' : ''}
                  </div>
                  <div className="text-sm text-indigo-700 mt-1">
                    {format(checkInDate, "MMM dd, yyyy")} - {format(checkOutDate, "MMM dd, yyyy")}
                  </div>
                </div>
              </div>
            )}

            {/* Done Button */}
            <div className="text-center">
              <button
                onClick={() => {
                  setIsOpen(false);
                  setShowCalendar(false);
                }}
                className="px-6 py-2 bg-indigo-600 text-black rounded-lg font-medium hover:bg-indigo-700 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}