import { Link, BlitzPage, useMutation } from "blitz"
import Layout from "app/layouts/Layout"
import logout from "app/auth/mutations/logout"
import { useCurrentUser } from "app/hooks/useCurrentUser"
import { Suspense, PureComponent } from "react"
import ReactMapGL, { Marker } from "react-map-gl"
// import Pins from '../components/pins';

import skiAreas from "resorts.json"
/*
 * This file is just for a pleasant getting started page for your new app.
 * You can delete everything in here and start from scratch if you like.
 */

let resortsList: Array<any> = []
skiAreas.map((resort: { georeferencing: any }, index) => {
  if (
    resort.hasOwnProperty("georeferencing") &&
    resort.georeferencing.hasOwnProperty("_lat") &&
    index < 1000
  ) {
    resortsList.push(resort)
  }
})

const points = resortsList.map((resort: { georeferencing: any; _id: any; name: any }) => ({
  type: "Feature",
  name: resort.name,
  properties: { cluster: false, resortId: resort._id },
  geometry: {
    type: "Point",
    coordinates: [parseFloat(resort.georeferencing._lng), parseFloat(resort.georeferencing._lat)],
  },
}))

class Markers extends PureComponent<{ data: Array<any> }> {
  render() {
    const { data } = this.props
    console.log(data)
    return data.map((resort: { properties: any; geometry: any }) => {
      return (
        <Marker
          key={`  resort-${resort.properties.resortId}`}
          latitude={resort.geometry.coordinates[1]}
          longitude={resort.geometry.coordinates[0]}
        >
          <img src="location-pin.png" width="16" height="16" alt="crime doesn't pay" />
        </Marker>
      )
    })
  }
}
class Pins extends PureComponent<{ data: Array<any> }> {
  render() {
    const { data } = this.props

    return data.map((city: { properties: any; geometry: any; georeferencing: any }, index) => {
      return (
        <Marker
          key={`marker-${index}`}
          longitude={parseFloat(city.georeferencing._lng)}
          latitude={parseFloat(city.georeferencing._lat)}
        >
          {/* <svg
          height={SIZE}
          viewBox="0 0 24 24"
          style={{
            cursor: 'pointer',
            fill: '#d00',
            stroke: 'none',
            transform: `translate(${-SIZE / 2}px,${-SIZE}px)`
          }}
          onClick={() => onClick(city)}
        >
          <path d={ICON} />
        </svg> */}
          <img src="location-pin.png" width="16" height="16" alt="crime doesn't pay" />
        </Marker>
      )
    })
  }
}

class MapboxMap extends PureComponent {
  state = {
    viewport: {
      latitude: 37.78,
      longitude: -122.41,
      zoom: 8,
      width: "70vw",
      height: "50vw",
    },
  }

  render() {
    return (
      <div className="bg-black  object-center">
        <ReactMapGL
          {...this.state.viewport}
          onViewportChange={(viewport) => this.setState({ viewport })}
          mapboxApiAccessToken={
            "pk.eyJ1Ijoib2xpdmllcm10bCIsImEiOiJja2c2a3NlcjYxNWE5MnFvNXd3YWExaG13In0.n55Tr-IjbzoUZn0eNIk1iw"
          }
          mapStyle="mapbox://styles/mapbox/streets-v11"
        >
          <div className="box-border h-20 w-64 p-4 border-4 border-gray-400 bg-gray-200 ">
            <div className="h-full w-full bg-gray-400">
              {" "}
              <h1 className="text-purple-500">Hello</h1>
            </div>
          </div>
          {/* <Markers data={points} /> */}
          <Pins data={resortsList} />
        </ReactMapGL>
      </div>
    )
  }
}

const UserInfo = () => {
  const currentUser = useCurrentUser()
  const [logoutMutation] = useMutation(logout)

  if (currentUser) {
    return (
      <>
        <button
          className="button small"
          onClick={async () => {
            await logoutMutation()
          }}
        >
          Logout
        </button>
        <div>
          User id: <code>{currentUser.id}</code>
          <br />
          User role: <code>{currentUser.role}</code>
        </div>
      </>
    )
  } else {
    return (
      <>
        <Link href="/signup">
          <a className="button small">
            <strong>Sign Up</strong>
          </a>
        </Link>
        <Link href="/login">
          <a className="button small">
            <strong>Login</strong>
          </a>
        </Link>
      </>
    )
  }
}

