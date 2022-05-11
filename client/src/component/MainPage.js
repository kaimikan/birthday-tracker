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
              onClick={() => {
                removeBirthday(birthday._id);
              }}
            >
              X
            </button>
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
