import useGroup from '../../context/GroupContext.js'
import Icon from '../../util/Icons'

const SelectGroupDropdown = ({ artistDetails }) => {
  const { offcanvas, toggleOffcanvas, toggleGroupDetails } = useGroup()

  const doChange = () => {
    toggleGroupDetails(artistDetails)
    toggleOffcanvas(!offcanvas)
  }

  return (
    <div>
      <button onClick={() => doChange()}>
        <Icon name="GroupOption" />
      </button>
    </div>
  )
}

export default SelectGroupDropdown
