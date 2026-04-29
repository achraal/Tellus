/**
 * MapWrapper – Native implementation
 * Wraps react-native-maps MapView for native platforms.
 */
import React from 'react';
import MapView, { Marker } from 'react-native-maps';

export function MapWrapper({ style, children, ...props }: any) {
  return (
    <MapView style={style} {...props}>
      {children}
    </MapView>
  );
}

export { Marker as MapMarker };
