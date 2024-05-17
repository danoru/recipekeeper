import Button from "@mui/material/Button";

function LoggedOutHomePage() {
  return (
    <main style={{ textAlign: "center" }}>
      <div>
        <div>
          <h2>Track recipes you&apos;ve made.</h2>
          <h2>Save those you want to eat.</h2>
          <h2>Tell your friends what&apos;s good.</h2>
        </div>
      </div>
      <Button variant="contained" href="/login">
        GET STARTED — IT&apos;S FREE!
      </Button>
      <p>The social network for food lovers. Not available anywhere else.</p>
    </main>
  );
}

export default LoggedOutHomePage;
