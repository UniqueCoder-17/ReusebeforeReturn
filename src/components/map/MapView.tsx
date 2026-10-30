import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import { useNavigate } from 'react-router-dom'
import { DEFAULT_LAT, DEFAULT_LNG } from '@/lib/constants'
import { formatPrice, conditionLabel } from '@/lib/utils'
import type { Product } from '@/types'

delete (L.Icon.Default.prototype as { _getIconUrl?: unknown })._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

const greenIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41],
})

function MapCenter({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap()
  useEffect(() => { map.setView([lat, lng], 12) }, [lat, lng, map])
  return null
}

interface Props { products: Product[]; centerLat?: number; centerLng?: number }

export function MapView({ products, centerLat = DEFAULT_LAT, centerLng = DEFAULT_LNG }: Props) {
  const navigate = useNavigate()
  const withCoords = products.filter(p => p.latitude && p.longitude)
  return (
    <div className="w-full h-full min-h-[400px] rounded-xl overflow-hidden border">
      <MapContainer center={[centerLat, centerLng]} zoom={12} style={{ height: '100%', width: '100%' }} className="z-0">
        <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MapCenter lat={centerLat} lng={centerLng} />
        {withCoords.map(product => (
          <Marker key={product.id} position={[product.latitude!, product.longitude!]} icon={greenIcon}>
            <Popup>
              <div className="w-48">
                <p className="font-semibold text-sm line-clamp-2 mb-1">{product.title}</p>
                <p className="text-xs text-gray-600 mb-1">{product.locality}, {product.city}</p>
                <p className="text-xs font-bold text-green-700 mb-2">{formatPrice(product.price, product.listing_type)} · {conditionLabel(product.condition)}</p>
                <button onClick={() => navigate(`/products/${product.id}`)} className="w-full text-xs bg-green-600 text-white py-1.5 rounded hover:bg-green-700 transition-colors">View Details</button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}
