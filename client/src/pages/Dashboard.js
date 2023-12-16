import { Button, Container, Grid, Paper } from "@mui/material";
import React, { useEffect, useState } from "react";
import FileUpload from "../components/FileUpload";
import Chart from "../components/Chart";
import axios from "axios";

const Dashboard = () => {
  const [data,setData] = useState([]);
  const [show, setShow] = useState(false);
  useEffect(() => {
    const getReadings = async () => {
      try {
        const response = await axios.get(
          process.env.REACT_APP_BACKEND + "get-readings/1234"
        );
        setData(response?.data?.result);
      } catch (error) {
        console.error(error);
        alert(error?.response?.data?.message);
      }
    };
    getReadings();
  }, []);
  return (
    <Container>
      <Paper elevation={5} sx={{ mt: 5, p: 2, height: "90vh" }}>
        <Grid container>
          <Grid item md={2} xs={12}>
            <Button
              variant="outlined"
              color="info"
              onClick={() => setShow(!show)}
            >
              {show ? "Cancel" : "Click to Upload"}
            </Button>
          </Grid>
          {show && (
            <Grid item md={10} xs={12}>
              <FileUpload />
            </Grid>
          )}
          <Grid item md={12} xs={12} mt={5}>
            <Chart data={data} />
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Dashboard;
