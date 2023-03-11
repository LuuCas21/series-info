'use script';

const movieImage = document.querySelector('#movie__image');
const movieTitle = document.querySelector('#movie__title');
const movieRating = document.querySelector('#movie__rating');
const movieOverview_ = document.querySelector('#movie__overview');
const movieCast_1 = document.querySelector('#movie__cast_1');
const movieCast_2 = document.querySelector('#movie__cast_2');
const movieCast_3 = document.querySelector('#movie__cast_3');
const movieReleaseDate = document.querySelector('#movie__release_date');
const movieGenreDiv = document.querySelector('.movie__genre_div');

const image_path = 'https://image.tmdb.org/t/p/w1280';

const getGenre = function(genre_data) {

    genre_data.forEach(genres => {
        const genre_span = document.createElement('span');
        genre_span.setAttribute('class', 'movie__genre');

        (genres === 10765) ? genre_span.innerHTML = 'Fantasy' : false;
        (genres === 10751) ? genre_span.innerHTML = 'Family' : false;
        (genres === 9648) ? genre_span.innerHTML = 'Mystery' : false;
        (genres === 35) ? genre_span.innerHTML = 'Comedy' : false;
        (genres === 18) ? genre_span.innerHTML = 'Drama' : false;
        (genres === 80) ? genre_span.innerHTML = 'Crime' : false;
        (genres === 10759) ? genre_span.innerHTML = 'Action' : false;
        (genres === 16) ? genre_span.innerHTML = 'Animation' : false;
        (genres === 99) ? genre_span.innerHTML = 'Documentary' : false;
        (genres === 10762) ? genre_span.innerHTML = 'Kids' : false;
        (genres === 10763) ? genre_span.innerHTML = 'News' : false;
        (genres === 10764) ? genre_span.innerHTML = 'Reality' : false;
        (genres === 10766) ? genre_span.innerHTML = 'Soap' : false;
        (genres === 10767) ? genre_span.innerHTML = 'Talk' : false;
        (genres === 10768) ? genre_span.innerHTML = 'War' : false;

        movieGenreDiv.insertAdjacentElement('beforeend', genre_span);

    });
};

const getMovieInfos = function(moviePoster, movieName, movieVoteAverage, movieOverview, movieDay, movieMonth, movieYear) {
        movieImage.src = '';
        movieTitle.innerHTML = '';
        movieRating.innerHTML = '';
        movieReleaseDate.innerHTML = '';

        movieImage.src = image_path + moviePoster;
        movieTitle.innerHTML = movieName;
        movieRating.innerHTML = movieVoteAverage.toFixed(1);
        (movieOverview === "") ? movieOverview_.innerHTML = 'Any overview available' : movieOverview_.innerHTML = movieOverview;
        movieReleaseDate.innerHTML = `${movieDay}/${movieMonth}/${movieYear}`;
};

const getSeriesData = function() {

};

document.querySelector('form').addEventListener('submit', (e) => {
    e.preventDefault();

    const input__movie = document.querySelector('#movie__input');

    if (input__movie.value === '') {
        document.querySelector('.error_message').classList.remove('show');
        document.querySelector('.movie_info_div').classList.add('show');
    } else {
        document.querySelector('.error_message').classList.add('show');
    };

    const movie_app = async function (name) {
        const api = `API_KEY`;
        //const genreApi = 'API_KEY';

        const genreSpan = document.querySelectorAll('.movie__genre');

        genreSpan.forEach(spans => {
            movieGenreDiv.removeChild(spans);
        });
        
        movieCast_1.innerHTML = '';
        movieCast_2.innerHTML = '';
        movieCast_3.innerHTML = '';

        try {
        const movie_data = await fetch(api);
        const data = await movie_data.json();

        const id = data.results[0].id;

        const castApi = `https://api.themoviedb.org/3/tv/${id}/credits?api_key=567e52ced6a5253475c2fa22a532126d&language=en-US`;

        const dataCast = await fetch(castApi);
        const cast = await dataCast.json();

        if (movie_data) document.querySelector('.movie_info_div').classList.remove('show');

        const date = new Date(data.results[0].first_air_date);
        let day = date.getDate() + 1;
        let month = date.getMonth() + 1;
        let year = date.getFullYear();

        if (day < 10) day = '0' + day;
        if (month < 10) month = '0' + month;

        const infos = {
            movieImage: data.results[0].poster_path,
            movieName: data.results[0].name,
            movieVoteAverage: data.results[0].vote_average,
            movieOverview: data.results[0].overview,
            movieDay: day,
            movieMonth: month,
            movieYear: year,
        };

        if (cast.cast.length >= 3) {
            movieCast_1.innerHTML = cast.cast[0].name + ', ';
            movieCast_2.innerHTML = cast.cast[1].name + ', ';
            (cast.cast.length > 3) ? movieCast_3.innerHTML = `${cast.cast[2].name}` + '...' : movieCast_3.innerHTML = cast.cast[2].name;
        } else if (cast.cast.length >= 2) {
            movieCast_1.innerHTML = cast.cast[0].name + ', ';
            movieCast_2.innerHTML = cast.cast[1].name;
        } else if (cast.cast.length === 0) 
            movieCast_1.innerHTML = 'Any cast available';

        const { movieImage, movieName, movieVoteAverage, movieOverview, movieDay, movieMonth, movieYear } = infos;

        getMovieInfos(movieImage, movieName, movieVoteAverage, movieOverview, movieDay, movieMonth, movieYear);

        getGenre(data.results[0].genre_ids);

        console.log(data.results[0]);

        } catch(err) {
            console.error(err);

            if (err) {
                document.querySelector('.movie_info_div').classList.add('show');
                document.querySelector('.error_message').classList.remove('show');
            }
        };
    };

    movie_app(input__movie.value);
    input__movie.value = '';
});
