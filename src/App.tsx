import React, { useEffect, useState } from "react";
import { Amplify } from "aws-amplify";
import { awsExports } from "./aws-export";
import { Authenticator } from "@aws-amplify/ui-react";
import { Auth } from "aws-amplify";
import "@aws-amplify/ui-react/styles.css";

Amplify.configure({
  Auth: {
    region: awsExports.REGION,
    userPoolId: awsExports.USER_POOL_ID,
    userPoolWebClientId: awsExports.USER_POOL_CLIENT_ID,
  },
});

function App() {
  const [jwtToken, setJwtToken] = useState("");

  useEffect(() => {
    fetchJwtToken();
  }, []);

  const fetchJwtToken = async () => {
    try {
      const session = await Auth.currentSession();
      const token = session.getIdToken().getJwtToken();
      setJwtToken(token);
    } catch (error) {
      console.error("Error fetching JWT token:", error);
    }
  };

  return (
    <Authenticator
      initialState="signIn"
      components={{
        SignUp: {
          FormFields() {
            return (
              <>
                <Authenticator.SignUp.FormFields />

                {/* Custom fields for given_name and family_name */}
                <div>
                  <label>First name</label>
                </div>
                <input
                  type="text"
                  name="given_name"
                  placeholder="Please enter your first name"
                />
                <div>
                  <label>Last name</label>
                </div>
                <input
                  type="text"
                  name="family_name"
                  placeholder="Please enter your last name"
                />
                <div>
                  <label>Email</label>
                </div>
                <input
                  type="text"
                  name="email"
                  placeholder="Please enter a valid email"
                />
              </>
            );
          },
        },
      }}
      services={{
        async validateCustomSignUp(formData): Promise<any> {
          if (!formData.given_name) {
            return {
              given_name: "First Name is required",
            };
          }
          if (!formData.family_name) {
            return {
              family_name: "Last Name is required",
            };
          }
          if (!formData.email) {
            return {
              email: "Email is required",
            };
          }
        },
      }}
    >
      {({ signOut, user }) => (
        <div>
          <p>welcome {user?.username}</p>
          <button onClick={signOut}>sign out</button>
          <h4>Your JWT Token is: {jwtToken}</h4>
        </div>
      )}
    </Authenticator>
  );
}

export default App;
