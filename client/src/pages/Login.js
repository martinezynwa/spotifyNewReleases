import logo from '../assets/img/logo.svg'

const Login = () => {
  return (
    <>
      <div className="flex flex-col h-full items-center justify-center">
        <img src={logo} alt="" className="h-24 w-48" />
        <div className="flex flex-row gap-4">
          <button className="w-40 h-10 bg-active rounded-lg hover:bg-neutral-500">
            <a href={`${process.env.REACT_APP_BASE_URL}/login`}>
              Login using Spotify
            </a>
          </button>
          <button className="w-40 h-10 bg-active rounded-lg hover:bg-neutral-500">
            <a href={`${process.env.REACT_APP_BASE_URL}/test`}>Demo version</a>
          </button>
        </div>
      </div>
    </>
  )
}

export default Login
