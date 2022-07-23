### MAIN CONCEPTS

Why:

- created for personal purposes
- everytime new music is released, I listen to it, and if I like it, I add it into a playlist corresponding with the song's genre
- I usually decide whether to add a song to my library after a couple of listens to it, so this helps me to differentiate new songs from already liked songs
- Spotify's Release Radar shows released music every week, however it's not specific enough for me(sometimes artists are missing, songs are repeated, etc...)
- only mobile app is showing released music by your followed artists
- I wanted to automate this process, without having to manually add newly released songs to my playlists
- goal of this app --> check newly released music of my followed artists and add it to a corresponding playlist

How:

- core of the app are groups
  - group = genre
  - user creates a group called 'pop' and will manually add artists performing under genre pop inside
  - each group is tied with already created playlist(group called pop will be tied with playlist called 'pop' within the Spotify)
  - logic inside will grab every artist within the group and check if there are any new releases for them lately
  - if so, new songs are added to the playlist

### PROGRESS

### 0.1

- [x] start, install packages, prepare MongoDB
- [x] auth part
  - [x] register app on Spotify dev dashboard
  - [x] find out how Spotify auth works
  - [x] login part on frontend
  - [x] receive access/refresh tokens from spotify on backend
  - [x] user model in MongoDB
  - [x] create user in MongoDB if not there yet using spotify ID
  - [x] saving tokens on frontend into localstorage
  - [x] timestamp creation to find out when token expires to refresh it
  - [x] token refresh if expired/logout part
- [x] Routes
- [x] get user ID in order to display it on navbar

### TBD

- [ ] create groups of artists
  - [ ] get followed artists
  - [ ] get user's playlists
  - [ ] create group
  - [ ] link the group with a specific playlist of an user
  - [ ] manually add followed artists into the group
  - [ ] check every artist's lately(using specific date) released music
  - [ ] add the songs into the previously selected playlist
- [ ] get followed artists
  - [ ] add option to unfollow
- [ ] show latest releases of followed users