const Home: BlitzPage = () => {
  return (
    <div className="container">
      <main>
        <div className="logo">
          <img src="/logo.png" alt="blitz.js" />
        </div>
        <p>
          <strong>Congrats!</strong> Your app is ready, including user sign-up and log-in.
        </p>
        <div className="buttons" style={{ marginTop: "1rem", marginBottom: "1rem" }}>
          <Suspense fallback="Loading...">
            <UserInfo />
          </Suspense>
        </div>
        <Suspense fallback="Loading Map...">
          <MapboxMap />
        </Suspense>
        <p>
          <strong>
            To add a new model to your app, <br />
            run the following in your terminal:
          </strong>
        </p>
        <pre>
          <code>blitz generate all project name:string</code>
        </pre>
        <pre>
          <code>blitz db migrate</code>
        </pre>
        <div>
          <p>
            Then <strong>restart the server</strong>
          </p>
          <pre>
            <code>Ctrl + c</code>
          </pre>
          <pre>
            <code>blitz start</code>
          </pre>
          <p>
            and go to{" "}
            <Link href="/projects">
              <a>/projects</a>
            </Link>
          </p>
        </div>
        <div className="buttons" style={{ marginTop: "5rem" }}>
          <a
            className="button"
            href="https://blitzjs.com/docs/getting-started?utm_source=blitz-new&utm_medium=app-template&utm_campaign=blitz-new"
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentation
          </a>
          <a
            className="button-outline"
            href="https://github.com/blitz-js/blitz"
            target="_blank"
            rel="noopener noreferrer"
          >
            Github Repo
          </a>
          <a
            className="button-outline"
            href="https://slack.blitzjs.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Slack Community
          </a>
        </div>
      </main>

      <footer>
        <a
          href="https://blitzjs.com?utm_source=blitz-new&utm_medium=app-template&utm_campaign=blitz-new"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by Blitz.js
        </a>
      </footer>

      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Libre+Franklin:wght@300;700&display=swap");

        html,
        body {
          padding: 0;
          margin: 0;
          font-family: "Libre Franklin", -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
            Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
        }

        * {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          box-sizing: border-box;
        }
        .container {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        main p {
          font-size: 1.2rem;
        }

        p {
          text-align: center;
        }

        footer {
          width: 100%;
          height: 60px;
          border-top: 1px solid #eaeaea;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: #45009d;
        }

        footer a {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        footer a {
          color: #f4f4f4;
          text-decoration: none;
        }

        .logo {
          margin-bottom: 2rem;
        }

        .logo img {
          width: 300px;
        }

        .buttons {
          display: grid;
          grid-auto-flow: column;
          grid-gap: 0.5rem;
        }
        .button {
          font-size: 1rem;
          background-color: #6700eb;
          padding: 1rem 2rem;
          color: #f4f4f4;
          text-align: center;
        }

        .button.small {
          padding: 0.5rem 1rem;
        }

        .button:hover {
          background-color: #45009d;
        }

        .button-outline {
          border: 2px solid #6700eb;
          padding: 1rem 2rem;
          color: #6700eb;
          text-align: center;
        }

        .button-outline:hover {
          border-color: #45009d;
          color: #45009d;
        }

        pre {
          background: #fafafa;
          border-radius: 5px;
          padding: 0.75rem;
          text-align: center;
        }
        code {
          font-size: 0.9rem;
          font-family: Menlo, Monaco, Lucida Console, Liberation Mono, DejaVu Sans Mono,
            Bitstream Vera Sans Mono, Courier New, monospace;
        }

        .grid {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;

          max-width: 800px;
          margin-top: 3rem;
        }

        @media (max-width: 600px) {
          .grid {
            width: 100%;
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  )
}

Home.getLayout = (page) => <Layout title="Home">{page}</Layout>

export default Home
