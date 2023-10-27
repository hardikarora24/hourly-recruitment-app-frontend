import React, { useEffect, useState } from 'react'
import axios from 'axios'

import Loading from '../Loading'
import ProjectDetails from './ProjectDetails'

const PostedProject = ({ project }) => {
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
        data: {
          bidId: b._id,
          projectId: project._id,
          freelancerId: b.freelancerId,
        },
        withCredentials: true,
      })
    } catch (e) {
      console.log('Could not accept')
    }
  }

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          <ProjectDetails project={project} />
          {bids.map((b) => {
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
          })}
        </>
      )}
    </>
  )
}

export default PostedProject
