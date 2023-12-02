import { useState, useEffect } from 'react'
import axios from 'axios'

import Navbar from '../components/Navbar'
import Loading from '../components/Loading'
import { useUser } from '../contexts/UserContext'
import { PROJECT_STATUS, USER_TYPES } from '../utils/Constants'
import DeleteIcon from '../assets/delete.svg'

const Profile = () => {
  const { user } = useUser()
  return (
    <>
      <Navbar userRole={user.type} />
      {user.type === USER_TYPES.client ? (
        <ClientProfile user={user} />
      ) : (
        <FreelancerProfile user={user} />
      )}
    </>
  )
}

const ClientProfile = ({ user }) => {
  const [loading, setLoading] = useState(true)
  const [projects, setProjects] = useState([])
  const [error, setError] = useState('')

  const getProjects = async () => {
    try {
      const { data } = await axios({
        method: 'GET',
        url: `${import.meta.env.VITE_SERVER_URL}/client/projects?id=${
          user._id
        }`,
        withCredentials: true,
      })

      if (data.success) {
        setProjects(data.projects)
        setLoading(false)
      }
    } catch (e) {
      setError('Could not get earnings')
      setLoading(false)
    }
  }

  useEffect(() => {
    getProjects()
  }, [])

  return loading ? (
    <Loading />
  ) : (
    <div className='client-profile'>
      <h2>
        {user.first_name} {user.last_name}
      </h2>
      <div className='stats'>
        <div className='stat'>
          Posted Projects:{' '}
          {projects.filter((p) => p.status === PROJECT_STATUS.posted).length}
        </div>
        <div className='stat'>
          Current Projects:{' '}
          {
            projects.filter((p) => p.status === PROJECT_STATUS.inProgress)
              .length
          }
        </div>
        <div className='stat'>
          Completed Projects:{' '}
          {
            projects.filter(
              (p) =>
                p.status === PROJECT_STATUS.completed ||
                p.status === PROJECT_STATUS.approved
            ).length
          }
        </div>
      </div>
    </div>
  )
}

const FreelancerProfile = ({ user }) => {
  const [skills, setSkills] = useState(user.skills)
  const [earnings, setEarnings] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [newSkill, setNewSkill] = useState('')

  const handleAddSkill = async (e) => {
    e.preventDefault()

    if (newSkill.trim() !== '') {
      const { data } = await axios({
        method: 'POST',
        url: `${import.meta.env.VITE_SERVER_URL}/freelancer/add-skill`,
        data: { skill: newSkill, id: user._id },
        withCredentials: true,
      })

      if (data.success) {
        setSkills(data.skills)
        setLoading(false)
        setNewSkill('')
      }
    }
  }

  const getEarnings = async () => {
    try {
      const { data } = await axios({
        method: 'GET',
        url: `${import.meta.env.VITE_SERVER_URL}/freelancer/earnings?id=${
          user._id
        }`,
        withCredentials: true,
      })

      if (data.success) {
        setEarnings(data.earnings)
        setLoading(false)
      }
    } catch (e) {
      setError('Could not get earnings')
    }
  }

  const deleteSkill = async (i) => {
    setLoading(true)
    try {
      const { data } = await axios({
        method: 'POST',
        url: `${import.meta.env.VITE_SERVER_URL}/freelancer/delete-skill`,
        data: { skills: skills.filter((s, idx) => idx !== i), id: user._id },
        withCredentials: true,
      })

      if (data.success) {
        setSkills(data.skills)
        setLoading(false)
      }
    } catch (e) {
      setLoading(false)
    }
  }

  useEffect(() => {
    getEarnings()
  }, [])

  return loading ? (
    <Loading />
  ) : (
    <div className='freelancer-profile'>
      <h2>
        {user.first_name} {user.last_name}
      </h2>
      <div className='earnings'>
        <h3>Total Earnings: ${earnings}</h3>
      </div>
      <div className='skills'>
        <h4>Skills:</h4>
        <ul>
          {skills.map((skill, index) => (
            <li key={index}>
              {skill}{' '}
              <img
                src={DeleteIcon}
                alt='delete'
                onClick={() => {
                  deleteSkill(index)
                }}
              />
            </li>
          ))}
        </ul>
        <form className='add-skill'>
          <input
            className='input'
            type='text'
            placeholder='Add a skill'
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
          />
          <button
            className='btn'
            onClick={(e) => {
              handleAddSkill(e)
            }}
          >
            Add Skill
          </button>
        </form>
      </div>
    </div>
  )
}

export default Profile
