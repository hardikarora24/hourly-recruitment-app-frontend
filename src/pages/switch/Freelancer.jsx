export default function Freelancer() {
  return (
    <div>
      Freelancer{' '}
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
