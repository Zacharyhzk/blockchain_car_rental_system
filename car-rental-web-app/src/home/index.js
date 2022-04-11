import './index.css';
import { Link } from 'react-router-dom';

function Home() {
    return (
        <div class = "App">
        <div class="hero-image">
            <div class="hero-text">
                <h1>Welcome to ABC car rental company</h1>
                <p>Your feedbacks are important!</p>
                <br></br>
                <p>If you don't have account. </p>
                <Link to = {'./signup'}>
                <button>Join us!</button>
                </Link>
                <p>If you have account. </p>
                <Link to = {'./signin'}>
                <button>Sign In!</button>
                </Link>
            </div>
        </div>
        </div>
    );
  }
  
  export default Home;