// components/LocationInput.tsx

import { useState, useEffect, useRef } from "react";

interface LocationInputProps {
  value: string;
  onChange: (value: string) => void;
  onCoordinatesChange?: (lat: number | null, lng: number | null, address: string | "") => void;
}

const LocationInput = ({value, onChange, onCoordinatesChange} : LocationInputProps) => {

  // State to indicate if the component is in the process of fetching the user's location
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  // State to store any error messages related to obtaining the location
  const [locationError, setLocationError] = useState<string | null>(null);
    

  // Reference for the input element
  const inputRef = useRef<HTMLInputElement>(null);
  // Ref to hold the Autocomplete instance provided by Google Maps
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  // Function to handle place selection from the Google Places Autocomplete
  const handlePlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place.geometry) {
        const lat = place.geometry.location?.lat() || 0;
        const lng = place.geometry.location?.lng() || 0;
        //const address = place.adr_address || "Address not available";
        const address = place.formatted_address || "Address not available"; // You can use either "place.formatted_address" or "place.adr_address"
        
        onCoordinatesChange?.(lat, lng, address);
        onChange(`${lat.toFixed(6)}, ${lng.toFixed(6)}, ${address}`);
      } else {
        setLocationError("Selected place does not have geometry information.");
      }
    }
  };  

  // Effect hook to load the Google Places Autocomplete API and initialize the input field
  useEffect(() => {
    if (inputRef.current) {
      autocompleteRef.current = new google.maps.places.Autocomplete(inputRef.current, {
        fields: ["formatted_address", "geometry"],
        types: ["geocode"],
      });

      // Attach the place changed event handler
      autocompleteRef.current.addListener("place_changed", handlePlaceChanged);
    }
  }, []);
  
  // Function to fetch the user's current location using the browser's Geolocation API not Google API.
  const getLocation = async () => {
    setIsGettingLocation(true); // Set loading state
    setLocationError(null); // Reset any previous errors

    try {
      // Check if the browser supports geolocation
      if (!navigator.geolocation) {
        throw new Error("Geolocation is not supported by your browser");
      }

      // Wrap the geolocation API in a Promise to use async/await syntax
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          resolve,
          (error) => {
            // Handle various error codes and return an appropriate error message
            switch (error.code) {
              case error.PERMISSION_DENIED:
                reject(new Error("Please allow location access in your browser settings"));
                break;
              case error.POSITION_UNAVAILABLE:
                reject(new Error("Location information is unavailable"));
                break;
              case error.TIMEOUT:
                reject(new Error("Location request timed out"));
                break;
              default:
                reject(new Error("An unknown error occurred"));
            }
          },
          {
            enableHighAccuracy: true, // Request high accuracy if available
            timeout: 10000,           // Wait up to 10 seconds for a response
            maximumAge: 0,            // Do not use a cached position
          }
        );
      });

      // Extract latitude and longitude from the position object
      const { latitude, longitude } = position.coords;

      // Notify the parent component of the new coordinates
      onCoordinatesChange?.(latitude, longitude,"Address not available" );
      // Update the input field with the formatted latitude and longitude
      onChange(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}, "Address not available"`);

    } catch (error) {
      // Log any errors and update the error state
      console.error("Location error:", error);
      setLocationError(
        error instanceof Error ? error.message : "Unable to get your location"
      );
    } finally {
      // Reset the loading state regardless of success or failure
      setIsGettingLocation(false);
    }
  };

  return (
    <div className="space-y-2">

      {/* Label for the location input */}
      <label className="block text-sm font-medium text-zinc-400">
        Location
      </label>

      <div className="relative">
        {/* Input field for user to type the address */}
        <input
          ref={inputRef}
          type="text"
          autoComplete="street-address"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter a location"
          className="w-full rounded-xl bg-zinc-900/50 border border-zinc-800 pl-4 pr-12 py-3.5
                      text-white transition-colors duration-200
                      focus:outline-none focus:ring-2 focus:ring-sky-500/40"
        />

        {/* Button to fetch the user's current location */}
        <button
          type="button"
          onClick={getLocation}
          disabled={isGettingLocation}
          title="Get current location"
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5
                  rounded-lg bg-sky-500/10 text-sky-400 
                  hover:bg-sky-500/20 transition-colors duration-200
                  disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {/* Show a spinner if fetching location, otherwise show a location pin icon */}
          {isGettingLocation ? (
            <svg
              className="animate-spin h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              {/* Spinner circle */}
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              {/* Spinner path */}
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : (
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {/* Location pin icon */}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Display any error messages if location cannot be fetched using btn */}
      {locationError && (
          <p className="text-sm text-red-400 flex items-center gap-2">
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {/* Error icon */}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            {locationError}
          </p>
        )}
    </div>
  );
};

export default LocationInput;
