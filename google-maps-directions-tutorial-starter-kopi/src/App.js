import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  HStack,
  IconButton,
  Input,
  SkeletonText,
  Text,
  Image
} from '@chakra-ui/react'
import { FaLocationArrow, FaTimes } from 'react-icons/fa'

import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  Autocomplete,
  DirectionsRenderer,
} from '@react-google-maps/api'
import { useRef, useState } from 'react'
import Geocode from "react-geocode"

import logo from './runnn.png'
import logo2 from './run2.png'
import logo3 from './run3.png'
import logo4 from './run4.png'
import logo5 from './run5.png'

let center = {lat: 55.69941250499677, lng: 12.588798916075621}

Geocode.setApiKey("AIzaSyDRGKx5KEMfI8PcUOrZeVkb2yjeuGadaIk");

Geocode.setLanguage("en");

      //ide: tjek distance i alle retninger (punkter nede til venstre, punkter oppe til venstre, punkter nede til højre, punkter oppe til højre) og vælg den som er tættest på indtastet distance

// var directionsDisplay;
// var directionsService = new DirectionsService();
// directionsService.route();

// const directionsService2 = new google.maps.DirectionsService();
// directionsService2.route();
// directionsService2.route(
//   {
//           origin: {center},
//           destination: {geo2},
//           travelMode: "WALKING"
//   },
//   (response, status) => {
//    console.log(response);
//    console.log(status);
//   }
// )



