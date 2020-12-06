import Axios from "axios";
import React, { useState, useEffect } from "react";
import Employee from "./Employee";
import axios from "axios";

export default function EmployeeList() {
  const [employeeList, setEmployeeList] = useState([]);
  const [recordForEdit, setRecordForEdit] = useState(null);

  useEffect(() => {
    refreshEmployeeList();
  }, []);

  const employeeAPI = (url = "https://localhost:44346/api/Employee") => {
    return {
      fetchAll: () => axios.get(url),
      create: (newrecord) => axios.post(url, newrecord),
      update: (id, updateRecord) => axios.put(url + id, updateRecord),
      delete: (id) => axios.delete(url + id),
    };
  };

  function refreshEmployeeList() {
    employeeAPI()
      .fetchAll()
      .then((res) => setEmployeeList(res.data))
      .catch((err) => console.log(err));
  }

  //รับ image data from Employee.js
  const addOrEdit = (formData, onSuccess) => {
    if (formData.get("employeeId") == "0")
      employeeAPI()
        .create(formData)
        .then((res) => {
          onSuccess();
          refreshEmployeeList();
        })
        .catch((err) => console.log(err));
    else
      employeeAPI()
        .update(formData.get("employeeId"), formData)
        .then((res) => {
          onSuccess();
          refreshEmployeeList();
        })
        .catch((err) => console.log(err));
  };

  const showRecordDetails = (data) => {
    setRecordForEdit(data);
  };

  const imageCard = (data) => (
    <div
      className="card"
      onClick={() => {
        showRecordDetails(data);
      }}
    >
      <img src={data.imageSrc} className="card-img-top rounded-circle"></img>
      <div className="card-body">
        <h5>{data.employeeName}</h5>
        <span>{data.occupation}</span>
      </div>
    </div>
  );

  return (
    <div className="row">
      <div className="col-md-12">
        <div className="jumbotron jumbotron-fluid py-4">
          <div className="container text-center">
            <h1 className="display-4">Employee Register</h1>
          </div>
        </div>
      </div>
      <div className="col-md-4">
        <Employee
          addOrEdit={addOrEdit}
          recordForEdit={recordForEdit}
        ></Employee>
      </div>
      <div className="col-md-8">
        <table>
          <tbody>
            {
              //tr > 3 td
              [...Array(Math.ceil(employeeList.length / 3))].map((e, i) => (
                <tr key={i}>
                  <td>{imageCard(employeeList[3 * i])}</td>
                  <td>
                    {employeeList[3 * i + 1]
                      ? imageCard(employeeList[3 * i + 1])
                      : null}
                  </td>
                  <td>
                    {employeeList[3 * i + 2]
                      ? imageCard(employeeList[3 * i + 2])
                      : null}
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </div>
  );
}