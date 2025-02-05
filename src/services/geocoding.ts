import { Client } from '@googlemaps/google-maps-services-js'
import axios from 'axios'
import { geohashForLocation } from 'geofire-common'
const client = new Client({axiosInstance: axios})

export const getCoordinates = async (city: string) => {
    const apiKey = import.meta.env.VITE_GEOCODE_API_KEY

    try {
        const response = await client.geocode({
            params: {
                address: `${city}, Switzerland`,
                key: apiKey
            }
        })

        if (response.data.status === 'OK' && response.data.results.length > 0) {
            const location = response.data.results[0].geometry.location
            const geohashValue = geohashForLocation([location.lat, location.lng]) // Using geofire-common to encode


            return { lat: location.lat, lng: location.lng, geohash: geohashValue }
        }

        throw new Error(`Coordinates not found for ${city}`)
    } catch (error) {
        console.error('Erreur lors de la récupération des coordonnées:', error)
        return null
    }
}
