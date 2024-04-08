import { useEffect, useState } from 'react'
import PropTypes from "prop-types";
import './App.css'

import clearSun from "./assets/img/clearSun.jpeg/";
import cloud from "./assets/img/cloud.jpeg";
import drizzle from "./assets/img/drizzle.jpeg";
import humidityIcon from "./assets/img/humidityIcon.png";
import rain from "./assets/img/rain.png";
import snow from "./assets/img/snow.jpg";
import windIcon from "./assets/img/windIcon.jpeg";

const WeatherDetails =({icon,temp,city,country,lat,long,humidity,wind})=> {
  return (
    <>
  <div className="image">
    <img src={icon} alt="Image"/>  
    
  </div>
  <div className="temp"> {temp}°C</div>
  <div className="location"> {city}</div>
  <div className="country"> {country}</div>
  <div className="cord">
    <div>
    <span className="lat"> latitude </span>
    <span> {lat} </span>
    </div>
    <div>
    <span className="long"> longitude </span>
    <span> {long} </span>
    </div>   
  </div>
  <div className="data-container">
  <div className="element">
    <img src={humidityIcon} alt="humidity" className="icon" width="25%"/>
    <div className="data">
      <div className="humidity-percent"> {humidity}% </div>
      <div className="text"> Humidity </div>
    </div>
    </div>
    <div className="element">
    <img src={windIcon} alt="wind" className="icon" width="25%" />
    <div className="data">
      <div className="wind-percent"> {wind} km/h </div>
      <div className="text"> Wind Speed </div>    
  </div>
  </div>
  </div>
  </>

  )
}

WeatherDetails.propTypes = {
  icon : PropTypes.string.isRequired,
  temp : PropTypes.number.isRequired,
  city : PropTypes.string.isRequired,
  country : PropTypes.string.isRequired,
  humidity : PropTypes.number.isRequired,
  wind : PropTypes.number.isRequired,
  lat : PropTypes.number.isRequired,
  long : PropTypes.number.isRequired,

}

function App() {
  
  let api_key="1841232786e6d098cdfa89afb1f578be";
  const [text,setText]=useState("Chennai");

  const [icon,setIcon]=useState(clearSun);
  const [temp,setTemp]=useState(0);
  const [city,setCity]=useState("Chennai");
  const [country,setCountry]=useState("IN");
  const [lat,setLat]=useState(0);
  const [long,setLong]=useState(0);
  const[humidity,setHumidity]=useState(0);
  const[wind,setWind]=useState(0);

  const [cityNotFound,setCityNotFound]=useState(false);
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState(null);

  const weatherIconMap = {
    "01d" : clearSun,
    "01n" : clearSun,
    "02d" : cloud,
    "02n" : cloud,
    "03d" : drizzle,
    "03n" : drizzle,
    "04d" : drizzle,
    "04n" : drizzle,
    "09d" : rain,
    "09n" : rain,
    "010d" : rain,
    "010n" : rain,
    "013d" : snow,
    "013n" : snow,
  }

  const search = async()=> {
    setLoading(true);

    let url=`https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${api_key}&units=Metric`;

  try {
    let res = await fetch(url);
    let data = await res.json();
    // console.log(data);
    if (data.cod === "404"){
      console.log("City Not Found");
      setCityNotFound(true);
      setLoading(false);
      return;
    }
    setHumidity(data.main.humidity);
    setWind(data.wind.speed);
    setTemp(Math.floor(data.main.temp));
    setCity(data.name);
    setCountry(data.sys.country);
    setLat(data.coord.lat);
    setLong(data.coord.lon);
    const weatherIconCode = data.weather[0].icon;
    setIcon(weatherIconMap[weatherIconCode] || clearSun);
    setCityNotFound(false);

  }catch(error){
    console.error("An error occurred",error.message);
    setError("An error occurred while fetching weather data.");
  }finally{  
  setLoading(false);
    
  }
};
 
  const handleCity = (e) =>{
    setText(e.target.value);
  };

  const handlekeyDown = (e) => {
    if (e.key === "Enter"){
      search();
    }
  }

  useEffect(function () {
    search();
  },[]);

  return (
    <>
      <div className="container">
        <div className="input-Container">
          <input type="text" className="cityInput" placeholder="Search City" onChange={handleCity} value={text} onKeyDown={handlekeyDown}/>      
          <div className="searchIcon" onClick={()=>search()} >
          <i className="fas fa-search"></i>          
          </div>          
        </div>
        {!loading && !cityNotFound && <WeatherDetails icon={icon} temp={temp} city={city} country={country} lat={lat} long={long} humidity={humidity} wind={wind} />}

        {loading && <div className="loading-message"> Loading... </div>}

        {error && <div className="error-message"> {error} </div>}

        {cityNotFound && <div className="city-not-found"> City not found </div>}

        <p className="copyright">
          Designed by <span >𝘿𝙆 𝙅𝘼𝙂 </span>
        </p>
      
      </div>
      
    </>
  )
}

export default App
