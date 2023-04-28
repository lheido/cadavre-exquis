import { createStore } from "solid-js/store";

const animals = [
  "Pingouin",
  "Écureuil",
  "Kangourou",
  "Girafe",
  "Loutre",
  "Blaireau",
  "Panda",
  "Chameau",
  "Toucan",
  "Phoque",
  "Suricate",
  "Orang-outan",
  "Narval",
  "Okapi",
  "Hippopotame",
  "Marmotte",
  "Éléphant",
  "Lama",
  "Ours",
  "Renard",
];
const colors = [
  "Écarlate",
  "Turquoise",
  "Corail",
  "Citron",
  "Indigo",
  "Ciel",
  "Magenta",
  "Saumon",
  "Brun",
  "Chatoyant",
  "Orangé",
  "Fuchsia",
  "Sable",
  "Pêche",
  "Lavande",
  "Moutarde",
  "Olive",
  "Chocolat",
  "Pastel",
  "Ambre",
];
const others = [
  "Français",
  "Française",
  "Italien",
  "Italienne",
  "Canadien",
  "Canadienne",
  "Chinois",
  "Chinoise",
  "Russe",
  "Suédois",
  "Suédoise",
  "Brésilien",
  "Brésilienne",
  "Mexicain",
  "Mexicaine",
  "Égyptien",
  "Égyptienne",
  "Grec",
  "Grec",
  "Suisse",
  "Cubain",
  "Cubaine",
  "Libanais",
  "Libanaise",
  "Coréen",
  "Coréenne",
  "Irlandais",
  "Irlandaise",
  "Japonais",
  "Japonaise",
  "Allemand",
  "Allemande",
  "Australien",
  "Australienne",
  "Portugais",
  "Portugaise",
  "Autrichien",
  "Autrichienne",
];

export const getRandomUserName = () => {
  const other = others[Math.floor(Math.random() * others.length)];
  const color = colors[Math.floor(Math.random() * colors.length)];
  const animal = animals[Math.floor(Math.random() * animals.length)];
  return `${animal}-${color}-${other}`.toLowerCase().replace(/ /g, "-");
};

export interface User {
  id: string;
  name: string;
  color: string;
  avatar: string;
}

const jsonData = localStorage.getItem("user");
let userData: User;
if (jsonData) {
  userData = JSON.parse(jsonData) as User;
} else {
  userData = {
    id: crypto.randomUUID(),
    name: getRandomUserName(),
    color: "#000000",
    avatar: "",
  };
  localStorage.setItem("user", JSON.stringify(userData));
}

const [user, setUser] = createStore(userData);

const updateUserName = (name: string): void => {
  setUser("name", name);
  localStorage.setItem("user", JSON.stringify(user));
};

const updateUserColor = (color: string): void => {
  setUser("color", color);
  localStorage.setItem("user", JSON.stringify(user));
};

const updateUserAvatar = (avatar: string): void => {
  setUser("avatar", avatar);
  localStorage.setItem("user", JSON.stringify(user));
};

// export const peer = new Peer(getPeerId(user.id));

export function useUser(): [
  Get: User,
  Set: (name: string) => void,
  Set: (color: string) => void,
  Set: (avatar: string) => void
] {
  return [user, updateUserName, updateUserColor, updateUserAvatar];
}
