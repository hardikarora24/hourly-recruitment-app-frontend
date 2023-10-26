import React, { useEffect, useState } from 'react'
import axios from 'axios'

import Loading from '../Loading'

const Project = ({ project }) => {
  const [bids, setBids] = useState([])
  const [loading, setLoading] = useState(true)

  const getBids = async () => {
    try {
      const { data } = await axios({
        method: 'GET',
        url: `${import.meta.env.VITE_SERVER_URL}/client/bids?projectId=${
          project._id
        }`,
        withCredentials: true,
      })

      if (data.success) {
        setBids(data.bids)
        setLoading(false)
      } else {
        throw new Error(data.message)
      }
    } catch (e) {
      console.log(e)
      setLoading(false)
    }
  }

  useEffect(() => {
    getBids()
  }, [])

  const handleSubmit = async (b) => {
    try {
      const response = await axios({
        method: 'POST',
        url: `${import.meta.env.VITE_SERVER_URL}/client/accept-bid`,
        data: { bidId: b._id, projectId: project._id },
        withCredentials: true,
      })

      console.log(response)
    } catch (e) {
      console.log('Could not accept')
    }
  }

  return (
    <div>
      <div>Title: {project.title}</div>
      <div>Description: {project.description}</div>
      <div>Technologies: {project.technologies.join(', ')}</div>
      <div>Estimated Duration: {project.duration}</div>
      {loading ? (
        <Loading />
      ) : (
        bids.map((b) => {
          return (
            <div>
              <span>Rate: {b.hourly_rate}</span>
              <button
                onClick={(e) => {
                  handleSubmit(b)
                }}
              >
                Accept
              </button>
            </div>
          )
        })
      )}
    </div>
  )
}

export default Project
