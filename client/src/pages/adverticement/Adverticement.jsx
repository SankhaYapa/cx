import "./adverticement.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import ReactPlayer from "react-player";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import FeedBackTable from "../../components/feedbackTable/FeedBackTable";

const Adverticement = () => {
  const { adverticementId } = useParams();
  const [advertisement, setAdvertisement] = useState(null);
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Define the emotion categories you want as columns
  const emotionCategories = [
    "Happy",
    "Angry",
    "Contempt",
    "Disgust",
    "Fear",
    "Neutral",
    "Surprise",
  ];
  useEffect(() => {
    const fetchAdvertisementDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8800/api/adverticements/${adverticementId}`
        );
        setAdvertisement(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching advertisement details", error);
        setError("Failed to retrieve advertisement data.");
        setLoading(false);
      }
    };

    const fetchFeedbackDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8800/api/feedbacks/adverticement/${adverticementId}`
        );
        setFeedback(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching feedback details", error);
        setError("Failed to retrieve feedback data.");
        setLoading(false);
      }
    };

    fetchAdvertisementDetails();
    fetchFeedbackDetails();
  }, [adverticementId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!advertisement) {
    return <div>No advertisement data found.</div>;
  }

  return (
    <div className="single">
      <Sidebar />
      <div className="singleContainer">
        <Navbar />
        <div className="top">
          <div className="left">
            <ReactPlayer
              height={300}
              width={400}
              url={advertisement.video}
              controls={true}
            />
          </div>
          <div className="right">
            <h3>Advertisement Details</h3>
            <p>{advertisement.title}</p>
            <p>
              {advertisement.scheduleDateTime
                ? new Date(advertisement.scheduleDateTime)
                    .toISOString()
                    .split("T")[0]
                : ""}
            </p>

            <p>{advertisement.status}</p>
          </div>
        </div>
        <FeedBackTable></FeedBackTable>
      </div>
    </div>
  );
};

export default Adverticement;
