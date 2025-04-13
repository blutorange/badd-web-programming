import React from "react";

interface UserItemProps {
  age: number;
  name: string;
  curriculum?: string;
  religion?: string;
}

export function App() {
  return <div>
    <UserItem />

    <UserItem age="50" />
    
    <UserItem age={50} name="Bram Stoker" />
  </div>
}

export function UserItem(props: UserItemProps) {
  return <ul>
    <li>age: {props.age}</li>
    <li>name: {props.name}</li>
    {props.curriculum && <li>curriculum: {props.curriculum}</li>}
    {props.religion && <li>religion: {props.religion}</li>}
  </ul>;
}

