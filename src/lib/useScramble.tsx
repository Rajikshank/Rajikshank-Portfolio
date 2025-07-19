import { useScramble } from "use-scramble";

type textScramble = {
  speed: number;
  text: string;
  textsize: string;
  font:string
};

export const TextScramble = ({ speed, text, textsize,font }: textScramble) => {
  const { ref } = useScramble({
    text: text,
    speed: speed,
  });

  return (
    <h1
      ref={ref}
      className={`${textsize}  font-semibold  ${font} text-orange-500`}
    />
  );
};
