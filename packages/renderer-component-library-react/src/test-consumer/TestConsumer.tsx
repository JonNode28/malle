import React from "react";
import { atom, useRecoilState } from "recoil";

const someAtom = atom({
  key: 'somet',
  default: 'yo!'
})

export default function TestConsumer(){
  const [ someState, setSomeState ] = useRecoilState(someAtom);
  return (
    <div>{someState}</div>
  )
}