function App() {

  // const [distance, setDistance] = useState(0);
  // const [duration, setDuration] = useState(0);

  // useEffect(() => {
  //   if (distance && duration) {
  //     console.log("Distance & Duration have updated", distance, duration);
  //   }
  // }, [distance, duration]);

  // //const onLoad = React.useCallback(function callback(map) {
  //   // Get directions
  //   const google = window.google;
  //   const directionsService = new google.maps.DirectionsService();

  //   directionsService.route(
  //     {
  //       origin: {center},
  //       destination: {geo2},
  //       travelMode: google.maps.TravelMode.WALKING,
  //     },
  //     (result, status) => {
  //       if (status === google.maps.DirectionsStatus.OK) {
  //         setDistance(result.routes[0].legs[0].distance.value);
  //         setDuration(result.routes[0].legs[0].duration.value);
  //       } else {
  //         console.error("error fetching directions", result, status);
  //       }
  //     }
  //   );
  //}, []);

  //_________

  const {isLoaded} = useJsApiLoader({
    // googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    googleMapsApiKey: 'AIzaSyDRGKx5KEMfI8PcUOrZeVkb2yjeuGadaIk',
    libraries: ['places'],
  })

  const [map, setMap] = useState(/** @type google.maps.Map */ (null))
  const [directionsResponse, setDirectionsResponse] = useState(null)
  const [distance, setDistance] = useState('')
  const [duration, setDuration] = useState('')

  /** @type React.MutableRefObject<HTMLInputElement> */
  const originRef = useRef()
  /** @type React.MutableRefObject<HTMLInputElement> */
  const destiantionRef = useRef()

  /** @type React.MutableRefObject<HTMLInputElement> */
  const distanceRef = useRef()

  //const [markers, setMarkers] = useState([markers])

  // onClick(t, map, coord) {
  //   const { latLng } = coord;
  //   const lat = latLng.lat();
  //   const lng = latLng.lng();

  //   setMarkers(previousState => {
  //     return {
  //       markers: [
  //         ...previousState.markers,
  //         {
  //           title: "",
  //           name: "",
  //           position: { lat, lng }
  //         }
  //       ]
  //     };
  //   });
  // }

  
  if (!isLoaded) {
    return <SkeletonText />
  }

  function newLat(lat1, dy) {
    var newlat = Number(lat1 + (dy / 6371.01) * (180 / Math.PI));
    return newlat;
  }
  
  function newLon(lat1, lon1, dx) {
    var newlon = Number(lon1 + (dx / 6371.01) * (180 / Math.PI) / Math.cos(lat1 * Math.PI/180));
    return newlon;
  }

  function newCenter() {
    Geocode.fromAddress(originRef.current.value).then(
      (response) => {
        const { lat, lng } = response.results[0].geometry.location;
        console.log("lat lng: " + lat + ", " + lng);
        // center2.lat = lat
        // center2.lng = lng
        let center2 = {lat: lat, lng: lng}
        center = center2
        console.log("done")
        //console.log("new center: " + center.lat.toString + ", " + center.lng.toString)
      },
      (error) => {
        console.error(error);
      }
    )
  }

  async function calculateRoute() {
    //if (originRef.current.value === '' || destiantionRef.current.value === '') {
    if (originRef.current.value === '' || distanceRef.current.value === '') {
      return
    }

        // const waypts = [];
        // waypts.push({location: geo2, stopover: false});
        // waypts.push({location: geo3, stopover: false});
        // waypts.push({location: geo4, stopover: false});

    const coordinates = [];

    //center = originRef.current.value //??
    // Get latitude & longitude from address.

    // Geocode.fromAddress("Eiffel Tower").then(
    //   (response) => {
    //     const { lat, lng } = response.results[0].geometry.location;
    //     console.log("lat lng: " + lat + ", " + lng);
    //     // center2.lat = lat
    //     // center2.lng = lng
    //     let center2 = {lat: lat, lng: lng}
    //     center = center2
    //     console.log("done")
    //     //console.log("new center: " + center.lat.toString + ", " + center.lng.toString)
    //   },
    //   (error) => {
    //     console.error(error);
    //   }
    // );
    await newCenter();
    await new Promise(resolve => setTimeout(resolve, 3000)); // 3 sec

    console.log("origin: " + originRef.current.value)
    //console.log("latlng: " + latlng)

    var adjustedDistance = -1*((distanceRef.current.value/4)-0.25);
    console.log("Distance ref distance: " + distanceRef.current.value)
    console.log("Adjusted distance: " + adjustedDistance)

    coordinates.push({location: center, stopover: false})
    console.log("center.lat: " + center.lat)
    console.log("center.lng: " + center.lng)

    const lat1 = newLat(center.lat, adjustedDistance)
    console.log("newlat: " + lat1)
    const loc1 = {lat: lat1, lng: center.lng}
    coordinates.push({location: loc1, stopover: false})
    //waypts.push({location: loc1, stopover: false})
    
    const lat2 = newLat(center.lat, adjustedDistance)
    const lon2 = newLon(center.lat, center.lng, adjustedDistance)
    console.log("newlon: " + lon2)
    const loc2 = {lat: lat2, lng: lon2}
    coordinates.push({location: loc2, stopover: false})
    
    const lon3 = newLon(center.lat, center.lng, adjustedDistance)
    const loc3 = {lat: center.lat, lng: lon3}
    coordinates.push({location: loc3, stopover: false})

    coordinates.forEach(element => {
      console.log("coordinate: " + element.location)
    });

    // eslint-disable-next-line no-undef
    const directionsService = new google.maps.DirectionsService()

    const results = await directionsService.route({
      origin: originRef.current.value,
      //destination: destiantionRef.current.value,
      destination: originRef.current.value,
      waypoints: coordinates,
      // waypoints: coordinates,
      // eslint-disable-next-line no-undef
      travelMode: google.maps.TravelMode.WALKING,
    })
    setDirectionsResponse(results)
    setDistance(results.routes[0].legs[0].distance.text)
    setDuration(results.routes[0].legs[0].duration.text)
  }

  function clearRoute() {
    setDirectionsResponse(null)
    setDistance('')
    setDuration('')
    originRef.current.value = ''
    destiantionRef.current.value = ''
    distanceRef.current.value = ''
  }

  // directionsService2.route(
  //   {
  //           origin: {center},
  //           destination: {geo2},
  //           travelMode: "WALKING"
  //   },
  //   (response, status) => {
  //    console.log(response);
  //    console.log(status);
  //   }
  // )

  // return (

  //   // //____
  //   <Flex
  //     position='relative'
  //     flexDirection='column'
  //     alignItems='center'
  //     h='100vh'
  //     w='100vw'
  //   >
  //     <Box position='absolute' left={0} top={0} h='100%' w='100%'>
  //       <GoogleMap 
  //         center={center} 
  //         zoom={15} 
  //         mapContainerStyle={{width: '100%', height: '100%'}} 
  //         options={{fullscreenControl: false}}
  //         onLoad={map => setMap(map)}
  //         >
  //         <Marker position={center} />
  //         {directionsResponse && <DirectionsRenderer directions={directionsResponse}/>}
  //         <Marker position={geo2}/>
  //         <Marker position={geo3}/>
  //         <Marker position={geo4}/>
  //       </GoogleMap>
  //     </Box>

  //     <Box
  //       p={2}
  //       borderRadius='lg'
  //       mt={2}
  //       bgColor='white'
  //       shadow='base'
  //       minW='container.md'
  //       zIndex='modal'
  //     >
  //       <HStack spacing={4}>
  //         <Input type='text' placeholder='Start' ref={originRef}/>
  //         <Input type='text' placeholder='Slut' ref={destiantionRef}/>
  //         <ButtonGroup>
  //           <Button colorScheme='green' type='submit' onClick={calculateRoute}>
  //             Beregn rute
  //           </Button>
  //           <IconButton
  //             aria-label='center back'
  //             icon={<FaTimes />}
  //             onClick={() => alert(123)}
  //           />
  //         </ButtonGroup>
  //       </HStack>
  //       <HStack spacing={4} mt={4} justifyContent='space-between'>
  //         <Text>Distance: </Text>
  //         <Text>Tid: </Text>
  //         <IconButton
  //           aria-label='center back'
  //           icon={<FaLocationArrow />}
  //           isRound
  //           onClick={() => map.panTo(center)}
  //         />
  //       </HStack>
  //     </Box>
  //   </Flex>
  // )

  return (
    <Flex
      position='relative'
      flexDirection='column'
      alignItems='flex-start'
      h='100vh'
      w='100vw'
      justifyContent='center'
    >
      <Box position='absolute' left={0} top={0} h='100%' w='100%'>
        {/* Google Map Box */}
        <GoogleMap
          center={center}
          zoom={15}
          mapContainerStyle={{ width: '100%', height: '100%' }}
          options={{
            zoomControl: false,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
          }}
          onLoad={map => setMap(map)}
        >
          <Marker position={center} title={'Hjem'} style={{
            backgroundColor: "#0000ff",
            fillColor: "#0000ff",
            strokeColor: "0000ff",
          }}/>
          {directionsResponse && (
            <DirectionsRenderer directions={directionsResponse} />
          )}
          {/* <Marker position={geo2}/>
          <Marker position={geo3}/>
          <Marker position={geo4}/> */}
        </GoogleMap>
      </Box>
      {/* <Text marginLeft={7} paddingLeft={3} paddingBottom={3} zIndex='1' fontSize={30} fontFamily={'avenir'} fontWeight={'bold'}>RunPlanner</Text> */}
      {/* <Image src={logo} alt="Logo" zIndex='1'></Image> */}
      {/* <img src={logo} alt="Logo" /> */}
      <Box
        p={3}
        borderRadius='lg'
        marginLeft={8}
        bgColor='white'
        shadow='base'
        minW={10}
        zIndex='1'
      >
        <Image src={logo5} alt="Logo" zIndex='1' width={150} marginBottom={5} marginLeft={10} marginTop={4}></Image>

        {/* <HStack spacing={1} justifyContent='space-between'> */}
          <Box flexGrow={1}>
            <Autocomplete>
              <Input type='text' placeholder='Start' w={230} ref={originRef} />
            </Autocomplete>
          </Box>
        <HStack spacing={1} justifyContent='space-between' paddingTop={3}>
          {/* <Box flexGrow={1}>
            <Autocomplete>
            <Input
            type='text'
            placeholder='Destination'
            ref={destiantionRef}
            />
            </Autocomplete>
          </Box> */}
          <Box flexGrow={1}>
              <Input type='text' placeholder='Distance' w={180} ref={distanceRef} />
          </Box>
          <IconButton
              aria-label='center back'
              icon={<FaTimes />}
              onClick={clearRoute}
            />
        </HStack>

        <HStack spacing={1} justifyContent='space-between' paddingTop={3}>
          <ButtonGroup>
            <Button colorScheme='purple' type='submit' w={180} onClick={calculateRoute}>
              Calculate Route
            </Button>
            {/* <IconButton
              aria-label='center back'
              icon={<FaTimes />}
              onClick={clearRoute}
            /> */}
          </ButtonGroup>
          <IconButton
            aria-label='center back'
            icon={<FaLocationArrow />}
            isRound
            onClick={() => {
              map.panTo(center)
              map.setZoom(15)
            }}
          />
        </HStack>
        {/* </HStack> */}
        {/* <HStack spacing={4} mt={4} justifyContent='space-between'> */}
          <Text paddingTop={3}>Distance: {distance} </Text>
          <Text paddingTop={3}>Duration: {duration} </Text>
        {/* </HStack> */}
      </Box>
    </Flex>
  )
}

export default App
