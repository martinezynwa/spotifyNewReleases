import CreateGroup from '../components/Groups/CreateGroup.js'
import AllGroups from '../components/Groups/AllGroups.js'
import { GroupProvider } from '../context/GroupContext.js'

const Groups = () => {
  return (
    <>
      <div className="mx-2 md:mx-4 mt-8 space-y-12">
        <GroupProvider>
          <div className='space-y-4 ml-2 md:ml-0'>
            <h2 className="text-3xl text-white font-semibold tracking-tight">
              Create Group
            </h2>
            <CreateGroup />
          </div>
          <div className='space-y-4'>
            <h2 className="text-3xl ml-2 md:ml-0 text-white font-semibold tracking-tight">
              Created Groups
            </h2>
            <AllGroups />
          </div>
        </GroupProvider>
      </div>
    </>
  )
}

export default Groups
