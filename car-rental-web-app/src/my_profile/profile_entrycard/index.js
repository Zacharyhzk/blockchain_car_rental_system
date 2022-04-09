import { Link } from "react-router-dom";

function ProfileEntryCard(props) {
    return (
        <li id="job">
            <div>
                <Link to={{
                pathname: `/course`,
                state: {course: props}
                }}>
                    <h3>CourseID: { props.courseID }</h3>
                    <p>Order Number: </p >
                    <p>Total Rental Amount: </p >
                </Link>
            </div>
        </li>
    );
  }
  
  export default ProfileEntryCard;