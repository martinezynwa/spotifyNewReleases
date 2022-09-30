import useGroup from '../../context/GroupContext'
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import SingleArtistCard from './SingleArtistCard'
import RemoveGroup from './RemoveGroup'
import ArtistOffcanvas from './ArtistOffcanvas'

const GroupPage = () => {
  const { offcanvas } = useGroup()
  const { group, background } = useLocation().state
  const { artists, getArtists } = useGroup()

  useEffect(() => {
    getArtists(group._id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const colors = {
    '#777777': 'from-[#777777]',
    '#1E3264': 'from-[#1E3264]',
    '#FF4632': 'from-[#FF4632]',
    '#8D67AB': 'from-[#8D67AB]',
    '#E8115B': 'from-[#E8115B]',
    '#148A08': 'from-[#148A08]',
    '#F037A5': 'from-[#F037A5]',
    '#EB1E32': 'from-[#EB1E32]',
    '#BA5D07': 'from-[#BA5D07]',
    '#0D73EC': 'from-[#0D73EC]',
  }

  return (
    <>
      <div>
        <div
          className={`flex flex-col pt-10 md:pt-20 px-4 h-52 md:h-72 bg-gradient-to-b ${colors[background]} to-black`}>
          <h2 className="text-4xl md:text-7xl font-bold mb-3">
            {group.groupName ? group.groupName : 'Unassigned'}
          </h2>
          <h2 className="text-xs font-semibold uppercase ml-1">
            {artists ? artists.length : null} artists without group
          </h2>
          <h2 className={`${group.groupName ? '' : 'hidden '}text-[12px] ml-1`}>
            Spotify playlist{' '}
            <span className="font-semibold">{group.connectedPlaylistName}</span>
          </h2>
          {group !== 'unassigned' ? <RemoveGroup id={group._id} /> : null}
        </div>
      </div>
      <div className="grid grid-cols-1 px-5 md:px-10 gap-4 md:gap-6 pb-16 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
        {artists
          ? artists.map(a => <SingleArtistCard key={a._id} artist={a} />)
          : null}
      </div>
      {offcanvas ? <ArtistOffcanvas /> : null}
    </>
  )
}

export default GroupPage
