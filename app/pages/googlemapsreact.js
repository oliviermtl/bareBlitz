import React, { Component } from "react"
import { Map, GoogleApiWrapper, Marker } from "google-maps-react"

import skiAreas from "resorts.json"
let resortsList = []
skiAreas.map((resort, index) => {
  if (
    resort.hasOwnProperty("georeferencing") &&
    resort.georeferencing.hasOwnProperty("_lat") &&
    index < 1000
  ) {
    resortsList.push(resort)
  }
  return null
})

const points = resortsList.map((resort) => ({
  type: "Feature",
  name: resort.name,
  properties: { cluster: false, resortId: resort._id },
  geometry: {
    type: "Point",
    coordinates: {
      lat: parseFloat(resort.georeferencing._lat),
      lng: parseFloat(resort.georeferencing._lng),
    },
  },
}))

const mapStyles = {
  width: "100%",
  height: "100%",
}

export class MapContainer extends Component {
  state = {
    showingInfoWindow: false, // Hides or shows the InfoWindow
    activeMarker: {}, // Shows the active marker upon click
    selectedPlace: {}, // Shows the InfoWindow to the selected place upon a marker
  }

  onMarkerClick = (props, marker, e) =>
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true,
    })

  onClose = (props) => {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null,
      })
    }
  }

  render() {
    return (
      <Map
        google={this.props.google}
        zoom={14}
        style={mapStyles}
        initialCenter={{
          lat: -1.2884,
          lng: 36.8233,
        }}
      >
        {points.map((item, index) => {
          return (
            <Marker
              key={item.properties.resortId}
              position={item.geometry.coordinates}
              onClick={() => null}
            />
          )
        })}

        {/* <Marker
          onClick={this.onMarkerClick}
          name={'Kenyatta International Convention Centre'}
        />
        <InfoWindow
          marker={this.state.activeMarker}
          visible={this.state.showingInfoWindow}
          onClose={this.onClose}
        >
          <div>
            <h4>{this.state.selectedPlace.name}</h4>
          </div>
        </InfoWindow> */}
      </Map>
    )
  }
}

export default GoogleApiWrapper({
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
})(MapContainer)
