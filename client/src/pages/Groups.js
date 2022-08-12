import CreateGroup from '../components/Groups/CreateGroup.js'
import AllGroups from '../components/Groups/AllGroups.js'
import { GroupProvider } from '../context/GroupContext.js'

const Groups = () => {
  return (
    <>
      <GroupProvider>
        <CreateGroup />
        <AllGroups />
      </GroupProvider>
    </>
  )
}

export default Groups
