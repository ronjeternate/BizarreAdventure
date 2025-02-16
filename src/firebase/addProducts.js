import { db } from "./firebase.js";
import { collection, addDoc } from "firebase/firestore";

// timestamp: serverTimestamp()

const products = [
    { 
      name: "Lacoste Black / Taper Men", 
      volume: "30ml", 
      price: "₱ 219",
      gender: "Men",
      imageUrl: "https://i.imgur.com/VWKeqN0.jpeg"
    },
    { 
      name: "Cool off Water / Quiff Men", 
      volume: "30ml", 
      price: "₱ 219",
      gender: "Men",
      imageUrl: "https://i.imgur.com/zMNIMgh.jpeg"
    },
    { 
      name: "Polo Sport / Buzz Men", 
      volume: "30ml", 
      price: "₱ 219",
      gender: "Men",
      imageUrl: "https://i.imgur.com/RfBXRFE.jpeg"
    },
    { 
      name: "Lacoste Red / Temple Men", 
      volume: "30ml", 
      price: "₱ 219",
      gender: "Men",
      imageUrl: "https://i.imgur.com/QTPhrYl.jpeg"
    },
    { 
      name: "Drakkar Noir / Slick Men", 
      volume: "30ml", 
      price: "₱ 219",
      gender: "Men",
      imageUrl: "https://i.imgur.com/I2yXcbp.jpeg"
    },
    { 
      name: "Dior Sauvage / Mullet Men", 
      volume: "30ml", 
      price: "₱ 219",
      gender: "Men",
      imageUrl: "https://i.imgur.com/Eh1gLcp.jpeg"
    },
    { 
      name: "Versace Eros / Afro Men", 
      volume: "65ml", 
      price: "₱ 225",
      gender: "Men",
      imageUrl: "https://i.imgur.com/6W7pjl2.jpeg"
    },
    { 
      name: "Chanel N°5 / Athena Women", 
      volume: "30ml", 
      price: "₱ 225",
      gender: "Women",
      imageUrl: "https://i.imgur.com/ppKN9Gf.jpeg"
    },
    { 
      name: "Miss Dior / Antheia Women", 
      volume: "30ml", 
      price: "₱ 225",
      gender: "Women",
      imageUrl: "https://i.imgur.com/El8GBlN.jpeg"
    },
    { 
      name: "Meow Katy Perry / Florise Women", 
      volume: "30ml", 
      price: "₱ 225",
      gender: "Women",
      imageUrl: "https://i.imgur.com/NuAjpfj.jpeg"
    },
    { 
      name: "Bath & Body Works Sweet Pea / Aphrora Women", 
      volume: "30ml", 
      price: "₱ 225",
      gender: "Women",
      imageUrl: "https://i.imgur.com/bH1pjwV.jpeg"
    },
    { 
      name: "Lacoste Pink / Hygea Women", 
      volume: "30ml", 
      price: "₱ 225",
      gender: "Women",
      imageUrl: "https://i.imgur.com/RJiZf6w.jpeg"
    },
    { 
      name: "CH Good Girl / Enchante Women", 
      volume: "30ml", 
      price: "₱ 225",
      gender: "Women",
      imageUrl: "https://i.imgur.com/9KTQdR8.jpeg"
    },
    { 
      name: "A G Cloud / Cloud Women", 
      volume: "30ml", 
      price: "₱ 225",
      gender: "Women",
      imageUrl: "https://i.imgur.com/xRdYY48.jpeg"
    }
  ];

const uploadProducts = async () => {
  const productsCollection = collection(db, "products");

  for (const product of products) {
    console.log("Uploading product:", product); // Debugging log
    await addDoc(productsCollection, product);
    console.log(`Added: ${product.name}`);
  }

  console.log("All products uploaded!");
};

uploadProducts();
