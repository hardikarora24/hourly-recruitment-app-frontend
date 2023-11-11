import { Link } from 'react-router-dom'
import DeleteIcon from '../../assets/delete.svg'
import { PROJECT_STATUS, USER_TYPES } from '../../utils/Constants'
import { useUser } from '../../contexts/UserContext'

const ProjectList = ({ projects, deleteProject = (id) => {} }) => {
  const { user } = useUser()
  return (
    <ul>
      {projects.map((project) => (
        <div className='project' key={project._id}>
          <div className='title'>Title: {project.title}</div>
          <div className='description'>Description: {project.description}</div>
          <div className='technologies'>
            Technologies: {project.technologies.join(', ')}
          </div>
          <div className='status'>Status: {project.status}</div>
          <div className='links'>
            <Link
              to={`/${user.type === USER_TYPES.admin ? 'a' : 'c'}/client?id=${
                project.clientId
              }`}
            >
              Client
            </Link>
            {project.status !== PROJECT_STATUS.posted && (
              <Link
                to={`/${
                  user.type === USER_TYPES.admin ? 'a' : 'c'
                }/freelancer?id=${project.freelancerId}`}
              >
                Freelancer
              </Link>
            )}
          </div>
          {user.type === USER_TYPES.admin &&
            project.status !== PROJECT_STATUS.approved && (
              <img
                src={DeleteIcon}
                onClick={() => deleteProject(project._id)}
              />
            )}
        </div>
      ))}
    </ul>
  )
}

export default ProjectList
