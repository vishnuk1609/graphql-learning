import "./App.css";
import { useQuery, gql } from "@apollo/client";

const QUERY = gql`
  query getData {
    getTodos {
      id
      title
      user {
        email
        name
        phone
      }
    }
  }
`;

function App() {
  const { loading, error, data } = useQuery(QUERY);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      <h1>Todos</h1>
      <div>
        {data &&
          data.getTodos.map((todo) => (
            <div key={todo.id}>
              <p>
                {todo.title} -- <span>{todo?.user?.name}</span>
              </p>
            </div>
          ))}
      </div>
    </>
  );
}

export default App;
