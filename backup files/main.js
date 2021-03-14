
//https://openweathermap.org/current#data
//icons definitions: https://openweathermap.org/weather-conditions

//nasa api: https://api.nasa.gov/


//currency api: https://fixer./io

//geolocation api: https://ipstack.com/


function random(min, max) {
  return Math.ceil(Math.random() * (max - min) + min);
}


const start_date = {
  year: new Date().getFullYear(),
  get_month: function (month) {
    month = new Date().getMonth();
    // month <=10 ? month = '0' + month:month;
    return month;
  },
  get_day: function (day) {
    day = new Date().getDate() - 1;
    // day <=10 ? day = '0' + day:day;
    return day;
  },
  get_complete_date: function () {
    return `${start_date.year}-${start_date.get_month()}-${start_date.get_day()}`;
  }
}

const end_date = {
  year: new Date().getFullYear(),
  get_month: function (month) {
    month = new Date().getMonth() + 1;
    // month <=10 ? month = '0' + month:month;
    return month;
  },
  get_day: function (day) {
    day = new Date().getDate() - 1;
    // day <=10 ? day = '0' + day:day;
    return day;
  },
  get_complete_date: function () {
    return `${end_date.year}-${end_date.get_month()}-${end_date.get_day()}`;
  }
}



//url config
const clientIDs = {
  openWeatherID: '6b388ffb4412e133884faf3577d506b3',
  NASA_ID: 'RgzHpXUvZOjoUzHglNOzjPuMMVM9tfJjq0XPR2Aj',
  currencyConverter_ID: '8124a9e84cee22c019f6',
  geoLocation_ID: '39fd460ab49f0ed2179415f54990a5bc'
}


class objAPI {
  constructor(url) {
    this.url = url,
      this.getUrl = function () {
        fetchResource(this.url)
      }
  }
}

const today = new Date().toLocaleDateString('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit' });
// today.replace(/\//g, '-');


//obj instancies:
let NASA_API = new objAPI(`https://api.nasa.gov/planetary/apod?api_key=${clientIDs.NASA_ID}&start_date=${start_date.get_complete_date()}&end_date=${end_date.get_complete_date()}`);


let currencyConverter = new objAPI(`https://free.currconv.com/api/v7/convert?q=USD_RUB,EUR_RUB&compact=ultra&date=${today}&apiKey=${clientIDs.currencyConverter_ID}`);


let geoLocation = new objAPI(`http://api.ipstack.com/check?access_key=${clientIDs.geoLocation_ID}`);



//instancies being called:
NASA_API.getUrl();
currencyConverter.getUrl();
geoLocation.getUrl()


async function fetchResource(url) {
  await fetch(url).then((response) => {
    if (!response.ok) {
      throw new Error(response.status);
    } else {
      return response.json();
    }
  }).then((json, lat, lon) => {
    //returning JSON for Ipstack geolocation and Openweather:  
    if (url.includes('api.ipstack.com')) {
      console.log(json);
      lat = json.latitude;
      lon = json.longitude;

      let openWeather_API = new objAPI(`http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${clientIDs.openWeatherID}&mode=json&units=metric&lang=ru&cnt=5`);

      fetch(openWeather_API.url).then((new_response) => {
        return new_response.json();
      }).then((new_json) => {
        console.log(new_json)
        for (let i = 0; i < new_json.list.length - 1; i++) {
          const weather_data = document.querySelector('.weather-data');

          if (i === 0) {
            weather_data.innerHTML = `It\'s ${Number(Math.ceil(new_json.list[i].main.temp))}&deg; outside 
<br>
Feels like: ${Number(Math.ceil(new_json.list[i].main.feels_like))}&deg;C 
<br> 
Wind speed: ${new_json.list[i].wind.speed}m/s
<br>
<img src=\"http://openweathermap.org/img/wn/${new_json.list[i].weather[0].icon}@2x.png\" style="width:calc(4.5rem + 1vmin); height:calc(4.5rem + 1vmin);">
<br>
`;
          } else {

            weather_data.innerHTML +=
              `<ul style="display: inline-block; font-size: calc(0.3rem + 1vmin);">
<li style="list-style-type: none; border: 1px black dotted;">
<img src=\"http://openweathermap.org/img/wn/${new_json.list[i].weather[0].icon}@2x.png\" style="width: calc(2.5rem + 1vmin); height: calc(2.5rem + 1vmin);">
${new_json.list[i].dt_txt.slice(0, -3)}:${Number(Math.ceil(new_json.list[i].main.temp))}&degC
</li>
</ul>`;
          }
        }
      })
    }



    //returning JSON for NASA: 
    else if (url.includes('api.nasa.gov')) {
      console.log(json);

      const output = json[random(0, json.length - 1)];
      console.log(output.media_type)
      console.log(output)

      if (output.media_type === 'image') {
        console.log(output)
        const link_to_img = document.createElement('a').href = output.url;
        document.body.style.backgroundImage = `url(${link_to_img})`;
        document.body.style.backgroundPosition = 'center center';
        document.body.style.backgroundSize = 'cover';
      } else {
        let iframe = document.createElement('iframe');
        iframe.src = output.url;
        document.body.insertBefore(iframe, document.querySelector('section'))
      }
    }


    //returning JSON for currencyConverter:
    else if (url.includes('/api/v7/convert')) {
      //console.log(json);
      document.querySelector('.currency-data').innerHTML = `Today's currencies: <br> EUR/RUB: ${json.EUR_RUB[today].toFixed(2)} <br> USD/RUB: ${json.USD_RUB[today].toFixed(2)}`;
    }
  }).catch((er) => {
    console.log(`Error has occured: ${er}`);

    if (url.includes('api.nasa.gov')) {
      document.body.style.backgroundImage = 'url(./backup-imgs/merlin_165009318_4ab82ddb-3fa0-4e9f-ba21-5df74d24db16-superJumbo.jpg)';
      document.body.style.backgroundPosition = 'center center';
      document.body.style.backgroundSize = 'cover';
    }
  });
}


//https://developers.google.com/youtube/player_parameters#autoplay (line 158 - amend url
