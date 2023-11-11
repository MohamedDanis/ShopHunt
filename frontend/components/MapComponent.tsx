import React, { useState, useEffect, useRef } from "react";
import {
  GoogleMap,
  Marker,
  LoadScript,
  InfoWindow,
} from "@react-google-maps/api";


const MapComponent = ({ onLocationSelect, shopData, flagChild1 }: any) => {
  const mapRef = useRef<google.maps.Map | null>(null);
  const [position, setPosition] = useState<null | { lat: number; lng: number }>(
    null
  );
  const [infoWindow, setInfoWindow] = useState<boolean>(false);
  const [mapCenter, setMapCenter] = useState<null | {
    lat: number;
    lng: number;
  }>({ lat: 11.048103285269043, lng: 76.07736110687256 });
  const [btnClicked, setBtnClicked] = useState(false);
  const [selectedShop, setSelectedShop] = useState<any | null>(null);
  const handleMarkerClick = (shop: any) => {
    setSelectedShop(shop);
    setInfoWindow(true);
  };
  const handleCloseInfoWindow = () => {
    setInfoWindow(false);
  };
  const handleMove = (data: any) => {
    setMapCenter({ lat: data?.latitude, lng: data?.longitude });
  };
  useEffect(() => {
    if (flagChild1) {
      console.log(flagChild1);
      handleMove(flagChild1?.shopLocation);
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setPosition({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        console.error(error);
      }
    );
    onLocationSelect(position?.lat, position?.lng);
  }, [flagChild1]);
  const handleMapLoad = (map: google.maps.Map) => {
    mapRef.current = map;
  };
  const MAP = process.env.NEXT_PUBLIC_MAP_TOKEN
  return (
    <LoadScript googleMapsApiKey={MAP || ''}>
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "100vh" }}
        center={{
          lat: mapCenter?.lat ?? 11.048103285269043,
          lng: mapCenter?.lng ?? 76.07736110687256,
        }}
        zoom={10}
        onLoad={handleMapLoad}
      >
        {position && (
          <Marker
            position={{ lat: 11.048103285269043, lng: 76.07736110687256 }}
            icon={{
              url: "https://w7.pngwing.com/pngs/731/25/png-transparent-location-icon-computer-icons-google-map-maker-marker-pen-cartodb-map-marker-heart-logo-color-thumbnail.png",
              scaledSize: new window.google.maps.Size(40, 40),
            }}
          />
        )}
        {shopData &&
          shopData.map((shop: any, index: any) => (
            <Marker
              key={index}
              position={{
                lat: shop?.shopLocation?.latitude,
                lng: shop?.shopLocation?.longitude,
              }}
              onClick={() => handleMarkerClick(shop)}
              icon={{
                url: "https://cdn3.iconfinder.com/data/icons/map-markers-1/512/supermarket-512.png",
                scaledSize: new window.google.maps.Size(40, 40), // Adjust the size as needed
              }}
            />
          ))}
        {infoWindow && selectedShop && (
          <InfoWindow
            position={{
              lat: selectedShop?.shopLocation?.latitude,
              lng: selectedShop?.shopLocation?.longitude,
            }}
            onCloseClick={handleCloseInfoWindow}
          >
            <div className="">
              <h3 className="text-black font-medium">
                {selectedShop?.shopName}
              </h3>
              <p className="text-black">Location: near mlp</p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default MapComponent;
