### MAIN CONCEPTS

Why:

- created for personal purposes
- everytime new music is released, I listen to it, and if I like it, I add it into a playlist corresponding with the song's genre
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


### 0.15

- [x] remove Artists page and merge it with groups page
   - [x] context update etc.
- [x] load specific artists per group only, not all
- [x] sync/removal of artists --> to Options page
- [x] pick random color(ignore already picked) for groups page during creation
- [x] Unnamed group that will show unassigned artists

- [x] Tailwind CSS for both desktop and mobile
  - [x] Dashboard
  - [x] Releases
  - [x] Single release
  - [x] Groups
    - [x] group creation
    - [x] group deletion
    - [x] sidebar for artists
      - [x] delete from group
      - [x] edit group
      - [x] hide sidebar
  - [x] Single group
  - [x] Options
  - [x] Login page
  - [x] Notifications
### TBD
- [ ] mobile - button size on group
- [ ] mobile - groups, during edit action, notification is up top
- [ ] mobile - bigger logo on header
- [ ] go back button
- [ ] figure out unnecessary re-renders
- [ ] when returning from release that is very low, it should return to the same place, not to the top
- [ ] some records are released during the day and not at midnight, add function to check the previous day as well
- [ ] create test version


# AUTH & USER
### 0.10
- [x] register app on Spotify dev dashboard
- [x] find out how Spotify auth works
- [x] login part on frontend
- [x] receive access/refresh tokens from spotify on backend
- [x] user model in MongoDB
- [x] create user in MongoDB if not there yet using spotify ID
- [x] saving tokens on frontend into localstorage
- [x] timestamp creation to find out when token expires to refresh it
- [x] token refresh if expired/logout part
### 0.13
- [x] User context
### 0.14
- [x] save refresh token into database
### TBD
- [x] check why is token not refreshed automatically sometimes

# DASHBOARD
### 0.10
- [x] Routes
- [x] get user ID in order to display it on navbar
### 0.11
- [x] figure out logic on backend
- [x] handle situation when two artists are listed as album/song creators
- [x] handle duplicates(when following two artists that released one song together)
### 0.12
- [x] add group owner into the item input during group/artist creation
- [x] lastFetchDate should be linked with user info from MongoDB
- [x] figure out why is axios post not working sometimes
  - [x] axios post to specific playlist may contain more than one item
- [x] return what songs were added during the run from backend
### 0.13
- [x] list of what was added is shown on main page without having to run the action


# GROUPS PAGE
### 0.11
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
### 0.12
- [x] create context and reducers for groups
- [x] transfer group creation into the context
- [x] delete group
- [x] deleting group automatically removes artist from it as well
### 0.13
- [x] show playlists that are owned by logged user only


# ARTISTS PAGE
### 0.11
- [x] get followed artists
### 0.12
- [x] fix after artist removal, clicking one more time on remove crashes the backend
- [x] add option to unfollow(from Spotify)
  - [x] backend/frontend services
  - [x] unfollowing means automatically removing artists from database as well
- [x] fix error validateDOMNesting(...): cannot appear as a child of
- [x] refactoring of group selection process
- [x] create context and reducers for artists manipulation
- [x] transfer artist manipulation into the context
### 0.13
- [x] re-do loading so it happens from database and not via API every time
- [x] logic for manual synchronization database<-->Spotify
- [x] logic for removing records from database if artist is unfollowed
### 0.14
- [x] infinite scrolling

# RELEASES PAGE
### 0.11
- [x] basic load - show albums only
- [x] add info if album is single, EP/full album
- [x] separate API calls for songs/albums with more details for this page
- [x] option to list songs
- [x] show song details - number/artists/name/duration
### 0.12
- [x] single button for toggling visibility
### 0.13
- [x] show releases from last 30 days without having to call API every time
- [x] releases added to database
- [x] records older than 30 days should be deleted
- [x] implement manual refresh as well
### 0.14
- [x] infinite scrolling


# OTHERS
### 0.12
- [x] fix refresh on specific page redirecting to homepage
- [x] refetch data on page after some action(add, edit)
- [x] divide the services/controllers better, some are not where they should be
### 0.13
- [x] albums and singles should be fetched separately
- [x] listing artists/groups should filter per user
- [x] deleting/editing should filter artists/groups per user
- [x] fix Spotify error code 429
### 0.14
- [x] error handling on server for API calls towards Spotify
  - [x] spotify controller
  - [x] within songsAndAlbums
  - [x] login controller
- [x] error handling on client
  - [x] spotify service
  - [x] artist service
  - [x] releases service
- [x] notifications for everything(so far)
- [x] custom hook that handles loading screen during API calls
- [x] show errors on options page in case some happened during any task
- [x] infinite scrolling as hook
- [x] schedule tasks to run automatically every night
- [x] logging of errors
- [x] logging of jobs