import { GroupProvider } from '../context/GroupContext'
import GroupPage from '../components/Groups/GroupPage'

const Group = () => {
  return (
    <>
      <GroupProvider>
        <GroupPage />
      </GroupProvider>
    </>
  )
}

export default Group
