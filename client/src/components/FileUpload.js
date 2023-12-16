import React, { useState } from "react";
import { Button, FormControl, Grid, TextField } from "@mui/material";
import axios from "axios";

const FileUpload = () => {
  const [serial, setSerial] = useState("");
  const handleChange = (event) => {
    setSerial(event?.target?.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const url = process.env.REACT_APP_BACKEND + "upload";
    if (!serial) {
      alert("please enter serial number");
      return false;
    }
    try {
      const formData = new FormData(form);
      formData.append("serial", serial);
      const response = await axios.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert(response?.data?.message);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <Grid container>
        <Grid item md={6}>
          <TextField
            id="outlined-basic"
            label="Serial Number"
            type="number"
            defaultValue={1234}
            variant="outlined"
            onChange={handleChange}
            required
          />
        </Grid>
        <Grid item md={6}>
          <FormControl sx={{ px: 2 }}>
            <input type="file" name="file" required />
          </FormControl>
          <Button variant="contained" color="primary" type="submit">
            Submit
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default FileUpload;
