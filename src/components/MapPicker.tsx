import { useEffect, useRef, useState } from 'react';
import { MapPin, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useI18n } from '@/i18n';

type MunicipalityBoundaryFeature = {
  type: 'Feature';
  properties?: Record<string, unknown>;
  geometry: {
    type: string;
    coordinates: unknown;
  };
};

interface MapPickerProps {
  location: string;
  latitude: number | null;
  longitude: number | null;
  onLocationChange: (location: string, lat: number | null, lng: number | null) => void;
  compact?: boolean;
  hideLabel?: boolean;
  municipalityBoundary?: MunicipalityBoundaryFeature | null;
  defaultCenter?: google.maps.LatLngLiteral;
  defaultZoom?: number;
  fitBoundaryOnLoad?: boolean;
}

declare global {
  interface Window {
    google: typeof google;
    initMap: () => void;
  }
}

export function MapPicker({
  location,
  latitude,
  longitude,
  onLocationChange,
  compact = false,
  hideLabel = false,
  municipalityBoundary = null,
  defaultCenter,
  defaultZoom,
  fitBoundaryOnLoad = false,
}: MapPickerProps) {
  const { t } = useI18n();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);
  const boundaryLayerRef = useRef<google.maps.Data | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const isInitializingRef = useRef(false);
  const onLocationChangeRef = useRef(onLocationChange);

  // Keep callback ref updated
  useEffect(() => {
    onLocationChangeRef.current = onLocationChange;
  }, [onLocationChange]);

  // Load Google Maps script
  useEffect(() => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    
    if (!apiKey) {
      console.warn('⚠️ VITE_GOOGLE_MAPS_API_KEY not set. Google Maps will not work.');
      return;
    }

    if (window.google && window.google.maps) {
      setIsMapLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initMap`;
    script.async = true;
    script.defer = true;
    
    window.initMap = () => {
      setIsMapLoaded(true);
    };

    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  // Initialize map when Google Maps is loaded (only once)
  useEffect(() => {
    if (!isMapLoaded || !mapRef.current || !window.google || isInitializingRef.current) return;
    if (mapInstanceRef.current) return; // Map already initialized

    isInitializingRef.current = true;

    const mapCenter = latitude && longitude
      ? { lat: latitude, lng: longitude }
      : defaultCenter ?? { lat: 35.3083, lng: 24.1636 };

    const mapZoom = latitude && longitude ? 15 : defaultZoom ?? 10;

    const newMap = new window.google.maps.Map(mapRef.current, {
      center: mapCenter,
      zoom: mapZoom,
      mapTypeControl: true,
      streetViewControl: false,
      fullscreenControl: true,
    });

    mapInstanceRef.current = newMap;

    if (municipalityBoundary) {
      const boundaryLayer = new window.google.maps.Data({ map: newMap });
      boundaryLayer.addGeoJson(municipalityBoundary);
      boundaryLayer.setStyle({
        fillColor: '#0098eb',
        fillOpacity: 0.14,
        strokeColor: '#0078c8',
        strokeOpacity: 0.92,
        strokeWeight: 2.5,
        clickable: false,
      });
      boundaryLayerRef.current = boundaryLayer;

      if (fitBoundaryOnLoad && !latitude && !longitude) {
        const bounds = new window.google.maps.LatLngBounds();
        boundaryLayer.forEach((feature) => {
          feature.getGeometry()?.forEachLatLng((latLng) => bounds.extend(latLng));
        });
        if (!bounds.isEmpty()) {
          newMap.fitBounds(bounds, compact ? 28 : 48);
        }
      }
    }

    // Helper function to update location
    const updateLocation = (lat: number, lng: number, address?: string) => {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === 'OK' && results && results[0]) {
          onLocationChangeRef.current(results[0].formatted_address, lat, lng);
        } else {
          onLocationChangeRef.current(address || '', lat, lng);
        }
      });
    };

    // Add marker if coordinates exist
    if (latitude && longitude) {
      const newMarker = new window.google.maps.Marker({
        position: { lat: latitude, lng: longitude },
        map: newMap,
        draggable: true,
      });
      markerRef.current = newMarker;

      // Update location when marker is dragged
      newMarker.addListener('dragend', () => {
        const position = newMarker.getPosition();
        if (position) {
          updateLocation(position.lat(), position.lng());
        }
      });
    }

    // Add click listener to place marker
    newMap.addListener('click', (e: google.maps.MapMouseEvent) => {
      if (e.latLng) {
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();

        if (markerRef.current) {
          markerRef.current.setPosition({ lat, lng });
        } else {
          const newMarker = new window.google.maps.Marker({
            position: { lat, lng },
            map: newMap,
            draggable: true,
          });
          markerRef.current = newMarker;

          newMarker.addListener('dragend', () => {
            const position = newMarker.getPosition();
            if (position) {
              updateLocation(position.lat(), position.lng());
            }
          });
        }

        updateLocation(lat, lng);
      }
    });

    isInitializingRef.current = false;
  }, [isMapLoaded]); // Only depend on isMapLoaded

  // Update marker position when coordinates change externally (but don't re-create map)
  useEffect(() => {
    if (!mapInstanceRef.current || !isMapLoaded) return;

    if (latitude && longitude) {
      if (markerRef.current) {
        markerRef.current.setPosition({ lat: latitude, lng: longitude });
        mapInstanceRef.current.setCenter({ lat: latitude, lng: longitude });
        mapInstanceRef.current.setZoom(15);
      } else {
        const newMarker = new window.google.maps.Marker({
          position: { lat: latitude, lng: longitude },
          map: mapInstanceRef.current,
          draggable: true,
        });
        markerRef.current = newMarker;

        newMarker.addListener('dragend', () => {
          const position = newMarker.getPosition();
          if (position) {
            const geocoder = new window.google.maps.Geocoder();
            geocoder.geocode({ location: position }, (results, status) => {
              if (status === 'OK' && results && results[0]) {
                onLocationChangeRef.current(results[0].formatted_address, position.lat(), position.lng());
              } else {
                onLocationChangeRef.current('', position.lat(), position.lng());
              }
            });
          }
        });
      }
    } else if (!latitude && !longitude && markerRef.current) {
      markerRef.current.setMap(null);
      markerRef.current = null;
    }
  }, [latitude, longitude, isMapLoaded]);

  // Initialize autocomplete for search (only once)
  useEffect(() => {
    if (!isMapLoaded || !searchInputRef.current || !window.google || autocompleteRef.current) return;

    const autocomplete = new window.google.maps.places.Autocomplete(searchInputRef.current, {
      types: ['geocode', 'establishment'],
      componentRestrictions: { country: 'gr' }, // Restrict to Greece
    });

    autocompleteRef.current = autocomplete;

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (place.geometry && place.geometry.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        const address = place.formatted_address || place.name || '';

        if (mapInstanceRef.current) {
          mapInstanceRef.current.setCenter({ lat, lng });
          mapInstanceRef.current.setZoom(15);
        }

        if (markerRef.current) {
          markerRef.current.setPosition({ lat, lng });
        } else {
          const newMarker = new window.google.maps.Marker({
            position: { lat, lng },
            map: mapInstanceRef.current || undefined,
            draggable: true,
          });
          markerRef.current = newMarker;

          newMarker.addListener('dragend', () => {
            const position = newMarker.getPosition();
            if (position) {
              const geocoder = new window.google.maps.Geocoder();
              geocoder.geocode({ location: position }, (results, status) => {
                if (status === 'OK' && results && results[0]) {
                  onLocationChangeRef.current(results[0].formatted_address, position.lat(), position.lng());
                } else {
                  onLocationChangeRef.current('', position.lat(), position.lng());
                }
              });
            }
          });
        }

        onLocationChangeRef.current(address, lat, lng);
        setSearchQuery(address);
      }
    });
  }, [isMapLoaded]); // Only depend on isMapLoaded

  const handleClearLocation = () => {
    if (markerRef.current) {
      markerRef.current.setMap(null);
      markerRef.current = null;
    }
    setSearchQuery('');
    onLocationChangeRef.current('', null, null);
    if (mapInstanceRef.current) {
      const resetCenter = defaultCenter ?? { lat: 35.3083, lng: 24.1636 };
      mapInstanceRef.current.setCenter(resetCenter);
      mapInstanceRef.current.setZoom(defaultZoom ?? 10);

      if (fitBoundaryOnLoad && boundaryLayerRef.current) {
        const bounds = new window.google.maps.LatLngBounds();
        boundaryLayerRef.current.forEach((feature) => {
          feature.getGeometry()?.forEachLatLng((latLng) => bounds.extend(latLng));
        });
        if (!bounds.isEmpty()) {
          mapInstanceRef.current.fitBounds(bounds, compact ? 28 : 48);
        }
      }
    }
  };

  if (!import.meta.env.VITE_GOOGLE_MAPS_API_KEY) {
    return (
      <div className="space-y-2">
        <Label>{t("eServices.problem.mapLabel")}</Label>
        <Input
          value={location}
          onChange={(e) => onLocationChange(e.target.value, null, null)}
          placeholder={t("eServices.problem.mapPlaceholder")}
        />
        <p className="text-xs text-yellow-600">
          ⚠️ Google Maps API key not configured. Add VITE_GOOGLE_MAPS_API_KEY to .env
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {!hideLabel ? <Label>{t("eServices.problem.mapLabel")}</Label> : null}
      
      {/* Search Input */}
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          ref={searchInputRef}
          value={searchQuery || location}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            // Don't update location while typing - only when place is selected
          }}
          placeholder={t("eServices.problem.mapSearch")}
          className="pl-10 pr-10"
        />
        {(location || latitude || longitude) && (
          <button
            type="button"
            onClick={handleClearLocation}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Map */}
      <div className="relative">
        <div
          ref={mapRef}
          className={compact ? "w-full h-[220px] rounded-lg border border-gray-300" : "w-full h-[400px] rounded-lg border border-gray-300"}
          style={{ minHeight: compact ? "220px" : "400px" }}
        />
        {!isMapLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">{t("eServices.problem.mapLoading")}</p>
            </div>
          </div>
        )}
      </div>

      {/* Selected Location Info */}
      {(location || (latitude && longitude)) && (
        <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
          <p className="font-medium">{t("eServices.problem.mapSelected")}</p>
          <p>
            {location ||
              t("eServices.problem.mapCoords", {
                lat: latitude?.toFixed(6) ?? "",
                lng: longitude?.toFixed(6) ?? "",
              })}
          </p>
          {latitude && longitude && (
            <p className="text-xs mt-1">
              {t("eServices.problem.mapMoveHint")}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
