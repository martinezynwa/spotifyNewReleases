let cities = [
  { name: 'Los Angeles', population: 1 },
  { name: 'New York', population: 81442475133 },
  { name: 'Chicago', population: 269545455598 },
  { name: 'Houston', population: 20995545451 },
  { name: 'Philadelphia', population: 15254546006 },
]

const listOfTags = [
  { id: 1, label: 'Hello', color: 'red', sorting: 0 },
  { id: 2, label: 'World', color: 'green', sorting: 1 },
  { id: 3, label: 'Hello', color: 'blue', sorting: 4 },
  { id: 4, label: 'Sunshine', color: 'yellow', sorting: 5 },
  { id: 5, label: 'Hello', color: 'red', sorting: 6 },
]
/*
cities.filter(city => console.log(city.population < 3000000))

console.log(cities)

const unique = []

listOfTags.map(x =>
  unique.filter(a => a.label === x.label).length > 0 ? null : unique.push(x),
)
*/
let songs = [
  {
    song_id: '2IbAx6XGe6mldSosFyvaH8',
    song_name: 'Break Away',
    artist_id: '2N8IPNZTiNo3nj4mreOlHU',
    artist_name: 'Camo & Krooked',
  },
  {
    song_id: '2IbAx6XGe6mldSosFyvaH8',
    song_name: 'Break Away',
    artist_id: '54qqaSH6byJIb8eFWxe3Pj',
    artist_name: 'Mefjus',
  },
]

const arr = [
  { id: 1, name: 'one' },
  { id: 2, name: 'two' },
  { id: 1, name: 'one' },
]

const ids = songs.map(s => s.song_id)
const filtered = songs.filter(({ song_id }, index) => !ids.includes(song_id, index + 1))
console.log('filtered', filtered)
