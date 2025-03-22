main();

async function main() {
  try {
    const city = await findCityForZipCode("01309");
    const restaurant = await findMostFamousRestaurantForCity(city);
    const hours = await findOpenHoursForRestaurant(restaurant);
    const freeTime = await findUserFreeTimeForHours(hours);
    return `Restaurant visit: ${freeTime}`;
  } catch (error) {
    throw new Error(`Could not find free time: ${error}`);
  }
}

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
