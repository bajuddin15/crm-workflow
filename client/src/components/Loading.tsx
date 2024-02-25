import { ColorRing } from "react-loader-spinner";

interface IProps {
  bgColor: string;
  size?: string;
}

const Loading: React.FC<IProps> = ({ bgColor = "#fff", size = "30" }) => {
  return (
    <>
      <ColorRing
        visible={true}
        height={size}
        width={size}
        ariaLabel="color-ring-loading"
        wrapperStyle={{}}
        wrapperClass="color-ring-wrapper"
        colors={[bgColor, bgColor, bgColor, bgColor, bgColor]}
      />
    </>
  );
};

export default Loading;
