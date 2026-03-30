import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import MuiLink from "@mui/material/Link";
import Snackbar from "@mui/material/Snackbar";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { Formik, Form } from "formik";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";
import * as Yup from "yup";

const validationSchema = Yup.object({
  username: Yup.string().required("Username is required."),
  password: Yup.string().required("Password is required."),
});

const fieldSx = {
  "& .MuiOutlinedInput-root": { borderRadius: "8px", fontSize: "0.875rem" },
  "& .MuiInputLabel-root": { fontSize: "0.8125rem" },
};

export default function LoginForm() {
  const router = useRouter();
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });

  async function handleSubmit(
    values: { username: string; password: string; rememberMe: boolean },
    { setSubmitting }: any
  ) {
    const response = await signIn("credentials", {
      username: values.username,
      password: values.password,
      remember: values.rememberMe,
      redirect: false,
    });

    if (response?.error) {
      setSnackbar({
        open: true,
        message: "Login failed. Your credentials do not match.",
        severity: "error",
      });
    } else {
      setSnackbar({
        open: true,
        message: "Login successful. Redirecting…",
        severity: "success",
      });
      router.push("/");
      router.refresh();
    }

    setSubmitting(false);
  }

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 52px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
      }}
    >
      <Box sx={{ width: "100%", maxWidth: 360 }}>
        <Typography
          sx={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "1.75rem",
            fontWeight: 400,
            color: "text.primary",
            mb: 0.75,
          }}
        >
          Sign in
        </Typography>
        <Typography sx={{ fontSize: "0.8125rem", color: "text.disabled", mb: 4 }}>
          Welcome back to Savry.
        </Typography>

        <Formik
          initialValues={{ username: "", password: "", rememberMe: false }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, errors, touched, handleChange, handleBlur, values }) => (
            <Form>
              <TextField
                autoFocus
                fullWidth
                error={touched.username && !!errors.username}
                helperText={touched.username && errors.username}
                id="username"
                label="Username"
                name="username"
                sx={{ ...fieldSx, mb: 1.5 }}
                value={values.username}
                variant="outlined"
                onBlur={handleBlur}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                autoComplete="current-password"
                error={touched.password && !!errors.password}
                helperText={touched.password && errors.password}
                id="password"
                label="Password"
                name="password"
                sx={{ ...fieldSx, mb: 1 }}
                type="password"
                value={values.password}
                variant="outlined"
                onBlur={handleBlur}
                onChange={handleChange}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={values.rememberMe}
                    name="rememberMe"
                    size="small"
                    sx={{
                      color: "rgba(255,255,255,0.2)",
                      "&.Mui-checked": { color: "primary.main" },
                    }}
                    onChange={handleChange}
                  />
                }
                label={
                  <Typography sx={{ fontSize: "0.8125rem", color: "text.secondary" }}>
                    Remember me
                  </Typography>
                }
                sx={{ mb: 2.5 }}
              />
              <Button
                fullWidth
                disabled={isSubmitting}
                sx={{ borderRadius: "8px", py: 1, mb: 2 }}
                type="submit"
                variant="contained"
              >
                {isSubmitting ? "Signing in…" : "Sign in"}
              </Button>
              <Typography
                sx={{
                  fontSize: "0.8125rem",
                  color: "text.disabled",
                  textAlign: "center",
                }}
              >
                No account?{" "}
                <MuiLink
                  component={NextLink}
                  href="/register"
                  sx={{ color: "primary.main" }}
                  underline="hover"
                >
                  Register here
                </MuiLink>
              </Typography>
            </Form>
          )}
        </Formik>
      </Box>

      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        autoHideDuration={5000}
        open={snackbar.open}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
      >
        <Alert
          severity={snackbar.severity}
          sx={{ borderRadius: "8px" }}
          variant="filled"
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
