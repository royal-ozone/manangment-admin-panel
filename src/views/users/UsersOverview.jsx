import {
  CCol,
  CForm,
  CFormInput,
  CRow,
  CTooltip,
  CButton,
  CFormSelect,
  CFormLabel,
} from "@coreui/react";
import React, { useState, useEffect } from "react";
import { connect, useSelector } from "react-redux";
import FilterCard from "src/components/FilterCard";
import Table from "src/components/Table";
import {
  getUsersHandler,
  updateProfileHandler,
  updateUserHandler,
} from "../../store/user";
import CIcon from "@coreui/icons-react";
import { cilTrash, cilSearch, cilFilterX } from "@coreui/icons";
import EditableCell from "src/components/EditableCell";

export const UsersOverview = ({
  getUsersHandler,
  updateProfileHandler,
  updateUserHandler,
}) => {
  const { count, data } = useSelector((state) => state.user);
  const [params, setParams] = useState({ limit: 10, offset: 0 });
  // const Verified =  data => data.Verified ? <span>yes</span>: <span>no</span>

  const [loading, setLoading] = useState(false);
  const columns = [
    {
      header: "first name",
      field: "first_name",
      body: (data) => (
        <EditableCell
          data={data}
          field="first_name"
          action={updateProfileHandler}
        />
      ),
    },
    {
      header: "last name",
      field: "last_name",
      body: (data) => (
        <EditableCell
          data={data}
          field="last_name"
          action={updateProfileHandler}
        />
      ),
    },
    ,
    {
      header: "email",
      field: "email",
      body: (data) => (
        <EditableCell
          data={{ ...data }}
          field="email"
          action={updateUserHandler}
        />
      ),
    },
    {
      header: "mobile number",
      field: "mobile",
      body: (data) => (
        <EditableCell
          data={{ ...data }}
          field="mobile"
          action={updateUserHandler}
        />
      ),
    },
    {
      header: "account status",
      field: "status",
      body: (data) => (
        <EditableCell
          data={data}
          field="status"
          type="dropdown"
          options={[
            { name: "activate", value: "active" },
            { name: "ban", value: "banned" },
          ]}
          action={updateUserHandler}
        />
      ),
    },
    {
      header: "verified",
      field: "verified",
      body: (data) => (
        <EditableCell
          data={{ ...data }}
          field="verified"
          type="dropdown"
          options={[
            { name: "unverified", value: false },
            { name: "verified", value: true },
          ]}
          action={updateUserHandler}
        />
      ),
    },
  ];

  const submitHandler = (e) => {
    e.preventDefault();
    setLoading(true);
    let data = { limit: 10, offset: 0 };

    e.target.query.value && (data["query"] = e.target.query.value);
    e.target.status.value !== "false" &&
      (data["status"] = e.target.status.value);
    e.target.verified.value !== "" &&
      (data["verified"] = e.target.verified.value);

    setParams(data);
    getUsersHandler(data).then(() => setLoading(false));
  };
  const resetTable = (e) => {
    e.target.reset();
    setParams({ limit: 10, offset: 0 });
  };
  
  return (
    <>
      <FilterCard>
        <CForm onSubmit={submitHandler} onReset={resetTable}>
          <CRow xs={{ gutterY: 3 }} className="justify-content-center">
            <CCol xs={12}>
              <CFormInput
                placeholder="search by first name, last name, mobile or email"
                id="query"
              />
            </CCol>
            <CCol xs="auto">
              <CFormLabel htmlFor="status">status</CFormLabel>
              <CFormSelect name="status" id="status">
                <option value={false}>all</option>
                <option value="active">active</option>
                <option value="banned">banned</option>
                <option value="deactivated">deactivated</option>
              </CFormSelect>
            </CCol>
            <CCol xs="auto">
              <CFormLabel htmlFor="verified" id="verified">
                verified
              </CFormLabel>
              <CFormSelect name="verified">
                <option value="">all</option>
                <option value={true}>verified</option>
                <option value={false}>unverified</option>
              </CFormSelect>
            </CCol>
            <CCol xs={12}></CCol>
          </CRow>
          <CRow className="justify-content-center">
            <CCol xs="auto">
              <CTooltip content="search">
                <CButton type="submit">
                  <CIcon icon={cilSearch} />
                </CButton>
              </CTooltip>
            </CCol>
            <CCol xs="auto">
              <CTooltip content="clear filter">
                <CButton color="secondary" type="reset">
                  <CIcon icon={cilFilterX} />
                </CButton>
              </CTooltip>
            </CCol>
          </CRow>
        </CForm>
      </FilterCard>
      <Table
        params={params}
        count={count}
        data={data}
        changeData={getUsersHandler}
        columns={columns}
        loading={loading}
        updateParams={setParams}
        updateLoading={setLoading}
        cookieName='users'
      />
    </>
  );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {
  getUsersHandler,
  updateProfileHandler,
  updateUserHandler,
};

export default connect(mapStateToProps, mapDispatchToProps)(UsersOverview);
