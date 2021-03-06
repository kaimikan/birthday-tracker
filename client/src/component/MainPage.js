import React, { useEffect, useState } from "react";
import apiAddress from "../globals/apiAddress";
import axios from "axios";
import Select from "react-select";

const MainPage = () => {
  const [birthdaysState, setBirthdaysState] = useState([]);
  const currentDate = new Date();
  const currentDateString = `${currentDate.getDate()}/${
    currentDate.getMonth() + 1
  }/${currentDate.getFullYear()}`;
  const [closestBirthdaysState, setClosestBirthdaysState] = useState([]);

  const options = [
    { value: "family", label: "family" },
    { value: "friend", label: "friend" },
    { value: "other", label: "other" },
  ];
  useEffect(() => {
    getBirthdays();
  }, []);

  const findClosestBirthday = (bdays) => {
    let closestBirthdayHolder = [];
    let closestDateHolder = new Date();
    closestDateHolder.setFullYear(0);
    closestDateHolder.setHours(0, 0, 0, 0);

    bdays.forEach((bday) => {
      let editedBday = new Date(bday.date);
      editedBday.setHours(0, 0, 0, 0);
      if (editedBday.getTime() > closestDateHolder.getTime()) {
        closestDateHolder = editedBday;
        closestBirthdayHolder = [];
        closestBirthdayHolder.push(bday);
      } else if (editedBday.getTime() === closestDateHolder.getTime()) {
        closestBirthdayHolder.push(bday);
      }
    });

    setClosestBirthdaysState(closestBirthdayHolder);
  };

  const sortBirthdaysByDate = (order = "asc", bdays = []) => {
    // order can be asc or desc
    let sortedBdays;
    bdays.length === 0
      ? (sortedBdays = [...birthdaysState])
      : (sortedBdays = [...bdays]);

    sortedBdays.sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    });
    if (order === "desc") sortedBdays.reverse();
    console.log(birthdaysState);
    console.log("sorted after ", order, sortedBdays);
    setBirthdaysState(sortedBdays);
    findClosestBirthday(sortedBdays);
  };

  const getBirthdays = async () => {
    await axios
      .get(`${apiAddress}`)
      .then((res) => {
        // remove time and timezone from date
        let shortDateBdays = [...res.data];
        let bday;
        shortDateBdays.forEach((birthday, index) => {
          bday = { ...shortDateBdays[index] };
          bday.date = birthday.date.substr(0, 10);
          shortDateBdays[index] = bday;
        });
        //console.log(res.data);
        sortBirthdaysByDate("asc", shortDateBdays);
        //birthdaysState.forEach((birthday) => console.log(birthday.person));
      })
      .catch((err) => console.log(err));
  };

  const addBirthday = async (e) => {
    e.preventDefault();
    let birthday = {
      person: e.target.person.value,
      date: e.target.date.value,
      category: e.target.category.value,
      status: 0,
      profilePic: e.target.image[0] || null,
    };

    await axios
      .post(`${apiAddress}`, birthday)
      .then((res) => {
        console.log(res);
        // add mongo id onto state array element so we can edit and remove without need for refresh
        birthday._id = res.data._id;

        console.log(birthday);
        sortBirthdaysByDate("asc", [...birthdaysState, birthday]);
        toggleAddForm();
      })
      .catch((err) => console.log(err));
  };

  const toggleAddForm = () => {
    var editForm = document.getElementById("add_form");
    if (editForm.style.display === "none") {
      editForm.style.display = "flex";
    } else {
      editForm.style.display = "none";
    }
  };

  const toggleEditForm = (id) => {
    var editForm = document.getElementById("form_" + id);
    if (editForm.style.display === "none") {
      editForm.style.display = "flex";
    } else {
      editForm.style.display = "none";
    }
  };

  const ??ditBirthday = async (e) => {
    e.preventDefault();
    const id = e.target.id.value;
    console.log(id);
    const birthday = {
      person: e.target.person.value,
      date: e.target.date.value,
      category: e.target.category.value,
      status: e.target.status.value,
      profilePic: e.target.image[0],
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
        bday.profilePic = birthday.profilePic;
        bdays[index] = bday;
      }
    });
    sortBirthdaysByDate("asc", bdays);
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
    findClosestBirthday(updatedBirthdays);
    await axios
      .delete(`${apiAddress}/${id}`)
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  };

  return (
    <>
      <div>
        <div className="page-header">
          <div className="content-container">
            <div className="page-header__content">
              <h3 className="page-header__title">
                <div>Today is: {currentDateString}</div>
              </h3>
              <div className="page-header__actions">
                <div>
                  <b>Closest </b>
                  {closestBirthdaysState.length > 1 ? (
                    <b>birthdays are</b>
                  ) : (
                    <b>birtday is</b>
                  )}
                  <b>:</b>{" "}
                  {closestBirthdaysState.map((bday) => (
                    <>
                      <div>
                        {bday.person} on {bday.date}
                      </div>
                    </>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ul>
        <div className="content-container page-header__content">
          <h1>
            Birthdays/Events{" "}
            <button className="button" onClick={toggleAddForm}>
              +
            </button>
          </h1>
          <div>
            sort:
            <button
              className="button"
              onClick={() => {
                sortBirthdaysByDate("asc");
              }}
            >
              asc
            </button>
            <button
              className="button"
              onClick={() => {
                sortBirthdaysByDate("desc");
              }}
            >
              desc
            </button>
          </div>
        </div>
        <form
          id="add_form"
          className="form content-container"
          onSubmit={addBirthday}
          style={{ display: "none" }}
          method="post"
        >
          <input
            className="text-input"
            type="text"
            name="person"
            placeholder="Name"
          />
          <input className="text-input" type="date" name="date" />
          <Select
            className="select"
            name="category"
            placeholder="Category..."
            options={options}
          />
          <input
            type="file"
            name="image"
            className="file-input  select-right-input"
          />
          <button className="button select-right-input" type="submit">
            Add
          </button>
        </form>
        {birthdaysState.map((birthday) => (
          <>
            {birthday.profilePic}
            <li key={birthday._id} className="list-item">
              <span>
                <img src="../../bdaycake.png" className="avatar" alt="avatar" />

                <b className="list-item__title">{birthday.person} </b>
              </span>
              <span className="list-item__subtitle">
                {birthday.date} {birthday.category}{" "}
              </span>
              <div>
                <button
                  className="button button--secondary"
                  key={`removebtn_${birthday._id}`}
                  onClick={() => {
                    removeBirthday(birthday._id);
                  }}
                >
                  X
                </button>
                <button
                  className="button button--secondary-2"
                  key={`editbtn_${birthday._id}`}
                  onClick={() => {
                    toggleEditForm(birthday._id);
                  }}
                >
                  ~
                </button>
              </div>
            </li>
            <form
              className="form content-container"
              onSubmit={??ditBirthday}
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
                className="text-input"
                style={{ display: "none" }}
                placeholder="ID"
                value={birthday._id}
                readOnly
              />
              <input
                type="text"
                name="person"
                className="text-input"
                placeholder="Name"
                defaultValue={birthday.person}
              />
              <input
                type="date"
                name="date"
                className="text-input"
                defaultValue={birthday.date.substr(0, 10)}
              />
              <Select
                name="category"
                className="select"
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
                className="text-input select-right-input"
                placeholder="Status"
                defaultValue={birthday.status}
              />
              <input type="file" name="image" className="file-input" />
              <button className="button button--secondary" type="submit">
                Edit
              </button>
            </form>
          </>
        ))}
      </ul>
    </>
  );
};

export default MainPage;
