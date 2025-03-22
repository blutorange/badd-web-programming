findCityForZipCode("01309")
  .then((city) => findMostFamousRestaurantForCity(city))
  .then((restaurant) => findOpenHoursForRestaurant(restaurant))
  .then((hours) => findUserFreeTimeForHours(hours))
  .then((freeTime) => `Restaurant visit: ${freeTime}`)
  .catch((error) => `Could not find free time: ${error}`);

function findCityForZipCode(zipCode) {
  if (Math.random() > 0.9) return Promise.reject("ZIP code search failed");
  return Promise.resolve("Dresden");
}

function findMostFamousRestaurantForCity(city) {
  if (Math.random() > 0.9) return Promise.reject("Restaurant search failed");
  return Promise.resolve("Bistro Yukito (雪都)");
}

function findOpenHoursForRestaurant(restaurant) {
  if (Math.random() > 0.9) return Promise.reject("Open hours search failed");
  return Promise.resolve("18:00-21:30");
}

function findUserFreeTimeForHours(hours) {
  if (Math.random() > 0.9) return Promise.reject("Schedule search failed");
  return Promise.resolve("20:00-21:00");
}
