import logo from '../assets/img/logo.svg'

const Login = () => {
  return (
    <>
      <div className="flex flex-col h-full items-center justify-center">
        <img src={logo} alt="" className="h-24 w-48" />
        <div className="flex flex-col md:flex-row gap-4">
          <a href={`${process.env.REACT_APP_BASE_URL}/login`}>
            <button className="w-40 h-10 bg-active rounded-lg hover:bg-neutral-500">
              Login using Spotify
            </button>
          </a>

          <a href={`${process.env.REACT_APP_BASE_URL}/test`}>
            <button className="w-40 h-10 bg-active rounded-lg hover:bg-neutral-500">
              Demo version
            </button>
          </a>
        </div>
      </div>
    </>
  )
}

export default Login
