import React from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Switch from "@mui/material/Switch";
import Stack from "@mui/material/Stack";

interface AddTodoProps {
  inputValue: string;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleAddItem: () => void;
}

const AddTodo: React.FC<AddTodoProps> = ({
  inputValue,
  handleInputChange,
  handleAddItem,
}) => {
  return (
    <Stack>
      <TextField
        id="outlined-basic"
        label="Add Item"
        variant="filled"
        value={inputValue}
        onChange={handleInputChange}
      />
      <Button variant="contained" color="primary" onClick={handleAddItem}>
        Add
      </Button>
    </Stack>
  );
};

export default AddTodo;
