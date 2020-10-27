import * as React from "react"
import { Component } from "react"
import { render } from "react-dom"

import MapGL, {
  Popup,
  NavigationControl,
  FullscreenControl,
  ScaleControl,
  GeolocateControl,
} from "react-map-gl"

// import ControlPanel from './control-panel';
import Pins from "../components/pins"
// import CityInfo from './city-info';

import skiAreas from "resorts.json"

let resortsList = []
skiAreas.map((resort, index) => {
  if (
    resort.hasOwnProperty("georeferencing") &&
    resort.georeferencing.hasOwnProperty("_lat") &&
    index < 10000
  ) {
    resortsList.push(resort)
  }
})
console.log(skiAreas)
const TOKEN =
  "pk.eyJ1Ijoib2xpdmllcm10bCIsImEiOiJja2c2a3NlcjYxNWE5MnFvNXd3YWExaG13In0.n55Tr-IjbzoUZn0eNIk1iw" // Set your mapbox token here

export default class Mapmap extends Component {
  constructor(props) {
    super(props)
    this.state = {
      viewport: {
        latitude: 45.9320419,
        longitude: 6.8589211,
        zoom: 8,
        bearing: 0,
        pitch: 0,
      },
      popupInfo: null,
    }
  }

  _updateViewport = (viewport) => {
    this.setState({ viewport })
  }

  _onClickMarker = (city) => {
    this.setState({ popupInfo: city })
  }

  _renderPopup() {
    const { popupInfo } = this.state

    return (
      popupInfo && (
        <Popup
          tipSize={5}
          anchor="top"
          longitude={popupInfo.longitude}
          latitude={popupInfo.latitude}
          closeOnClick={false}
          onClose={() => this.setState({ popupInfo: null })}
        >
          {/* <CityInfo info={popupInfo} /> */}
        </Popup>
      )
    )
  }

  render() {
    const { viewport } = this.state

    return (
      <MapGL
        {...viewport}
        width="100vw"
        height="100vh"
        mapStyle="mapbox://styles/mapbox/dark-v9"
        onViewportChange={this._updateViewport}
        mapboxApiAccessToken={TOKEN}
      >
        <Pins data={resortsList} onClick={this._onClickMarker} />

        {this._renderPopup()}

        {/* <div style={geolocateStyle}>
          <GeolocateControl />
        </div>
        <div style={fullscreenControlStyle}>
          <FullscreenControl />
        </div>
        <div style={navStyle}>
          <NavigationControl />
        </div>
        <div style={scaleControlStyle}>
          <ScaleControl />
        </div> */}

        {/* <ControlPanel containerComponent={this.props.containerComponent} /> */}
      </MapGL>
    )
  }
}
