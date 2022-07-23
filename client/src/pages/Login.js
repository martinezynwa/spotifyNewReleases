const Login = () => {
  return (
    <>
      <div>
        <button>
          <a href={`${process.env.REACT_APP_BASE_URL}/login`}>Login</a>
        </button>
      </div>
    </>
  )
}

export default Login
