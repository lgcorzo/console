// This file is part of MinIO Console Server
// Copyright (c) 2022 MinIO, Inc.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

import React, { Fragment } from "react";
import {
  Box,
  Button,
  Grid,
  InputBox,
  KeyIcon,
  LockFilledIcon,
  ProgressBar,
  UserFilledIcon,
} from "mds";
import { setAccessKey, setSecretKey } from "./loginSlice";

import { AppState, useAppDispatch } from "../../store";
import { useSelector } from "react-redux";
import { doLoginAsync } from "./loginThunks";
import { RedirectRule } from "api/consoleApi";

const StrategyForm = ({ redirectRules }: { redirectRules: RedirectRule[] }) => {
  const dispatch = useAppDispatch();

  const accessKey = useSelector((state: AppState) => state.login.accessKey);
  const secretKey = useSelector((state: AppState) => state.login.secretKey);

  const loginSending = useSelector(
    (state: AppState) => state.login.loginSending,
  );

  const formSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(doLoginAsync());
  };

  return (
    <React.Fragment>
      <form noValidate onSubmit={formSubmit} style={{ width: "100%" }}>
        <Fragment>
          <Grid
            container
            sx={{
              marginTop: redirectRules.length > 0 ? 55 : 0,
            }}
          >
            <Grid item xs={12} sx={{ marginBottom: 14 }}>
              <InputBox
                fullWidth
                id="accessKey"
                value={accessKey}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  dispatch(setAccessKey(e.target.value))
                }
                placeholder={"Username"}
                name="accessKey"
                autoComplete="username"
                disabled={loginSending}
                startIcon={<UserFilledIcon />}
              />
            </Grid>
            <Grid item xs={12}>
              <InputBox
                fullWidth
                value={secretKey}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  dispatch(setSecretKey(e.target.value))
                }
                name="secretKey"
                type="password"
                id="secretKey"
                autoComplete="current-password"
                disabled={loginSending}
                placeholder={"Password"}
                startIcon={<LockFilledIcon />}
              />
            </Grid>
          </Grid>

          <Grid
            item
            xs={12}
            sx={{
              textAlign: "right",
              marginTop: 30,
            }}
          >
            <Button
              type="submit"
              variant="callAction"
              color="primary"
              id="do-login"
              disabled={accessKey === "" || secretKey === "" || loginSending}
              label={"Login"}
              sx={{
                margin: "30px 0px 8px",
                height: 40,
                width: "100%",
                boxShadow: "none",
                padding: "16px 30px",
              }}
              fullWidth
            />
          </Grid>
          <Grid
            item
            xs={12}
            sx={{
              height: 10,
            }}
          >
            {loginSending && <ProgressBar />}
          </Grid>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              margin: "24px 0 20px",
              textAlign: "center",
              "&::before, &::after": {
                content: '""',
                flex: 1,
                borderBottom: "1px solid #3d4a5d",
              },
              "& span": {
                margin: "0 12px",
                color: "#7e8b9b",
                fontSize: 12,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                fontWeight: 600,
              },
            }}
          >
            <span>OR</span>
          </Box>

          <Grid item xs={12}>
            {redirectRules && redirectRules.length > 0 ? (
              redirectRules.map((rule, idx) => (
                <Button
                  key={idx}
                  type="button"
                  variant="secondary"
                  color="primary"
                  id={`sso-login-${idx}`}
                  disabled={loginSending}
                  label={rule.displayName || "Log in with SSO"}
                  icon={<KeyIcon />}
                  iconLocation="start"
                  onClick={() => {
                    if (rule.redirect) {
                      window.location.href = rule.redirect;
                    }
                  }}
                  sx={{
                    height: 40,
                    width: "100%",
                    boxShadow: "none",
                    padding: "16px 30px",
                    marginBottom: 8,
                  }}
                  fullWidth
                />
              ))
            ) : (
              <Button
                type="button"
                variant="secondary"
                color="primary"
                id="sso-login"
                disabled={loginSending}
                label={"Log in with SSO (Keycloak)"}
                icon={<KeyIcon />}
                iconLocation="start"
                onClick={() => {
                  window.location.href = "/oauth2/start?rd=/browser";
                }}
                sx={{
                  height: 40,
                  width: "100%",
                  boxShadow: "none",
                  padding: "16px 30px",
                }}
                fullWidth
              />
            )}
          </Grid>
        </Fragment>
      </form>
    </React.Fragment>
  );
};

export default StrategyForm;
