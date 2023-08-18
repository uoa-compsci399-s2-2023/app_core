import React from "react";
import {Center} from "@gluestack-ui/react";

// Sets parent size to phone screen size and draw background. Base element for all screens.
export function Screen(props) {
  return (
    <Center bg='$white' h='100%' w='100%'>
      {props.children}
    </Center>
  );
}
