import React, {FC, useEffect, useState} from "react";
import {Weather, WeatherLocation} from "./weather";
import {readForecastDay, readForecastFourDays, readWeather} from "../services/weatherService";
import "../scss/weather-summary.scss"
import ScrollContainer from "react-indiana-drag-scroll";
import {WeatherEntity} from "./WeatherEntity";

interface WeatherSummaryProps {
    location: WeatherLocation | null;
}

export const WeatherSummary: FC<WeatherSummaryProps> = ({location}) => {
    const [weather, setWeather] = useState<Weather | null>(null);
    const [forecastDay, setForecastDay] = useState<Weather[] | null>(null);
    const [forecastFourDays, setForecastFourDays] = useState<Weather[] | null>(null);
    function iconNameToColor(iconName:String) : string{
        switch (iconName) {
            case "01d":
                return "linear-gradient(180deg, rgba(124, 235, 198,1) 0%, rgba(186, 169, 215,1) 100%) no-repeat fixed"
            case  "02d":
                return "linear-gradient(180deg, rgba(159, 209, 241,1) 0%, rgba(159, 154, 164,1) 100%) no-repeat fixed"
            case  "03d":
                return "linear-gradient(180deg, rgba(159, 209, 241,1) 0%, rgba(159, 154, 164,1) 100%) no-repeat fixed"
            case  "04d":
                return "linear-gradient(180deg, rgba(159, 209, 241,1) 0%, rgba(159, 154, 164,1) 100%) no-repeat fixed"
            case  "09d":
                return "linear-gradient(180deg, rgba(136,130,253,1) 0%, rgba(186, 169, 215,1) 100%) no-repeat fixed"
            case  "10d":
                return "linear-gradient(180deg, rgba(207, 216, 215,1) 0%, rgba(186, 169, 215,1) 100%) no-repeat fixed"
            case  "11d":
                return "linear-gradient(180deg, rgba(75,79,161,1) 0%, rgba(186, 169, 215,1) 100%) no-repeat fixed"
            case  "13d":
                return "linear-gradient(180deg, rgba(195,225,246,1) 0%, rgba(186, 169, 215,1) 100%) no-repeat fixed"
            case  "50d":
                return "linear-gradient(180deg, rgba(96,127,143,1) 0%, rgba(186, 169, 215,1) 100%) no-repeat fixed"
            default: return "linear-gradient(180deg, rgba(92, 139, 214  ,1) 0%, rgba(17, 19, 68,1) 100%) no-repeat fixed";
        }



    }
    useEffect(() => {
        (async function () {
            if (location) {
                const [currentWeather, forecastDay, forecastFourDays] = await Promise.all([
                    readWeather(location.id),
                    readForecastDay(location.coord.lat, location.coord.lon),
                    readForecastFourDays(location.coord.lat, location.coord.lon)
                ]);
                setWeather(currentWeather);
                setForecastDay(forecastDay);
                setForecastFourDays(forecastFourDays);
                console.log(currentWeather)
                // @ts-ignore
                document.body.style.background = iconNameToColor(currentWeather.weather[0].icon)

            }
        })();

    }, [location]);

    if (!location || !weather || !forecastDay || !forecastFourDays) return null;

    return (
            <div className={'weather-summary'}>
                <h2 className={'current-city'}>{location.name}</h2>
                <WeatherEntity weather={weather} current={true}/>
                <h2 className={'sub-header'}>Forecast for the day</h2>

                <ScrollContainer className="scroll-container forecast-group-wrapper"
                                 horizontal={true}
                                 hideScrollbars={false}>
                    <ul className="forecast-group-hourly">
                        {forecastDay.map(it =>
                            <WeatherEntity weather={it} key={it.dt} current={false}/>
                        )}
                    </ul>
                </ScrollContainer>
                <h2 className={'sub-header'}>Forecast for the week</h2>

                <ScrollContainer className="scroll-container forecast-group-wrapper"
                                 horizontal={true}
                                 hideScrollbars={false}>
                    <ul className="forecast-group-week">
                        {forecastFourDays.map(it =>
                            <WeatherEntity weather={it} key={it.dt} current={false}/>
                        )}
                    </ul>
                </ScrollContainer>
            </div>
    );
}