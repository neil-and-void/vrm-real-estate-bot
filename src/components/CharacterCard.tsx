"use client";

import Image, { StaticImageData } from "next/image";
import useSound from "use-sound";
import { useCreateChat } from "~/hooks/useCreateChat";
import { options } from "~/constant/metadata";
import { useRouter } from "next/navigation";

interface CharacterCardProps {
  name: string;
  age: number;
  currentAddress: string;
  job: string;
  salary: string;
  ethnicity: string;
  family: string;
  personality: string;
  image: StaticImageData;
  profileImg: StaticImageData;
  role: string;
}

export function CharacterCard(props: CharacterCardProps) {
  const [play, { stop }] = useSound("/sounds/card-hover.wav", { volume: 0.75 });
  const { mutate, isLoading } = useCreateChat();
  const router = useRouter();

  const handleClick = async () => {
    if (isLoading) return;
    const availableOptions = options.filter((option) => option.role === props.role);
    var randomOption = availableOptions[Math.floor(Math.random() * availableOptions.length)];
    const data = await mutate({ metadataId: randomOption.id, aiRole: props.role as "buyer" | "seller" | "tenant" });
    router.push(`/chat?chatId=${data._id}`);
  };

  return (
    <div
      onMouseEnter={() => play()}
      onMouseLeave={() => stop()}
      onClick={handleClick}
      style={{
        background: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${props.image.src})`,
        backgroundSize: "cover",
      }}
      className={`hover:cursor-pointer hover:scale-110 transition-transform group backdrop-brightness-50 relative h-[600px] w-[400px] p-4 flex flex-col items-center overflow-hidden rounded bg-white shadow-lg shadow-black`}
    >
      {isLoading ? (
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
          <span className="text-white text-2xl">Creating Chat...</span>
        </div>
      ) : null}
      <Image
        alt="profile-img"
        src={props.profileImg}
        className="h-[400px] w-full group-hover:h-[200px] group-hover:w-1/2 transition-[height_width]"
      />
      <h2 className="text-2xl pt-8 group-hover:pt-2">{props.name}</h2>
      <div className=" p-2 text-center hidden grid-cols-2 details group-hover:grid group-hover:h-96 h-0 w-full transition-[height]">
        <span>Age: {props.age}</span>
        <span>Job: {props.job}</span>
        <span>Salary: {props.salary}</span>
        <span>Ethnicity: {props.ethnicity}</span>
        <span className="col-span-2">Family: {props.family}</span>
        <span className="col-span-2">Address: {props.currentAddress}</span>
        <span className="col-span-2">Personality: {props.personality}</span>
      </div>
    </div>
  );
}
