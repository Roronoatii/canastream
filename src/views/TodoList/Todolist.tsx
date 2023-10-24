import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import AddTodo from "../../components/AddTodo";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";

export default function CheckboxListWithForm() {
  const [checked, setChecked] = React.useState([1]);
  const [inputValue, setInputValue] = React.useState("");
  const [items, setItems] = React.useState([] as string[]);

  const handleToggle = (value: number) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleAddItem = () => {
    if (inputValue.trim() !== "") {
      setItems([...items, inputValue]);
      setInputValue("");
    }
  };

  return (
    <Stack
      spacing={2}
      direction="column"
      alignItems="center"
      justifyContent="center"
    >
      <Stack>
        <AddTodo
          inputValue={inputValue}
          handleInputChange={handleInputChange}
          handleAddItem={handleAddItem}
        />
      </Stack>
      <Stack spacing={2} divider={<Divider orientation="vertical" flexItem />}>
        <List
          dense
          sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
        >
          {items.map((item, index) => {
            const labelId = `checkbox-list-secondary-label-${index}`;
            return (
              <ListItem
                key={index}
                secondaryAction={
                  <Checkbox
                    edge="end"
                    onChange={handleToggle(index)}
                    checked={checked.indexOf(index) !== -1}
                    inputProps={{ "aria-labelledby": labelId }}
                  />
                }
                disablePadding
              >
                <ListItemButton>
                  <ListItemText id={labelId} primary={item} />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Stack>
    </Stack>
  );
}
