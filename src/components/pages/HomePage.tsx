import BaseTemplate from "../templates/BaseTemplate";

interface HomePageProps {}

const HomePage = (props: HomePageProps) => {
  return (
    <BaseTemplate>
      <div>
        <h1>Home Page</h1>
      </div>
    </BaseTemplate>
  );
};

export default HomePage;
