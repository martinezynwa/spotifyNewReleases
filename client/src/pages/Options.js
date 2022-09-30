import Logs from '../components/Options/Logs'
import SyncFollowed from '../components/Options/SyncFollowed'
import RemoveUnfollowed from '../components/Options/RemoveUnfollowed'

const Options = () => {
  return (
    <>
      <div className="mx-2 md:mx-4 mt-8 md:w-[45%]">
        <h2 className="text-4xl font-semibold">Settings</h2>
        <h3 className="text-2xl mt-9 font-semibold">Manual synchronization</h3>
        <p className="text-xs mt-1 text-link">
          Data is synced automatically every midnight
        </p>
        <SyncFollowed />
        <RemoveUnfollowed />
        <h3 className="text-2xl mt-9 font-semibold">Debug</h3>
        <Logs />
      </div>
    </>
  )
}

export default Options
