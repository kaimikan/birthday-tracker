import React, { useEffect, useState } from "react";
import apiAddress from "../globals/apiAddress";
import axios from "axios";
import Select from "react-select";

const MainPage = () => {
  const [birthdaysState, setBirthdaysState] = useState([]);
  const options = [
    { value: "family", label: "family" },
    { value: "friend", label: "friend" },
    { value: "other", label: "other" },
  ];
  useEffect(() => {
    getBirthdays();
  }, []);

  const getBirthdays = async () => {
    await axios
      .get(`${apiAddress}`)
      .then((res) => {
        console.log(res.data);
        setBirthdaysState(res.data);
        birthdaysState.forEach((birthday) => console.log(birthday.person));
      })
      .catch((err) => console.log(err));
  };

  const addBirthday = async (e) => {
    e.preventDefault();
    const birthday = {
      person: e.target.person.value,
      date: e.target.date.value,
      category: e.target.category.value,
      status: 0,
    };
    console.log(birthday);
    setBirthdaysState([...birthdaysState, birthday]);
    await axios
      .post(`${apiAddress}`, birthday)
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  };

  const toggleAddForm = () => {
    var editForm = document.getElementById("add_form");
    if (editForm.style.display === "none") {
      editForm.style.display = "block";
    } else {
      editForm.style.display = "none";
    }
  };

  const toggleEditForm = (id) => {
    var editForm = document.getElementById("form_" + id);
    if (editForm.style.display === "none") {
      editForm.style.display = "block";
    } else {
      editForm.style.display = "none";
    }
  };

  const еditBirthday = async (e) => {
    e.preventDefault();
    const id = e.target.id.value;
    console.log(id);
    const birthday = {
      person: e.target.person.value,
      date: e.target.date.value,
      category: e.target.category.value,
      status: e.target.status.value,
    };
    console.log(e.target.category.value);

    let bdays = [...birthdaysState];

    birthdaysState.forEach((bday, index) => {
      if (bday._id === id) {
        bday = { ...bdays[index] };
        bday.person = birthday.person;
        bday.date = birthday.date;
        bday.category = birthday.category;
        bday.status = birthday.status;
        bdays[index] = bday;
      }
    });
    setBirthdaysState(bdays);
    console.log("did it change state??? ", birthdaysState);
    toggleEditForm(id);
    await axios
      .put(`${apiAddress}/${id}`, birthday)
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  };

  const removeBirthday = async (id) => {
    console.log(id);
    let updatedBirthdays = birthdaysState.filter(
      (birthday) => birthday._id !== id
    );
    setBirthdaysState(updatedBirthdays);
    await axios
      .delete(`${apiAddress}/${id}`)
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  };

  return (
    <>
      <ul>
        <h1>
          Birthdays/Events <button onClick={toggleAddForm}>+</button>
        </h1>
        <form
          id="add_form"
          onSubmit={addBirthday}
          style={{ display: "none" }}
          method="post"
        >
          <input type="text" name="person" placeholder="Name" />
          <input type="date" name="date" />
          <Select name="category" placeholder="Category..." options={options} />
          <button type="submit">Add Birthday</button>
        </form>
        {birthdaysState.map((birthday) => (
          <li key={birthday._id}>
            {birthday.person} {birthday.date} {birthday.category}{" "}
            <button
              key={`removebtn_${birthday._id}`}
              onClick={() => {
                removeBirthday(birthday._id);
              }}
            >
              X
            </button>
            <button
              key={`editbtn_${birthday._id}`}
              onClick={() => {
                toggleEditForm(birthday._id);
              }}
            >
              ~
            </button>
            <form
              onSubmit={еditBirthday}
              method="put"
              id={`form_${birthday._id}`}
              key={`formkey_${birthday._id}`}
              style={{ display: "none" }}
              defaultValue={{
                label: birthday.category,
                value: birthday.category,
              }}
            >
              <input
                type="text"
                name="id"
                style={{ display: "none" }}
                placeholder="ID"
                value={birthday._id}
                readOnly
              />
              <input
                type="text"
                name="person"
                placeholder="Name"
                defaultValue={birthday.person}
              />
              <input
                type="date"
                name="date"
                defaultValue={birthday.date.substr(0, 10)}
              />
              <Select
                name="category"
                placeholder="Category..."
                defaultValue={{
                  value: birthday.category,
                  label: birthday.category,
                }}
                options={options}
              />
              <input
                type="number"
                name="status"
                placeholder="Status"
                defaultValue={birthday.status}
              />
              <button type="submit">Edit Birthday</button>
            </form>
          </li>
        ))}
      </ul>
    </>
  );
};

export default MainPage;
