// eslint-disable-next-line no-unused-vars
import React, { useContext, useRef } from 'react';
import axiosBase from '../axiosconfig';
import { Link, useNavigate } from 'react-router-dom';
import { AppState } from '../App';
import logo from '../../public/images/cropped-White-logo-no-background.png.webp'; // Import the logo image
// eslint-disable-next-line no-undef
const backendUrl = import.meta.env.VITE_BACKEND_URL
function AskQuestion() {
  const navigate = useNavigate();
  const titleDOM = useRef(null);
  const descriptionDOM = useRef(null);
  const { user } = useContext(AppState);
  async function handleSubmit(e) {
    e.preventDefault();
    const titleValue = titleDOM.current.value;
    const descriptionValue = descriptionDOM.current.value;

    const token = localStorage.getItem("token");
    if (!token) {
      alert("User not authenticated");
      navigate('/login');
      return;
    }
    if (!titleValue || !descriptionValue) {
      alert("Please provide all information");
    }
    try {
      const { data } = await axiosBase.post('/api/question/postquestion', {
        title: titleValue,
        description: descriptionValue,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert('Question posted');
      console.log(data, data.questionid, titleValue, descriptionValue);

      // Navigate to home and pass the new question data
      navigate('/', { state: { newQuestion: { questionid: data.questionid, questiontitle: titleValue, questiondescription: descriptionValue, username: data.username } } });
    } catch (error) {
      alert(error);
      alert("Something went wrong");
    }
  }
  async function Logout() {
    // Remove the token from local storage
    localStorage.removeItem('token');
    
    // Navigate to the login page or home page
    navigate('/login'); // Adjust the URL as needed
}

  return (
    <div>
      <header>
          <nav className='navbar'>
          <img src={logo} alt="Logo" className="homelogo" /> {/* Logo element */}  
          <li>
              <button>
            <Link to="/">Home</Link></button>
             </li><li>
              <Link to="/askquestion"><button className="btn-nav">Ask Question</button></Link>
              </li>
            <li>
                <button onClick={Logout} className="logout">Logout</button>
                </li>
           
          </nav>
      </header>
        <div className="steps">
        {user.profileImage ? (


<img src={`${backendUrl}/${user.profileImage.replace(/\\/g, '/')}`} alt="Profile" className="profile-image" onError={(e) => { e.target.onerror = null; e.target.src = "fallback.jpg" }} />
) : (
  <p>No profile image available</p>
)}
          <li>Summarize your problem in a one-line title.</li>
          <li>Describe your problem in more detail.</li>
          <li>Describe what you tried and what you expected to happen.</li>
          <li>Review your question and post it to the site.</li>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-container">
            <label htmlFor="title">Title:</label>
            <input ref={titleDOM} type="text" id="title" name="title" placeholder="Enter your question title, maximum length of 50 characters" required />
            <label htmlFor="description">Question Description:</label>
            <textarea ref={descriptionDOM} type="text" id="description" name="description" placeholder="Enter your question description,maximum length of 200 characters" required />
            <button type="submit">Post Your Question</button>
          </div>
        </form>
    </div>
  );
}

export default AskQuestion;
