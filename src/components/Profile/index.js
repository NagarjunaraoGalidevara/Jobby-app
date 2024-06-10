import {Component} from 'react'
import './index.css'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Profile extends Component {
  state = {
    profileData: {},
    apiStatus: apiStatusConstants.initial,
  }
  componentDidMount() {
    this.getProfileData()
  }

  getProfileData = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = 'https://apis.ccbp.in/profile'
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = {
        name: fetchedData.profile_details.name,
        profileImageUrl: fetchedData.profile_details.profile_image_url,
        shortBio: fetchedData.profile_details.short_bio,
      }
      console.log('updatedData>>', updatedData, response)
      this.setState({
        profileData: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  renderProfileView = () => {
    const {profileData} = this.state
    console.log('sate>>', profileData)
    return (
      <>
        <div className="profileContainer">
          <div>
            <img
              className="profileImage"
              src={profileData.profileImageUrl}
              alt="profile"
            />
          </div>
          <h1 className="profileName">{profileData.name}</h1>
          <p className="profileText">{profileData.shortBio}</p>
        </div>
      </>
    )
  }
  renderProfileFailureView = () => {
    return (
      <div className="buttonContainer">
        <button className="RetryButton" onClick={this.getProfileData}>
          Retry
        </button>
      </div>
    )
  }
  renderLoadingView = () => (
    <div className="profile-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  render() {
    const {apiStatus} = this.state
    console.log('apiStatus', apiStatus)
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProfileView()
      case apiStatusConstants.failure:
        return this.renderProfileFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }
}
export default Profile
