import { NextResponse, type NextRequest } from 'next/server'
import geolib,{getDistance} from 'geolib'
import ShopData from '@/data/shop.json'

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const latitude = searchParams.get('latitude')
    const longitude = searchParams.get('longitude')
    const productName = searchParams.get('productName')
    const userLocation = {
        latitude: Number(latitude),
        longitude: Number(longitude)
      };
    const nearbyshops = ShopData.filter((item)=>{
        const shopLocation={
          latitude:item.shopLocation.latitude,
          longitude:item.shopLocation.longitude
        }
        const distance = getDistance(userLocation,shopLocation)
        return distance;
      }).filter((item2) => {    
        return item2.products.some(fruit => fruit.productName===productName);
      }).sort((a, b) => {
        const aDistance = getDistance(userLocation, a.shopLocation);
        const bDistance = getDistance(userLocation, b.shopLocation);
        return aDistance - bDistance;
      }).map((shop) => {
        const distance = getDistance(userLocation, shop.shopLocation);
        return { ...shop, distance };
      });
    return NextResponse.json(nearbyshops)
}