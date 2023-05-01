import React, { useState } from "react";
import { Header } from "@/components/HeaderComponent";
import { Footer } from "@/components/FooterComponent";
import { Select, TextField, InputLabel, MenuItem } from "@mui/material";
import { Button, FormControl, SelectChangeEvent } from "@mui/material";
import { FadeLoading } from "@/components/Spinners";
import { motion } from "framer-motion";
import { CreateUser, defaultCreateUser, CreateAccount as CreateAccountClass } from "@/models/CreateAccount";
import { useRouter } from "next/router";
import styles from "@/styles/CreateAccount.module.css";

const CreateAccount = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [dataURL, setDataURL] = useState<string | null>(null);
  const [data, setData] = useState<CreateUser>(defaultCreateUser);
  const router = useRouter();

  const onFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.name;
    const value = event.target.value;
    setData({ ...data, [name]: value });
  };

  const submitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    setLoading(true);
    event.preventDefault();
    let formData = new FormData();
    const jsonData = { ...data, name: `${data.first_name} ${data.last_name}` };
    formData = CreateAccountClass.insertIsDoctor(jsonData);
    formData.append("profile_picture", dataURL ? dataURL : "");
    setLoading(true);
    const id = await CreateAccountClass.createUserRequest(formData);
    const date = new Date();
    const today = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    const time = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    try {
      const specializedUser = await CreateAccountClass.createSpecializedUser(data, id, today, time);
    } catch (err: any) {}
    setLoading(false);
    router.push("/Login");
  };

  const onFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target !== null && event.target.files !== null) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = function (event) {
        const base64 = event.target?.result;
        setDataURL(base64 as string);
      };
      reader.readAsDataURL(file);
    }
  };
  return (
    <div>
      <div className={styles.body}>
        <Header />
        <div className={styles.box}>
          <div style={{ position: "relative", alignContent: "center" }}>
            <motion.div
              animate={{
                opacity: loading ? 0.7 : 1,
              }}
              initial={{
                opacity: 0,
              }}
              transition={{
                duration: 2,
              }}
              style={{ zIndex: loading ? "-1" : "1" }}
            >
              <form onSubmit={submitHandler}>
                <div className={styles.formDiv}>
                  <div className={styles.inputs}>
                    <TextField
                      disabled={loading}
                      className={styles.input}
                      label="First name"
                      type="text"
                      name="first_name"
                      value={data.first_name}
                      onChange={onFieldChange}
                    />
                    <TextField
                      disabled={loading}
                      className={styles.input}
                      label="last name"
                      type="text"
                      name="last_name"
                      value={data.last_name}
                      onChange={onFieldChange}
                    />
                    <TextField
                      disabled={loading}
                      className={styles.input}
                      label="Username"
                      type="text"
                      name="username"
                      value={data.username}
                      onChange={onFieldChange}
                    />
                    <TextField
                      disabled={loading}
                      className={styles.input}
                      label="Email"
                      type="email"
                      name="email"
                      value={data.email}
                      onChange={onFieldChange}
                    />
                    <TextField
                      disabled={loading}
                      label="Phone"
                      type="phone"
                      name="phone"
                      value={data.phone}
                      onChange={onFieldChange}
                    />
                  </div>
                  <div className={styles.inputs}>
                    <TextField
                      disabled={loading}
                      className={styles.input}
                      type="Date"
                      label="Date of birth"
                      inputProps={{ min: 0 }}
                      InputLabelProps={{ shrink: true }}
                      name="dob"
                      value={data.dob}
                      onChange={onFieldChange}
                    />
                    <FormControl variant="outlined" className={styles.input}>
                      <InputLabel id="gender-input">Gender</InputLabel>
                      <Select
                        disabled={loading}
                        id="gender-input"
                        label="Gender"
                        name="gender"
                        value={data.gender}
                        onChange={(event: SelectChangeEvent<string>) => {
                          const name = "gender";
                          const value = event.target.value;
                          setData({ ...data, [name]: value });
                        }}
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        <MenuItem value="0">Male</MenuItem>
                        <MenuItem value="1">Female</MenuItem>
                        <MenuItem value="2">Transgender</MenuItem>
                      </Select>
                    </FormControl>
                    <TextField
                      disabled={loading}
                      className={styles.input}
                      label="password"
                      type="password"
                      name="password"
                      value={data.password}
                      onChange={onFieldChange}
                    />
                    <FormControl variant="outlined" className={styles.input}>
                      <InputLabel id="user-type">User Type</InputLabel>
                      <Select
                        disabled={loading}
                        id="user-type"
                        label="User Type"
                        value={data.userType}
                        name="userType"
                        onChange={(event: SelectChangeEvent<string>) => {
                          const name = "userType";
                          const value = event.target.value;
                          setData({ ...data, [name]: value });
                        }}
                      >
                        <MenuItem value="doctor">Doctor</MenuItem>
                        <MenuItem value="patient">Patient</MenuItem>
                      </Select>
                    </FormControl>
                    <TextField disabled={loading} type="file" onChange={onFileUpload} />
                  </div>
                </div>
                <Button
                  disabled={loading}
                  variant="contained"
                  type="submit"
                  size="large"
                  sx={{ margin: "auto", width: "15vw", marginTop: "1vh" }}
                >
                  Sign up
                </Button>
              </form>
            </motion.div>

            {loading ? (
              <div
                style={{
                  zIndex: "10000",
                  opacity: "0.9",
                  left: "47%",
                  top: "30%",
                  position: "absolute",
                }}
              >
                <FadeLoading />
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CreateAccount;
