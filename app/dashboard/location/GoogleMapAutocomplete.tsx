'use client';
import { loadGoogleMapsScript } from '@/utils/loadScript';
import { waitForGoogleAPI } from '@/utils/waitForGoogleAPI';
import { Check, MapPin, Spinner } from '@phosphor-icons/react/dist/ssr';
import React, { useEffect, useReducer, useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';
import LabeledInput from '../components/LabeledInput';

type GoogleMapAutocompleteProps = {
  id: string;
  defaultAddress: string;
  cityname?: string;
};

type LocationDetails = {
  city_name: string | null;
  country_name: string | null;
  area_name: string | null;
};

const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

loadGoogleMapsScript(apiKey);

const GoogleMapAutocomplete: React.FC<GoogleMapAutocompleteProps> = ({
  id,
  defaultAddress,
  cityname,
}: GoogleMapAutocompleteProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);
  const [geocoder, setGeocoder] = useState<google.maps.Geocoder | null>(null);
  const [inputAddress, setInputAddress] = useState(defaultAddress); // Track input changes
  const [country, setCountry] = useState<string>("");
  const [area, setArea] = useState<string>("");
  const [city, setCity] = useState<string>(cityname || "");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [isFocused, setIsFocused] = useState(false);

  const status = useFormStatus();
  const hasStartedPending = useRef(false);

  useEffect(() => {
    if (defaultAddress)
      setInputAddress(defaultAddress);
    if (cityname)
      setCity(cityname);
  }, [defaultAddress, cityname])

  useEffect(() => {
    const initialize = async () => {
      try {
        if (typeof window === 'undefined')
          return;
        // Initialize Geocoder
        const geocoderInstance = new google.maps.Geocoder();
        setGeocoder(geocoderInstance);

        // Initialize Google Map with a unique container
        const mapElement = document.getElementById(id + "_map");
        if (mapElement) {
          const newMap = new google.maps.Map(mapElement, {
            center: { lat: 51.51, lng: -0.14 }, // Default center
            zoom: 8,
          });
          setMap(newMap);

          const newMarker = new google.maps.Marker({
            position: { lat: 51.51, lng: -0.14 },
            map: newMap,
            title: 'Marker', // Optional: title to display on hover
          });
          setMarker(newMarker);
        }

        // Initialize Autocomplete
        if (inputRef.current) {
          const autoComplete = new google.maps.places.Autocomplete(inputRef.current);
          autoComplete.addListener('place_changed', () => {
            const place = autoComplete.getPlace();
            if (place.geometry?.location) {
              const location = place.geometry.location;
              setInputAddress(place.formatted_address || ''); // Update input state
              if (map) {
                map.setCenter(location);
                map.setZoom(18);

                if (marker)
                  marker.setPosition({ lat: location.lat(), lng: location.lng() });
              }
            }
          });

          setAutocomplete(autoComplete);
        }
      } catch (error) {
        console.error('Error loading Google Maps script:', error);
      }
    };

    // console.log(typeof google);
    waitForGoogleAPI()
      .then(() => {
        initialize();
      })
      .catch((error) => {
        console.error(error);
      })

    return () => {
      // Cleanup event listeners when the component unmounts
      if (autocomplete) {
        google.maps.event.clearListeners(autocomplete, 'place_changed');
      }
    };
  }, [apiKey, typeof google]);

  // Handle manual input address changes
  useEffect(() => {
    if (geocoder && map && inputAddress) {
      geocoder.geocode({ address: inputAddress }, (results, status) => {
        if (status === 'OK' && results && results[0]?.geometry.location) {
          const location = results[0].geometry.location;
          setLatitude(location.lat());
          setLongitude(location.lng());

          const { city_name, country_name, area_name } = extractLocationDetails(results[0]);

          // if (city_name)
          //   setCity(city_name || "");
          setCountry(country_name || "");
          setArea(area_name || "");

          map.setCenter(location);
          map.setZoom(19);

          if (marker)
            marker.setPosition({ lat: location.lat(), lng: location.lng() });
        } else {
          // console.error('Geocode was not successful for the following reason:', status);
        }
      });
    }
  }, [inputAddress, geocoder, map]);

  useEffect(() => {
    if (status.pending && !hasStartedPending.current) {
      hasStartedPending.current = true;
    }

    if (!status.pending && hasStartedPending.current) {
      hasStartedPending.current = false;

      setInputAddress("");

      // Dispatch the custom event to trigger iframe refresh
      const event = new Event("iframeRefresh");
      window.dispatchEvent(event); // Fire the event to refresh the iframe
    }
  }, [status.pending]);

  // Function to extract city name from address components
  const extractLocationDetails = (
    place: google.maps.places.PlaceResult | google.maps.GeocoderResult
  ): LocationDetails => {
    const addressComponents = place.address_components;
    let city_name: string | null = null;
    let country_name: string | null = null;
    let area_name: string | null = null;

    if (addressComponents) {
      for (const component of addressComponents) {
        if (component.types.includes('locality')) {
          city_name = component.long_name; // City name
        } else if (component.types.includes('postal_town')) {
          city_name = city_name || component.long_name; // Fallback for city name
        } else if (component.types.includes('administrative_area_level_1')) {
          city_name = city_name || component.long_name; // Fallback for city name (state/province-level)
        } else if (component.types.includes('administrative_area_level_2')) {
          area_name = component.long_name; // Area (e.g., county or district)
        } else if (component.types.includes('country')) {
          country_name = component.long_name; // Country name
        }
      }
    }

    return { city_name, country_name, area_name };
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    if (inputAddress === '') {
      setIsFocused(false);
    }
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputAddress(value);

    if (geocoder && map && value) {
      geocoder.geocode({ address: value }, (results, status) => {
        if (status === 'OK' && results && results[0]?.geometry.location) {
          const location = results[0].geometry.location;
          setLatitude(location.lat());
          setLongitude(location.lng());

          const { city_name, country_name, area_name } = extractLocationDetails(results[0]);

          setCity(city_name || "");
          setCountry(country_name || "");
          setArea(area_name || "");

          map.setCenter(location);
          map.setZoom(19);

          if (marker)
            marker.setPosition({ lat: location.lat(), lng: location.lng() });
        } else {
          // console.error('Geocode was not successful for the following reason:', status);
        }
      });
    }
  }

  return (
    <>
      <div className="w-full mb-3">
        <div className='relative rounded-[26px] bg-white pt-[20px] pb-2 px-4 h-[50px] mb-4'>
          <label
            htmlFor={id}
            className={`absolute top-[12px] text-gray-500 transition-all duration-100 ease-linear transform ${isFocused || inputAddress ? '-translate-y-[7px] text-xs' : 'scale-100'} pl-5`}
          >
            Enter your address
          </label>
          <MapPin
            size={24}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500"
          />
          <input
            ref={inputRef}
            type="text"
            id={id}
            name={id}
            className="w-full pl-5 text-base placeholder:text-neutral-500 text-neutral-800 placeholder:font-normal"
            placeholder=""
            value={inputAddress}
            onChange={handleAddressChange} // Update input state for manual entry
            onFocus={handleFocus}
            onBlur={handleBlur}
            required
          />
          <div>
            <button type='submit' className='absolute flex justify-center items-center top-0 right-0 w-[60px] h-[50px] rounded-r-[26px] bg-primary-1 hover:bg-[#6960e6]'>
              {status.pending ? (
                <Spinner className="animate-spin" size={20} color='white' />
              ) : (
                <Check size={20} color='white' />
              )}
            </button>
          </div>
        </div>

        <input type="hidden" name="full_address" value={inputAddress} required />
        <input type="hidden" name="country" value={country} required />
        <div className={inputAddress ? "block" : "hidden"}>
          <LabeledInput
            label='City'
            name={"city-" + id}
            value={city}
            onChange={e => setCity(e.target.value)}
            className="w-full"
            required
          />
        </div>
        <input type="hidden" name="area" value={area} required />
        <input
          type="hidden"
          name="latitude"
          value={latitude ? latitude.toString() : ""}
          required
        />
        <input
          type="hidden"
          name="longitude"
          value={longitude ? longitude.toString() : ""}
          required
        />
      </div >

      {/* Map Container with unique ID */}
      <div id={id + "_map"} className={`w-full h-[400px] mb-3 ${inputAddress ? "block" : "hidden"}`} />
    </>
  );
};

export default GoogleMapAutocomplete;
