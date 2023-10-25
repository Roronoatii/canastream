import { useEffect, useState } from "react";
import axios from "axios";

function Api() {
  const apiKey = "2955ed558f1e71d9871ec2a96694678a";
  const seriesPerPage = 10;
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    axios
      .get(`https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}`)
      .then((response: { data: { genres: any } }) => {
        setGenres(response.data.genres);
      })
      .catch((error: any) => {
        console.error(error);
      });
  }, [apiKey]);
}
export default Api;
