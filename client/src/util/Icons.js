import {
  FaHome,
  FaGripHorizontal,
  FaMusic,
  FaAlignJustify,
  FaSearch,
  FaCog,
  FaSignOutAlt,
  FaEllipsisH,
  FaSyncAlt,
  FaTimes,
} from 'react-icons/fa'
const desktopSize = { fontSize: '24px', color: 'hsla(0,0%,100%,.7)' }
const mobileSize = { fontSize: '32px', color: 'hsla(0,0%,100%,.7)' }

//icons for categories
const Icon = ({ name, size }) => {
  switch (name) {
    case 'Home':
      return <FaHome style={size === 'mobile' ? mobileSize : desktopSize} />
    case 'Groups':
      return (
        <FaGripHorizontal
          style={size === 'mobile' ? mobileSize : desktopSize}
        />
      )
    case 'Artists':
      return <FaMusic style={size === 'mobile' ? mobileSize : desktopSize} />
    case 'Releases':
      return (
        <FaAlignJustify style={size === 'mobile' ? mobileSize : desktopSize} />
      )
    case 'Search':
      return <FaSearch style={size === 'mobile' ? mobileSize : desktopSize} />
    case 'Options':
      return <FaCog style={size === 'mobile' ? mobileSize : desktopSize} />
    case 'Logout':
      return (
        <FaSignOutAlt style={size === 'mobile' ? mobileSize : desktopSize} />
      )
    case 'GroupOption':
      return (
        <FaEllipsisH style={size === 'mobile' ? mobileSize : desktopSize} />
      )
    case 'Refresh':
      return <FaSyncAlt style={size === 'mobile' ? mobileSize : desktopSize} />
    case 'Exit':
      return <FaTimes style={size === 'mobile' ? mobileSize : desktopSize} />
    default:
      return
  }
}

export default Icon
