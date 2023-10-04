export default function Admin() {
  return (
    <div>
      Admin{' '}
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
