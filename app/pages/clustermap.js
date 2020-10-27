
import { Suspense, PureComponent, useState, useRef } from "react"

import GoogleMapReact from "google-map-react";
import useSupercluster from "use-supercluster";

import skiAreas from "resorts.json"
/*
 * This file is just for a pleasant getting started page for your new app.
 * You can delete everything in here and start from scratch if you like.
 */
const Marker = ({ children }) => children;

let resortsList = []
skiAreas.map((resort, index) => {
  if (
    resort.hasOwnProperty("georeferencing") &&
    resort.georeferencing.hasOwnProperty("_lat") &&
    index < 1000
  ) {
    resortsList.push(resort)
  }
})

const points = resortsList.map((resort) => ({
  type: "Feature",
  name: resort.name,
  properties: { cluster: false, resortId: resort._id },
  geometry: {
    type: "Point",
    coordinates: [parseFloat(resort.georeferencing._lng), parseFloat(resort.georeferencing._lat)],
  },
}))

const ClusterMap = () => {
  const mapRef = useRef();
  const [bounds, setBounds] = useState(null);
  const [zoom, setZoom] = useState(10);

  const { clusters, supercluster } = useSupercluster({
    points,
    bounds,
    zoom,
    options: { radius: 300, maxZoom: 20,minPoints:3 }
  });

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: "AIzaSyC-SHJIeZ62-GxCyNCvHk7Tn1AtTfiLyR0" }}
        defaultCenter={{ lat: 52.6376, lng: -1.135171 }}
        defaultZoom={10}
        yesIWantToUseGoogleMapApiInternals
        onGoogleApiLoaded={({ map }) => {
          mapRef.current = map;
        }}
        onChange={({ zoom, bounds }) => {
          setZoom(zoom);
          setBounds([
            bounds.nw.lng,
            bounds.se.lat,
            bounds.se.lng,
            bounds.nw.lat
          ]);
        }}
      >
        {clusters.map(cluster => {
          const [longitude, latitude] = cluster.geometry.coordinates;
          const {
            cluster: isCluster,
            point_count: pointCount
          } = cluster.properties;

          if (isCluster) {
            return (
              <Marker
                key={`cluster-${cluster.id}`}
                lat={latitude}
                lng={longitude}
              >
                <div
                  className="cluster-marker"
                  style={{
                    width: `${10 + (pointCount / points.length) * 20}px`,
                    height: `${10 + (pointCount / points.length) * 20}px`
                  }}
                  onClick={() => {
                    const expansionZoom = Math.min(
                      supercluster.getClusterExpansionZoom(cluster.id),
                      20
                    );
                    mapRef.current.setZoom(expansionZoom);
                    mapRef.current.panTo({ lat: latitude, lng: longitude });
                  }}
                >
                  {pointCount}
                </div>
              </Marker>
            );
          }

          return (
            <Marker
              key={`resort-${cluster.properties.resortId}`}
              lat={latitude}
              lng={longitude}
            >
              <button className="crime-marker">
                <img src="location-pin.svg" alt="crime doesn't pay" />
              </button>
            </Marker>
          );
        })}
      </GoogleMapReact>
    </div>
  );
}

export default ClusterMap