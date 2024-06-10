import React, {Component} from 'react'
import './index.css'
import {FaStar} from 'react-icons/fa'
import {IoLocationOutline} from 'react-icons/io5'
import {MdLocalMall} from 'react-icons/md'
import Loader from 'react-loader-spinner'
import {Link} from 'react-router-dom'
import Cookies from 'js-cookie'
const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class JobDetails extends Component {
  state = {
    jobItemsList: {},
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getJobsItemData()
  }

  getJobsItemData = async () => {
    try {
      const {searchInput, employmentTypes, minimumPackage} = this.state
      this.setState({apiStatus: apiStatusConstants.inProgress})
      const jwtToken = Cookies.get('jwt_token')
      const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${employmentTypes.join(
        ',',
      )}&minimum_package=${minimumPackage}&search=${searchInput}`
      const options = {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
        method: 'GET',
      }

      const response = await fetch(apiUrl, options)
      if (response.ok) {
        const fetchedData = await response.json()
        this.setState({
          jobItemsList: fetchedData,
          apiStatus: apiStatusConstants.success,
        })
      } else {
        throw new Error('Failed to fetch data')
      }
    } catch (error) {
      console.error('Error fetching jobs data:', error)
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderJoblistView = () => {
    const {jobItemsList} = this.state
    return (
      <div>
        {jobItemsList.jobs?.length > 0 ? (
          jobItemsList.jobs.map(jobData => (
            <div className="JobDetailsCard" key={jobData.id}>
              <Link to={`/jobs/${jobData.id}`} className="nav-link">
                <div className="CompanyLogoContainer">
                  <img
                    className="logoImg"
                    src={jobData.company_logo_url}
                    alt="company logo"
                  />
                  <div className="titleContainer">
                    <h1 className="jobTitle">{jobData.title}</h1>
                    <p>
                      <FaStar color="yellow" /> {jobData.rating}
                    </p>
                  </div>
                </div>
                <div className="jobInfo">
                  <div className="jobLocationType">
                    <p className="locationicon">
                      <IoLocationOutline /> {jobData.location}
                    </p>
                    <p>
                      <MdLocalMall /> {jobData.employment_type}
                    </p>
                  </div>
                  <div>
                    <h1 className="jobTitle">{jobData.package_per_annum}</h1>
                  </div>
                </div>
                <hr />
                <div>
                  <h1 className="jobTitle">Description</h1>
                  <p>{jobData.job_description}</p>
                </div>
              </Link>
            </div>
          ))
        ) : (
          <div className="noJobsfondConatainer">
            <img
              className="NoJobsFoundImg"
              src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
              alt="no jobs"
            />
            <h1 className="jobTitle">No Jobs Found</h1>
            <p> We could not find any jobs. Try other filters. </p>
          </div>
        )}
      </div>
    )
  }

  renderJobslistfailureView = () => (
    <div className="failureviewConatainer">
      <img
        className="NoJobsFoundImg"
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1 className="jobTitle">Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for.</p>
      <button className="RetryButton" onClick={this.getJobsItemData}>
        Retry
      </button>
    </div>
  )

  renderLoadingView = () => (
    <div className="job-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  render() {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderJoblistView()
      case apiStatusConstants.failure:
        return this.renderJobslistfailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }
}

export default JobDetails
