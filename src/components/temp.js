// const crypto = require('crypto')

// let hash = crypto.createHash('md5').update('api_key7d9c7d3f44008d929cf4e991ba12827cmethodauth.getSessiontokensiruetkTWtyF8odYnUQIUhBYeEczWcIZe4a4f35a1bec4e498ff8453bf63bb98d').digest('hex')
// console.log(hash)

//07b77c9fbb8c2da02dec35a0ddb55391

// billtrancon12 aq-ITyu9BQkWfl0DnTKZ_BjIvxBiK7FC 0 session key for last fm apis

const { getChart } = require('billboard-top-100');

// date format YYYY-MM-DD
getChart('hot-100', (err, chart) => {
  if (err) console.log(err);
  // week of the chart in the date format YYYY-MM-DD
  console.log(chart.songs);
//   // URL of the previous week's chart
//   console.log(chart.previousWeek.url);
//   // date of the previous week's chart in the date format YYYY-MM-DD
//   console.log(chart.previousWeek.date);
//   // URL of the next week's chart
//   console.log(chart.nextWeek.url);
//   // date of the next week's chart in the date format YYYY-MM-DD
//   console.log(chart.nextWeek.date);
//   // array of top 100 songs for week of August 27, 2016
//   console.log(chart.songs);
//   // song with rank: 4 for week of August 27, 2016
//   console.log(chart.songs[3]);
//   // title of top song for week of August 27, 2016
//   console.log(chart.songs[0].title);
//   // artist of top songs for week of August 27, 2016
//   console.log(chart.songs[0].artist);
//   // rank of top song (1) for week of August 27, 2016
//   console.log(chart.songs[0].rank);
//   // URL for Billboard cover image of top song for week of August 27, 2016
//   console.log(chart.songs[0].cover);
//   // position info of top song
//   console.log(chart.songs[0].position.positionLastWeek);
//   console.log(chart.songs[0].position.peakPosition);
//   console.log(chart.songs[0].position.weeksOnChart);
});

// // chartName defaults to hot-100
// // date defaults to Saturday of this week
// getChart((err, chart) => {
//   if (err) console.log(err);
//   console.log(chart);
// });

// // date defaults to Saturday of this week
// getChart('rock-digital-song-sales', (err, chart) => {
//   if (err) console.log(err);
//   console.log(chart);
// });