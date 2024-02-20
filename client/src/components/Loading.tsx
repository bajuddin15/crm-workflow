import { ColorRing } from "react-loader-spinner";

interface IProps {
  bgColor: string;
}

const Loading: React.FC<IProps> = ({ bgColor = "#fff" }) => {
  return (
    <>
      <ColorRing
        visible={true}
        height="30"
        width="30"
        ariaLabel="color-ring-loading"
        wrapperStyle={{}}
        wrapperClass="color-ring-wrapper"
        colors={[bgColor, bgColor, bgColor, bgColor, bgColor]}
      />
    </>
  );
};

export default Loading;
