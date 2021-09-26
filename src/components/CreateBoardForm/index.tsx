import {
  Box,
  Button,
  Container,
  Grid,
  IconButton,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import { useState } from "react";
import { createBoardFormConfig } from "../../models/form/board";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";
import AddChoiceModal from "../AddChoiceModal";

const CreateBoardForm = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const formik = useFormik({
    ...createBoardFormConfig,
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
    },
  });

  const removeChoiceItem = (choice: string) => {
    formik.setFieldValue("choices", [
      ...formik.values.choices.filter((item) => item !== choice),
    ]);
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 3 }}>
        <Typography variant="h5">Create new board</Typography>
        <Grid container spacing={2} mt={2}>
          <Grid item xs={12}>
            <TextField
              name="boardName"
              fullWidth
              value={formik.values.boardName}
              onChange={formik.handleChange}
              error={
                formik.touched.boardName && Boolean(formik.errors.boardName)
              }
              helperText={formik.touched.boardName && formik.errors.boardName}
              id="boardName"
              label="Board Name"
              autoFocus
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              type="number"
              id="totalGroup"
              label="Total Group"
              name="totalGroup"
              value={formik.values.totalGroup}
              onChange={formik.handleChange}
              error={
                formik.touched.totalGroup && Boolean(formik.errors.totalGroup)
              }
              helperText={formik.touched.totalGroup && formik.errors.totalGroup}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="tag"
              label="Tag Name"
              name="tag"
              value={formik.values.tag}
              onChange={formik.handleChange}
              error={formik.touched.tag && Boolean(formik.errors.tag)}
              helperText={formik.touched.tag && formik.errors.tag}
              autoComplete="tag"
            />
          </Grid>
        </Grid>
        {formik.values.choices.map((choice) => (
          <Box
            key={choice}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            px={1}
            my={1}
            borderRadius={1}
            style={{ backgroundColor: "#00000014" }}
          >
            {choice}
            <IconButton
              aria-label="delete"
              color="primary"
              onClick={() => removeChoiceItem(choice)}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        ))}
        <Button
          fullWidth
          startIcon={<AddIcon />}
          variant="text"
          sx={{ mt: 1, mb: 1 }}
          onClick={() => setModalOpen(true)}
        >
          Add choice for this tag
        </Button>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Submit
        </Button>
      </Box>
      <AddChoiceModal
        isOpen={isModalOpen}
        onAddChoice={(newChoice: string) => {
          if (
            !newChoice ||
            formik.values.choices.findIndex((val) => val === newChoice) !== -1
          )
            return;
          formik.setFieldValue("choices", [
            ...formik.values.choices,
            newChoice,
          ]);
        }}
        onClose={() => setModalOpen(false)}
      />
    </Container>
  );
};

export default CreateBoardForm;
