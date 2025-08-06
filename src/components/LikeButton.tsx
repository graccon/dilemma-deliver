// components/LikeButton.tsx
import styled from "styled-components";

interface Props {
  liked: boolean;
  onClick: () => void;
  show?: boolean; // optional prop
}

export default function LikeButton({ liked, onClick, show = true }: Props) {
  if (!show) return null;

  return (
    <Icon
      src={
        liked
          ? "/assets/icons/good_active_icon.png"
          : "/assets/icons/good_inactive_icon.png"
      }
      onClick={onClick}
    />
  );
}

const Icon = styled.img`
  width: 36px;
  height: 36px;
  position: absolute;
  top: -2px;
  right: -12px;
`;