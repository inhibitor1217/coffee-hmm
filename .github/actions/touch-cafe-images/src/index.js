import core from '@actions/core';
import nodeFetch from 'node-fetch';
import pThrottle from 'p-throttle';
import qs from 'qs';

const withParam = (url, query) => `${url}?${qs.stringify(query)}`;

const throttle = pThrottle({ limit: 4, interval: 1000 });
const fetch = (url, ...rest) => {
  console.log(`Fetching from ${url} ...`);
  return throttle(nodeFetch)(url, ...rest);
}

const COFFEE_HMM_API_BASE_URL = 'https://release.api.coffee-hmm.inhibitor.io';
const PLACE_LIST = () => `${COFFEE_HMM_API_BASE_URL}/place/list`;
const CAFE_LIST = () => `${COFFEE_HMM_API_BASE_URL}/cafe/list`;

const CLOUDFRONT_RESOURCE_BASE_URL = 'https://resource.coffeehmm.com';
const toCloudfrontUrl = (url) =>
  url
    .replace(/(http:\/\/|https:\/\/)/g, '')
    .split('/')
    .map((r, i) => i > 0 ? r : CLOUDFRONT_RESOURCE_BASE_URL)
    .join('/');

const isSuccess = (response) => response.ok
const isHit = (response) => response.headers.get('x-cache').toLowerCase().includes('hit')

const CAFE_LIMIT = 64;
const CAFE_IMAGE_DIMENSION = '720x720';

const mergeStat = (left, right) => ({
  touched: (left.touched ?? 0) + (right.touched ?? 0),
  hit: (left.hit ?? 0) + (right.hit ?? 0),
  miss: (left.miss ?? 0) + (right.miss ?? 0),
  failed: (left.failed ?? 0) + (right.failed ?? 0),
  failedImageResources: [...(left.failedImageResources ?? []), ...(right.failedImageResources ?? [])],
})

const emptyStat = () => ({
  touched: 0,
  hit: 0,
  miss: 0,
  failed: 0,
  failedImageResources: [],
})

const mergeStats = (stats) => stats.reduce(mergeStat, emptyStat())

const statOf = (response) => {
  if (isSuccess(response)) {
    if (isHit(response)) { return { touched: 1, hit: 1 } }
    else { return { touched: 1, miss: 1 } }
  }
  return { failed: 1, failedImageResources: [uri] }
}

async function touchCafeImagesInPlace(place) {
  console.log(`Fetching cafes from ${place.name} ...`);

  const {
    cafe: {
      list: cafes,
    },
  } = await fetch(withParam(CAFE_LIST(), { limit: CAFE_LIMIT, placeId: place.id }))
    .then(response => response.json());
  
  console.log(`Found ${cafes.length} cafes from ${place.name}.`);

  return Promise.all(
    cafes.map(
      cafe => Promise.all(
        cafe.image.list
          .map((image) => image.relativeUri)
          .map(toCloudfrontUrl)
          .map((uri) => withParam(uri, { d: CAFE_IMAGE_DIMENSION }))
          .map((uri) => fetch(uri).then(statOf)),
      )
        .then(mergeStats),
    ),
  )
    .then(mergeStats);
}

const placeOutputs = (places, placeCount) => {
  core.setOutput('placeCount', placeCount);
  core.setOutput('touchedPlaceCount', places.length);
}

const logPlaceOutputs = (places, placeCount) => {
  console.log(`Found ${placeCount}, among them ${places.length} places will be used for touch`);
}

const imageOutputs = (stat) => {
  core.setOutput('touchedImageCount', stat.touched);
  core.setOutput('hitImageCount', stat.hit);
  core.setOutput('missImageCount', stat.miss);
  core.setOutput('failedImageCount', stat.failed);
}

const logImageOutputs = (stat) => {
  console.log(`Touched ${stat.touched} images. Among them ${stat.hit} images were already cached. ${stat.miss} images are newly cached. ${stat.failed} images were not available.`);
  if (stat.failed > 0) console.log(`These images were not available:`, stat.failedImageResources);
}

async function main() {
  const {
    place: {
      count: placeCount,
      list: allPlaces,
    }
  } = await fetch(PLACE_LIST())
    .then(response => response.json());
  
  const places = allPlaces.slice(0, 5); // only 5 places will be used

  placeOutputs(places, placeCount);
  logPlaceOutputs(places, placeCount);

  const stat = await Promise.all(places.map(touchCafeImagesInPlace)).then(mergeStats);
  
  imageOutputs(stat);
  logImageOutputs(stat);
}

main();
