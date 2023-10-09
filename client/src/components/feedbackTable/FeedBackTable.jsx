import "./adverticementTable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import ReactPlayer from "react-player";
import { format } from "date-fns"; // Import format function

const FeedBackTable = () => {
  const [data, setData] = useState([]);
  const { adverticementId } = useParams();
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const [advertisement, setAdvertisement] = useState(null);
  useEffect(() => {
    const fetchAdvertisementDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8800/api/adverticements/${adverticementId}`
        );
        setAdvertisement(response.data);
      } catch (error) {
        console.error("Error fetching advertisement details", error);
      }
    };
    const fetchFeedbackDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8800/api/feedbacks/adverticement/${adverticementId}`
        );
        setData(response.data);
      } catch (error) {
        console.error("Error fetching feedback details", error);
      }
    };
    fetchFeedbackDetails();
  }, [adverticementId]);

  const formattedData = data.map((item, index) => {
    const createdAt = new Date(item.createdAt);
    const date = format(createdAt, "yyyy-MM-dd");
    const time = format(createdAt, "HH:mm:ss");

    return {
      id: index + 1,

      anger: item.emotion_counts.anger,
      contempt: item.emotion_counts.contempt,
      disgust: item.emotion_counts.disgust,
      fear: item.emotion_counts.fear,
      happy: item.emotion_counts.happy,
      neutral: item.emotion_counts.neutral,
      surprise: item.emotion_counts.surprise,
      date, // Separate date
      time, // Separate time
    };
  });

  const userColumns = [
    { field: "id", headerName: "ID", width: 50 },

    { field: "anger", headerName: "Anger", width: 100 },
    { field: "contempt", headerName: "Contempt", width: 100 },
    { field: "disgust", headerName: "Disgust", width: 100 },
    { field: "fear", headerName: "Fear", width: 100 },
    { field: "happy", headerName: "Happy", width: 100 },
    { field: "neutral", headerName: "Neutral", width: 100 },
    { field: "surprise", headerName: "Surprise", width: 100 },
    { field: "date", headerName: "Date", width: 150 }, // Date column
    { field: "time", headerName: "Time", width: 100 }, // Time column
  ];
  return (
    <div className="datatable">
      <div className="datatableTitle">Feedbacks Details</div>
      <DataGrid
        className="datagrid"
        rows={formattedData}
        columns={userColumns}
        pageSize={9}
        rowsPerPageOptions={[9]}
      />
    </div>
  );
};

export default FeedBackTable;