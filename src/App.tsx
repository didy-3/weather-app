import React, {useEffect, useState} from 'react';
import './App.scss';
import {LocationSearch} from "./components/LocationSearch";
import {getLocalCity, getLocalCityIfLocationIsNotAllowed, searchLocation} from "./services/weatherService";
import {WeatherLocation} from "./components/weather";
import {WeatherSummary} from "./components/WeatherSummary";
import Footer from "./components/Footer";


function App() {
    const [currentLocation, setCurrentLocation] = useState<WeatherLocation | null>(null);
    const [error, setError] = useState('');

    const resetAlert = () => {
        setError('');
    }
    const addLocation = async (town: string) => {
        resetAlert();
        const location = await searchLocation(town);
        if (!location) {
            setError(`No location found called '${town}'`);
        } else {
            setCurrentLocation(location);
        }
    };

    function setLocalAddress() {
        navigator.geolocation.watchPosition(async function (position) {
                const location = await getLocalCity(position.coords.latitude, position.coords.longitude)
                setCurrentLocation(location)

            },
            async function (position) {
                const location = await getLocalCityIfLocationIsNotAllowed()
                await  addLocation(location)

            });
    }


    // load local city
    useEffect(() => {
        setLocalAddress()

    }, [])

    return (
        <div className="App">
            <LocationSearch onSearch={addLocation}/>
            {error && <div role={'alert'}>{error}</div>}
            <WeatherSummary location={currentLocation}/>
            <Footer/>
        </div>
    );
}

export default App;
