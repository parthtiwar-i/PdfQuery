import { atom } from "recoil";
export const fileAtom = atom({
  key: "fileAtom",
  default: "",
});

export const chatAtom = atom({
  key: "chatAtom",
  default: [{ chat: "Ask your query", img: "ai" }],
});
