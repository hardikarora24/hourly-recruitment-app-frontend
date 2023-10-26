import Home from '../freelancer/Home'

export default function Freelancer() {
  return (
    <div>
      <Home />
      <button
        onClick={() => {
          logout()
        }}
      >
        logout
      </button>
    </div>
  )
}
