import { Link } from 'react-router-dom'

const SingleGroup = ({ group, background }) => {
  const colors = {
    '#777777': 'bg-[#777777]',
    '#1E3264': 'bg-[#1E3264]',
    '#FF4632': 'bg-[#FF4632]',
    '#8D67AB': 'bg-[#8D67AB]',
    '#E8115B': 'bg-[#E8115B]',
    '#148A08': 'bg-[#148A08]',
    '#F037A5': 'bg-[#F037A5]',
    '#EB1E32': 'bg-[#EB1E32]',
    '#BA5D07': 'bg-[#BA5D07]',
    '#0D73EC': 'bg-[#0D73EC]',
  }

  return (
    <>
      <Link
        className={'flex justify-center'}
        to={`/groups/${group._id ? group._id : 'unassigned'}`}
        state={{ group, background }}>
        <div
          className={`flex flex-col mb-2 w-[95%] h-20 md:w-[100%] md:h-44 rounded-md ${colors[background]} cursor-pointer`}>
          <h2 className="mt-2 md:mt-4 ml-2 md:ml-4 font-bold text-sm md:text-xl">
            {group.groupName !== undefined ? group.groupName : 'Unassigned'}
          </h2>
          <div></div>
        </div>
      </Link>
    </>
  )
}

export default SingleGroup
