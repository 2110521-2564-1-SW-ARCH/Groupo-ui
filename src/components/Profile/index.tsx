import {
  Box,
  Button,
  Container,
  CssBaseline,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { useState, useEffect } from "react";
import { getProfileDeep } from "../../client/AuthClient";

const Profile = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [fname, setFname] = useState("Sornram");
  const [lname, setLname] = useState("Saetang");
  const [email, setEmail] = useState("chomtana001@gmail.com");

  async function refreshData() {
    const profile = await getProfileDeep();
    console.log(profile);

    setFname(profile.firstName)
    setLname(profile.lastName)
    setEmail(profile.email)
  }

  useEffect(() => {
    refreshData();
  }, [])

  const handleOnEdit = () => {
    if (isEdit) {
      setIsEdit(false);
    } else {
      setIsEdit(true);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography component="h1" variant="h4">
          Your profile
        </Typography>
        <Box sx={{ mt: 3 }}>
          <Grid container spacing={2} minWidth="412px">
            {!isEdit && (
              <Grid item xs={12} sm={6}>
                <Typography component="h4" variant="h5">
                  {fname}
                </Typography>
              </Grid>
            )}
            {!isEdit && (
              <Grid item xs={12} sm={6}>
                <Typography component="h4" variant="h5">
                  {lname}
                </Typography>
              </Grid>
            )}
            {isEdit && (
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="fname"
                  name="firstName"
                  fullWidth
                  value={fname}
                  onChange={(e) => {
                    setFname(e.target.value);
                  }}
                  error={fname === ""}
                  id="firstName"
                  label="First Name"
                  autoFocus
                />
              </Grid>
            )}
            {isEdit && (
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="lname"
                  value={lname}
                  onChange={(e) => {
                    setLname(e.target.value);
                  }}
                  error={lname === ""}
                />
              </Grid>
            )}
            <Grid item xs={12} sm={6}>
              <Typography component="h3" variant="h5">
                {email}
              </Typography>
            </Grid>
          </Grid>
          <Button
            onClick={handleOnEdit}
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            {isEdit ? "Confirm" : "Edit information"}
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Profile;
