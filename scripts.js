'use strict';

const apiKey = '7ff838bcca3c49999989611f0f247358' /*your API key here*/
const searchURL = 'https://newsapi.org/v2/everything'; //API endpoint root

// const params = {
//   q: query,
//   language: "en",
// };

function formatQueryParams(params) {
  // console.log('params:', params);
  // console.log( 'Object.keys(params)', Object.keys(params) );
  //[q,language]
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    // [q, langauge] ===> [q=nevada,langauge=en] ====> 'q=nevada&langauge=en'
    // console.log('queryItems inside formatQueryParams(): ', queryItems);

    // console.log("queryItems.join('&')", queryItems.join('&'));
  return queryItems.join('&');
}

function displayResults(responseJson, maxResults) {

  // console.log('responseJson, maxResults: ', responseJson, maxResults);

  // if there are previous results, remove them
  $('#results-list').empty();
  // iterate through the articles array, stopping at the max number of results
  for (let i = 0; i < responseJson.articles.length & i < maxResults; i++){
    // for each video object in the articles
    //array, add a list item to the results
    //list with the article title, source, author,
    //description, and image
    $('#results-list').append(
      `<li>
        <h3><a target="_blank" href="${responseJson.articles[i].url}">${responseJson.articles[i].title}</a></h3>
        <p>${responseJson.articles[i].source.name}</p>
        <p>By ${responseJson.articles[i].author}</p>
        <p>${responseJson.articles[i].description}</p>
        <img src='${responseJson.articles[i].urlToImage}'>
      </li><hr>`
    )};
  //display the results section
  $('#results').removeClass('hidden');
};

function getNews(query, maxResults=10) {

  // console.log('query, maxResults inside getNews(): ', query, maxResults);

  const params = {
    q: query,
    language: "en",
  };

  const queryString = formatQueryParams(params)
  // console.log('searchURL  :', searchURL);
  // console.log('queryString: ', queryString);
  const url = searchURL + '?' + queryString;
  // console.log('searchURL + queryString: ', url);

  const options = {
    headers: new Headers({
      "X-Api-Key": apiKey})
  };

  fetch(url, options)
    .then(response => {
      console.log('response.body', response.body);
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson, maxResults))
    .catch(err => {
      // console.log('err.message:', err.message);
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    const searchTerm = $('#js-search-term').val();
    const maxResults = $('#js-max-results').val();
    getNews(searchTerm, maxResults);
  });
}

$(watchForm);
