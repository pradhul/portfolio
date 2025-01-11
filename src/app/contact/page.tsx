import { FaLinkedin } from "react-icons/fa";
import { FaGithubSquare } from "react-icons/fa";
import { IoMail } from "react-icons/io5";
import { FaPhone } from "react-icons/fa6";
import { SiStackoverflow } from "react-icons/si";
import { FaSquareUpwork } from "react-icons/fa6";

export default function Contact() {
  return (
    <div className="contactContainer">
      <div>
        <b>Contact Me</b>
        <p>
          <a href="mailto:example@example.com">
            <IoMail className="icon" />
          </a>
          pradhuldev.1990@gmail.com{" "}
        </p>
        <p>
          <FaPhone className="icon" /> +91-9986981757
        </p>
        <div className="social">
          <a href="https://www.linkedin.com/in/pradhul-dev-30708814b/" target="_blank">
            <FaLinkedin className="icon" />
          </a>
          <a href="https://github.com/pradhul" target="_blank">
            <FaGithubSquare className="icon" />
          </a>
          <a href="https://stackoverflow.com/users/3309470/p-rad" target="_blank">
            <SiStackoverflow className="icon" />
          </a>
          <a href="https://www.upwork.com/freelancers/~01a32f29fafd184f21" target="_blank">
            <FaSquareUpwork className="icon" />
          </a>
        </div>
      </div>
    </div>
  );
}
