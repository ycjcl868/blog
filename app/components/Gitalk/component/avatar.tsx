import { useState } from "react";
import { Image } from "@udisc/remix-image";
import GithubSVG from "../assets/icon/github.svg";

const Avatar = ({ src, className, alt, defaultSrc = GithubSVG }) => {
  const [imgSrc, setImageSrc] = useState(src || defaultSrc);
  return (
    <div className={`gt-avatar ${className}`}>
      <Image
        src={imgSrc}
        alt={`@${alt}`}
        placeholder="blur"
        responsive={[
          {
            size: {
              width: 50,
              height: 50,
            },
          },
        ]}
        onError={() => setImageSrc(defaultSrc)}
      />
    </div>
  );
};

export default Avatar;
