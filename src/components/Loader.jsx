import { MutatingDots } from "react-loader-spinner";
import css from "../styles/Loader.module.css";

const Loader = () => {
  return (
    <div className={css.loader}>
      <MutatingDots
        visible={true}
        height="100"
        width="100"
        color="#0044cc"
        secondaryColor=" #9a29cc"
        radius="12.5"
        ariaLabel="mutating-dots-loading"
        wrapperStyle={{}}
        wrapperClass=""
      />
    </div>
  );
};

export default Loader;
