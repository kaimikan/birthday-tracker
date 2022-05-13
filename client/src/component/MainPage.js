import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import apiAddress from "../globals/apiAddress";
import axios from "axios";

const MainPage = () => {
  const [birthdaysState, setBirthdaysState] = useState([]);
  useEffect(() => {
    getBirthdays();
  }, []);

  const getBirthdays = async () => {
    await axios
      .get(`${apiAddress}`)
      .then((res) => {
        console.log(res.data);
        setBirthdaysState(res.data);
        birthdaysState.map((birthday) => {
          console.log(birthday.person);
        });
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

    let bdays = [...birthdaysState];
    let bday;

    let updatedBirthdays = birthdaysState;
    // TODO update state so client is dynamically update
    birthdaysState.forEach((bday, index) => {
      if (bday._id === id) {
        bday = { ...bdays[index] };
        bday.person = birthday.person;
        bday.date = birthday.date;
        bday.category = birthday.category;
        bday.status = birthday.status;
        bdays[index] = bday;
        /* console.log("before" + updatedBirthdays[index].person);
        console.log("founbd a amtch for" + bday.person);
        updatedBirthdays[index] = birthday;
        console.log("after" + updatedBirthdays[index].person); */
      }
    });
    setBirthdaysState(bdays);
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
        <h1>asdasd</h1>
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
            >
              <input
                type="text"
                name="id"
                style={{ display: "none" }}
                placeholder="ID"
                value={birthday._id}
                readOnly
              />
              <input type="text" name="person" placeholder="Name" />
              <input type="date" name="date" />
              <select name="category">
                <option value="family">Family</option>
                <option value="friend">Friend</option>
                <option value="other">Other</option>
              </select>
              <input type="number" name="status" placeholder="Status" />
              <button type="submit">Edit Birthday</button>
            </form>
          </li>
        ))}
      </ul>
      <form onSubmit={addBirthday} method="post">
        <input type="text" name="person" placeholder="Name" />
        <input type="date" name="date" />
        <select name="category">
          <option value="family">Family</option>
          <option value="friend">Friend</option>
          <option value="other">Other</option>
        </select>
        <button type="submit">Add Birthday</button>
      </form>
    </>
  );
};

export default MainPage;
