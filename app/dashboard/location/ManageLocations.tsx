"use client"
import React, { useEffect, useState } from "react";
import AddressItem from "../components/AddressItem";
import { usePreview } from "@/app/contexts/PreviewContext";
import AddLocation from "./AddLocation";

type ManageLocationsProps = {
  locations: any[] | null;
  updateLocation: (locationData: LocationType, location_id: string) => void;
}

const ManageLocations: React.FC<ManageLocationsProps> = ({
  locations,
  updateLocation,
}) => {
  const [existingLocations, setExistingLocations] = useState<any[] | null>(null);
  const { triggerReload } = usePreview();

  useEffect(() => {
    setExistingLocations(locations!);
  }, [locations])

  const addAddress = (locationData: LocationType) => {
    setExistingLocations((prevState) => {
      if (!prevState)
        return [locationData];
      return [...prevState, locationData];
    })
  }

  const deleteLocation = async (location_id: string) => {
    setExistingLocations((prevState) => {
      if (!prevState)
        return null;

      const remainLocations = prevState.filter((location) => location.location_id !== location_id);
      return remainLocations;
    })

    const response = await fetch('/api/location', {
      method: 'DELETE',
      body: JSON.stringify({ location_id })
    });

    const data = await response.json();
    if (data.error) {
      console.log("Failed to delete", data.error);
    }

    triggerReload();
  }

  return (
    <>
      <AddLocation onAddressAdd={addAddress}/>
      {existingLocations?.map((location, index) => (
        <AddressItem {...location} key={location.location_id} onAddressChange={updateLocation} onDelete={deleteLocation}/>
      ))}
    </>
  )
}

export default ManageLocations;