import React from "react";
import {Button, Image, ButtonText} from "@gluestack-ui/react";

export function LoginButton(props) {

  const buttonStyle = {
    borderRadius: 0,
    borderColor: "#8C8C8C",
    borderWidth: 2,
    width: 250,
    height: 50,
    justifyContent: "flex-start"
  }

  return (
    <Button
      variant="outline"
      style={buttonStyle}
      gap={15}
    >
      <Image
        w={23}
        h={23}
        source={props.icon}
      />
      <ButtonText fontWeight="400" color="#8C8C8C" >{props.text}</ButtonText>
    </Button>
  );
}