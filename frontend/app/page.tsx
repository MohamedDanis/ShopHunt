"use client";
import React, { useState, useEffect, use } from "react";
import MapComponent from "@/components/MapComponent";
import Link from "next/link";
import ProductList from "@/components/ProductList";
import axios from "axios";

interface Location {
  lat: number;
  lng: number;
}

export default function Home() {
  const [selectedLocation, setSelectedLocation] = useState<Location>({
    lat: 0,
    lng: 0,
  });
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [products, setProducts] = useState<any>();
  const [flagFromChild1, setFlagFromChild1] = useState<any[]>([]);
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setSelectedLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        console.error(error);
      }
    );
  }, []);
  const handleLocationSelect = (lat: number, lng: number) => {
    // setSelectedLocation({ lat, lng });
    // console.log(lat,lng);
  };
  const searchProduct = async () => {
    await axios
      .get(`https://shop-hunt.vercel.app/api/search`, {
        params: {
          latitude: selectedLocation?.lat,
          longitude: selectedLocation?.lng,
          productName: searchQuery,
        },
      })
      .then((res) => {
        setProducts(res?.data);
        console.log(products);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleSearchQueryChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchQuery(event.target.value);
  };

  useEffect(() => {
    searchProduct();
  }, [searchQuery]);

  const handleButtonClick = (data: any) => {
    setFlagFromChild1(data);
  };

  return (
    <div style={{ width: "100vw", height: "80vh" }}>
      <MapComponent
        onLocationSelect={handleLocationSelect}
        flagChild1={flagFromChild1}
        shopData={products}
      />
      <div className="absolute top-0 py-4 md:px-28 px-4 flex justify-between  w-full bg-slate-300">
        <div>
          <h1 className="text-3xl font-bold text-teal-950">ShopHunt</h1>
          <p className="text-sm text-teal-950">Find your nearest shop</p>
        </div>
        <div className="flex items-center justify-end gap-4">
          <input
            type="text"
            onChange={(e) => handleSearchQueryChange(e)}
            className=" block h-9 md:w-full w-1/2 border border-black bg-white px-3 py-6  text-sm text-[#333333]"
            name="name"
            placeholder="Search for product"
          />
          <Link
            href="#"
            className="flex max-w-full flex-row items-center justify-center bg-teal-700 h-9 px-4 py-6 text-center font-semibold text-white transition "
          >
            <p className="mr-6 font-bold md:block hidden">Search</p>
            <div className="h-4 w-4 flex-none">
              <svg
                fill="currentColor"
                viewBox="0 0 20 21"
                xmlns="http://www.w3.org/2000/svg"
              >
                <title>Arrow Right</title>
                <polygon points="16.172 9 10.101 2.929 11.515 1.515 20 10 19.293 10.707 11.515 18.485 10.101 17.071 16.172 11 0 11 0 9"></polygon>
              </svg>
            </div>
          </Link>
        </div>
        
       
      </div>
      <div className="absolute top-20 right-28">
      {products && (
          <ProductList
            onDataFromChild1={handleButtonClick}
            products={products}
          />
        )}
      </div>
    </div>
  );
}
