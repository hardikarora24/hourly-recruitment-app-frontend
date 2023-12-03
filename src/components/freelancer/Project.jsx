import { useState, useEffect } from 'react'
import axios from 'axios'
import { PROJECT_STATUS } from '../../utils/Constants'
import { useUser } from '../../contexts/UserContext'
import DeleteIcon from '../../assets/delete.svg'
import businessHours from '../../utils/businessHours'
import Modal from '../Modal'

const Project = ({ project, setShowModal = (b) => {}, bidModal = false }) => {
  const [loading, setLoading] = useState(false)
  const [bids, setBids] = useState([])
  const [submission, setSubmission] = useState()
  const [error, setError] = useState('')

  const { user } = useUser()

  const getBids = async () => {
    try {
      const { data } = await axios({
        method: 'GET',
        url: `${import.meta.env.VITE_SERVER_URL}/freelancer/bids?projectId=${
          project._id
        }&id=${user._id}`,
        withCredentials: true,
      })

      if (data.success) {
        setBids(data.bids)
        setLoading(false)
      } else {
        throw new Error(data.message)
      }
    } catch (e) {
      setLoading(false)
    }
  }

  const getSubmission = async () => {
    setLoading(true)
    try {
      const { data } = await axios({
        method: 'GET',
        url: `${
          import.meta.env.VITE_SERVER_URL
        }/freelancer/submission?projectId=${project._id}&id=${user._id}`,
        withCredentials: true,
      })

      if (data.success) {
        setSubmission(data.submission)
        setLoading(false)
      } else {
        throw new Error(data.message)
      }
    } catch (e) {
      setLoading(false)
    }
  }

  useEffect(() => {
    getSubmission()
    getBids()
  }, [])

  const deleteBid = async (id) => {
    try {
      const { data } = await axios({
        method: 'POST',
        url: `${import.meta.env.VITE_SERVER_URL}/freelancer/delete-bid`,
        data: { id },
        withCredentials: true,
      })

      if (data.success) {
        setLoading(false)
      } else {
        throw new Error(data.message)
      }
    } catch (e) {
      setLoading(false)
    }
  }

  return (
    <div className='project'>
      <Modal showModal={bidModal} setShowModal={setShowModal}>
        <BidForm
          setShowModal={setShowModal}
          projectId={project._id}
          clientId={project.clientId}
          getBids={getBids}
          id={user._id}
        />
      </Modal>
      <div className='title'>Title: {project.title}</div>
      <div className='description'>Description: {project.description}</div>
      <div className='technologies'>
        Technologies: {project.technologies.join(', ')}
      </div>
      {project.status === PROJECT_STATUS.posted ||
      project.status === PROJECT_STATUS.inProgress ? (
        <>
          <div className='duration'>Estimated Duration: {project.duration}</div>
        </>
      ) : (
        <>
          <div className='rate'>Rate: {project.accepted_bid.hourly_rate}</div>
          <div className='time'>
            Time Taken:{' '}
            {!loading &&
              businessHours(
                new Date(project.accepted_bid.accepted_at),
                new Date(submission.created_at)
              )}{' '}
            hrs
          </div>
        </>
      )}
      {project.status === PROJECT_STATUS.posted ? (
        <div className='bids'>
          <div className='b-left'>
            <h5>My bids</h5>
            {bids
              .filter((b) => b.freelancerId === user._id)
              .map((b, index) => {
                return (
                  <div className='bid' key={index}>
                    {b.hourly_rate}
                    <img
                      onClick={() => {
                        deleteBid(b._id)
                      }}
                      src={DeleteIcon}
                      alt='delete'
                    />
                  </div>
                )
              })}
            <button
              className='button'
              onClick={() => {
                setShowModal(true)
              }}
            >
              Bid
            </button>
          </div>
          <div className='b-right'>
            <h5>Bids</h5>
            {bids
              .filter((b) => b.freelancerId !== user._id)
              .map((b, index) => {
                return (
                  <div className='bid' key={index}>
                    Rate: {b.hourly_rate}
                  </div>
                )
              })}
          </div>
        </div>
      ) : project.status === PROJECT_STATUS.inProgress ? (
        <button
          className='button'
          onClick={() => {
            setShowModal(true)
          }}
        >
          Submit
        </button>
      ) : (
        <></>
      )}
    </div>
  )
}

const BidForm = ({ projectId, clientId, setShowModal, getBids, id }) => {
  const [rate, setRate] = useState()

  const handleSubmit = async (e) => {
    e.preventDefault()

    const { data } = await axios({
      method: 'POST',
      url: `${import.meta.env.VITE_SERVER_URL}/freelancer/bid?id=${id}`,
      data: { projectId, clientId, rate },
      withCredentials: true,
    })

    if (data.success) {
      setShowModal(false)
      getBids()
    }
  }

  return (
    <form className='add-form'>
      <div className='group'>
        <label htmlFor='rate'>Rate: </label>
        <input
          type='number'
          onChange={(e) => {
            setRate(e.target.value)
          }}
        />
      </div>
      <button onClick={handleSubmit}>Bid</button>
    </form>
  )
}

export default Project
