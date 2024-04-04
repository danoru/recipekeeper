import Head from "next/head";
import { getAllUsers } from "../../src/data/users";
import { USER_LIST_TYPE } from "../../src/types";

interface Props {
  users: USER_LIST_TYPE[];
}

function Members(props: Props) {
  const { users } = props;

  return (
    <div>
      <Head>
        <title>Members • Savry</title>
      </Head>
      <div>
        <h2>Food lovers, critics and friends — find popular members.</h2>
      </div>
      <div>
        {users.map((user) => (
          <p key={user.username}>{user.username}</p>
        ))}
      </div>
    </div>
  );
}

export async function getStaticProps() {
  const users = getAllUsers();

  return {
    props: {
      users,
    },
    revalidate: 1800,
  };
}

export default Members;
