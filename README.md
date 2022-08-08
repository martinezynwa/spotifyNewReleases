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

!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!COMMENTS!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

### AUTH
## 0.10
- [x] register app on Spotify dev dashboard
- [x] find out how Spotify auth works
- [x] login part on frontend
- [x] receive access/refresh tokens from spotify on backend
- [x] user model in MongoDB
- [x] create user in MongoDB if not there yet using spotify ID
- [x] saving tokens on frontend into localstorage
- [x] timestamp creation to find out when token expires to refresh it
- [x] token refresh if expired/logout part
# TBD
- [ ] check why is token not refreshed automatically


### DASHBOARD
## 0.10
- [x] Routes
- [x] get user ID in order to display it on navbar
## 0.11
- [x] figure out logic on backend
- [x] handle situation when two artists are listed as album/song creators
- [x] handle duplicates(when following two artists that released one song together)
# TBD
- [ ] figure out why is axios post not working sometimes
- [ ] add group owner into the item input during group/artist creation
- [ ] lastFetchDate should be linked with user info from MongoDB
- [ ] return what songs were added during the run from backend
- [ ] getting new releases should run automatically once per day, not manually


### GROUPS PAGE
## 0.11
- [x] get user's playlists
- [x] create group
  - [x] list added artist inside group
- [x] link the group with a specific playlist of an user
- [x] get followed artists
- [x] manually add followed artists into the group
  - [x] in the dropdown on artists page, same playlist should not be listed twice
  - [x] button to remove artist from a group + backend functionality
  - [x] edit button and backend functionality
- [x] check every artist's lately(using specific date) released music
- [x] add the songs into the previously selected playlist
# TBD
- [ ]


### ARTISTS PAGE
## 0.11
- [x] get followed artists
- [ ] add option to unfollow(from Spotify)
  - [ ] unfollowing means automatically removing artists from database as well
- [ ] fix situation, after artist removal, clicking one more time on remove crashes the backend
# TBD
- [ ]


### RELEASES PAGE
## 0.11
- [x] basic load - show albums only
- [x] add info if album is single, EP/full album
- [x] separate API calls for songs/albums with more details for this page
- [x] option to list songs
- [x] show song details - number/artists/name/duration
# TBD
- [ ] single button for toggling visibility


### OTHERS
- [ ] custom hook that handles loading screen during API calls
- [ ] divide the services/controllers better, some are not where they should be