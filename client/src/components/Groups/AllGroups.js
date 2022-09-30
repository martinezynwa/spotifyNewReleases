import SingleGroupLink from './SingleGroupLink.js'
import useGroup from '../../context/GroupContext.js'

const AllGroups = () => {
  let index = -1
  const { groups } = useGroup()

  const colors = [
    '#777777',
    '#1E3264',
    '#FF4632',
    '#8D67AB',
    '#E8115B',
    '#148A08',
    '#F037A5',
    '#EB1E32',
    '#BA5D07',
    '#0D73EC',
  ]

  const getBackground = () => {
    if (index + 1 === colors.length) index = -1
    index++
    return colors[index]
  }

  return (
    <>
      <div>
        <div className="grid grid-cols-2 gap-1 md:gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7">
          <SingleGroupLink group={'unassigned'} background={getBackground()} />
          {groups
            ? groups.map(g => (
                <SingleGroupLink
                  key={g._id}
                  group={g}
                  background={getBackground()}
                />
              ))
            : null}
        </div>
      </div>
    </>
  )
}

export default AllGroups
