require("dotenv").config();
const client = require("./index"); 
const bcrypt = require('bcrypt'); 


const { createUser } = require("./users");
const { createProduct } = require("./products");
const { getProductById } = require("./products");
const { createCategory } = require("./categories");
const { getCategoryById } = require("./categories");
const { createOrder } = require("./orders");
const { getAllOrdersById } = require("./orders");
const { getUserByUsername } = require("./users");



const withTransaction = async (callback) => {
  try {
    await client.query('BEGIN');
    await callback();
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  }
};

const seedDB = async () => {
  await withTransaction(async () => {
    await dropTables();
    await createTables();
    await createInitialUsers();
    await createInitialProducts();
    await createInitialCategories();
    await createInitialOrders();
  });
  console.log("db has been successfully seeded!");
};

const dropTables = async () => {
  console.log("Starting to drop tables");
  await client.query(`
    DROP TABLE IF EXISTS order_items;
    DROP TABLE IF EXISTS orders;
    DROP TABLE IF EXISTS products_categories;
    DROP TABLE IF EXISTS categories;
    DROP TABLE IF EXISTS products;
    DROP TABLE IF EXISTS users;
  `);
  console.log("Tables dropped...");
};

const createTables = async () => {
  console.log("Starting to create tables");
  await client.query(`
    CREATE TABLE users(
      id SERIAL PRIMARY KEY,
      username VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      "isAdmin" boolean DEFAULT false
    );

    CREATE TABLE products(
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) UNIQUE NOT NULL,
      description TEXT NOT NULL,
      imgurl TEXT NOT NULL,
      stock INTEGER NOT NULL,
      price INTEGER NOT NULL,
      category VARCHAR(255) NOT NULL
    );

    CREATE TABLE categories(
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) UNIQUE NOT NULL
    );

    CREATE TABLE products_categories(
      id SERIAL PRIMARY KEY,
      "productId" INTEGER REFERENCES products(id),
      "categoryId" INTEGER REFERENCES categories(id)
    );

    CREATE TABLE orders(
      id SERIAL PRIMARY KEY,
      "creatorId" INTEGER REFERENCES users(id),
      "isPurchased" BOOLEAN DEFAULT false
    );

    CREATE TABLE order_items(
      id SERIAL PRIMARY KEY,
      "orderId" INTEGER REFERENCES orders(id),
      "productId" INTEGER REFERENCES products(id),
      UNIQUE ("productId", "orderId"),
      price INTEGER NOT NULL,
      quantity INTEGER NOT NULL
    );
  `);
  console.log("Tables created...");
};

async function createInitialUsers() {
  console.log("Starting to create users...");
  try {
    const usersToCreate = [
      { username: "admin@gmail.com", password: "admin1234", isAdmin: true },
      { username: "albert@gmail.com", password: "bertie99", isAdmin: false  },
      { username: "sandra@gmail.com", password: "sandra123", isAdmin: false  },
      { username: "glamgal@hotmail.com", password: "glamgal123", isAdmin: false  },
    ];
    
    for (const user of usersToCreate) {
      const existingUser = await getUserByUsername(user.username);
      if (!existingUser) {
        await createUser(user);
      }
    }
    console.log("Finished creating users!");
  } catch (error) {
    console.error("Error creating users!");
    throw error;
  }
}

async function createInitialProducts() {
  console.log("Starting to add products...");
  try {
    const productsToAdd = [
      {
        title: "Air Jordan 1 Retro High OG 'Shadow'",
        description:
          "The Air Jordan IV was MJ's first signature model to take flight. Complete with never before seen “Wings” acting as lace locks and an unforgettable color scheme, the silhouette now returns in its truest form. Nodding to its 1989 debut, the new Air Jordan IV features iconic Nike Air branding on both the heel and outsole.",
        imgurl:
          "https://image.goat.com/750/attachments/product_template_pictures/images/011/119/994/original/218099_00.png.png",
        stock: 25,
        price: 250,
        category: 'Basketball'
      },
      {
        title: "Air Jordan 11 Retro Gym Red",
        description:
          "For Chicago Bulls Fans, the historical significance of the Air Jordan 11 Retro ‘Win Like 96’ will be abundantly clear. 1996 is the year that the Bulls capped off the regular season with a record-breaking 72 wins, on their way to a fourth NBA title in six seasons. Michael wore the Jordan 11 during that magical run, and this December 2017 release, dressed in a dazzling shade of red, honors the ’96 squad that couldn’t lose.",
        imgurl:
          "https://image.goat.com/750/attachments/product_template_pictures/images/008/870/353/original/235806_00.png.png",
        stock: 100,
        price: 175,
        category: 'Basketball'
      },
      {
        title: "The Air Jordan 11 Retro Legend Blue",
        description:
          "The Air Jordan 11 Retro ‘Legend Blue’ 2014 was based on the 1996 Jordan 11 ‘Columbia’ first worn by Jordan during the 1996 NBA All-Star Game. Inspired by the classic colorway Jordan wore as a Tarheel, the ‘Columbia’ first retroed in 2001 for the Jordan 11 ‘Columbia’ Retro release.",
        imgurl:
          "https://image.goat.com/750/attachments/product_template_pictures/images/010/223/048/original/13607_00.png.png",
        stock: 150,
        price: 180,
        category: 'Basketball'
      },
      {
        title: "Air Jordan 1 Retro OG Panda",
        description:
          "Arriving in stores in February 2018, the Air Jordan 1 Retro High OG ‘Panda’ is a new spin on a classic design. The Chicago Bulls-inspired colorway combines elements of the ‘Bred’ and ‘Black Toe’ editions of the Air Jordan 1, executed on a premium leather build. The high-top features a black Swoosh on the white quarter panel, along with contrasting pops of red on the toe box, heel, collar, and outsole. The shoe stays true to its OG 1985 roots with Nike Air branding on the tongue tag and sockliner",
        imgurl:
          "https://image.goat.com/750/attachments/product_template_pictures/images/021/545/481/original/509480_00.png.png",
        stock: 55,
        price: 200,
        category: 'Basketball'
      },
      {
        title: "Yeezy Boost 700",
        description:
          "The 5th Yeezy to drop since November 2017 — Yeezy Boost 350 V2 &#39;Semi Frozen Yellow&#39; and ‘Beluga 2.0,’ Yeezy Powerphase Calabasas, and the Yeezy 500 ‘Desert Rat’ — the Yeezy Boost 350 V2 &#39;Blue Tint&#39; was dropped on December 16th, 2017. The sneaker features a neutral white and grey upper with a red ‘SPLY-350’ text on the side in reverse. The shoe also comes with a heel tab, blue tint inner lining, and paste blue laces.",
        imgurl:
          "https://image.goat.com/375/attachments/product_template_pictures/images/021/147/972/original/504187_00.png.png",
        stock: 47,
        price: 135,
        category: 'Casual'
      },
      {
        title: "Pharrell x Billionaire Boys Club x NMD Human Race Trail",
        description:
          "From pistol squats to burpees, there's no shortage of moves to take your workout to the next level. Reach for these men's Reebok shoes to stay confident in or out of the gym. They have a Flexweave® woven upper that's breathable and durable, with integrated support for stable movement in every direction. The rubber outsole with a strategic lug pattern gives you secure traction.",
        imgurl:
          "https://image.goat.com/375/attachments/product_template_pictures/images/021/545/467/original/512006_00.png.png",
        stock: 21,
        price: 200,
        category: 'Running'
      },
      {
        title: "Yeezy Boost 350 V2 'Zebra'",
        description:
          "Released on February 25, 2017, the Yeezy Boost 350 V2 ‘Zebra’ combines a white/core black Primeknit upper with red SPLY 350 branding and a translucent white midsole housing full-length Boost. Sold exclusively at adidas.com, Yeezy Supply, and select adidas flagship stores, the ‘Zebra’ sold out instantly but was restocked on June 24th, 2017. Another restock of the ‘Zebra’ arrived November 16, 2018, with more pairs hitting the marketplace and delivering on Kanye’s promise of Yeezy’s being more accessible to anyone that wanted them",
        imgurl:
          "https://image.goat.com/375/attachments/product_template_pictures/images/014/979/033/original/105568_00.png.png",
        stock: 47,
        price: 235,
        category: 'Casual'
      },
      {
        title: "Air Jordan 4 Retro OG 'Bred' 2019",
        description:
          "The 2019 edition of the Air Jordan 4 Bred celebrates the 30th anniversary of the classic silhouette, appearing in the same colorway that Michael Jordan wore when he sank 'The Shot' during the first round of the 1989 NBA playoffs. It’s rendered in a build that’s faithful to the original, complete with a black nubuck upper, visible Air Sole cushioning underfoot and Nike Air branding on the heel.",
        imgurl:
          "https://image.goat.com/750/attachments/product_template_pictures/images/020/806/485/original/461782_00.png.png",
        stock: 150,
        price: 275,
        category: 'Basketball'
      },
      {
        title: "Wmns Air Jordan 12 Retro 'Reptile'",
        description:
          "The Wmns Air Jordan 12 Retro 'Reptile' sneaker draws details from the 1996 classic and elevates them with luxe style additions. This April 2019-released, women's-exclusive shoe features the AJ12s original stitching, inspired by the Rising Sun Flag of Japan. Its black leather upper is laden with exotic reptile-inspired texture and embellished with gold accents. This edition is completed with classic Zoom cushioning and sections of herringbone tread.",
        imgurl:
          "https://image.goat.com/750/attachments/product_template_pictures/images/021/042/384/original/500924_00.png.png",
        stock: 25,
        price: 275,
        category: 'Basketball'
      },
      {
        title: "Trophy Room x Air Jordan 5 Retro 'Ice Blue'",
        description:
          "The Trophy Room x Air Jordan 5 Retro sneaker draws inspiration from the real-life trophy room in the Jordan family home. This 'Ice Blue' rendition is replete with a rich suede upper, hits of University Red, Sail and a metallic gold lace lock. Each lateral heel is embroidered with metallic gold numerals—'23' and '5'—the jersey numbers worn by MJ and his son, Marcus. Below, the sneaker's translucent rubber sole displays a wood-grain motif to reference the court-style flooring in MJ's trophy room. A total of 7,000 pairs were released in May 2019, each individually numbered.",
        imgurl:
          "https://image.goat.com/750/attachments/product_template_pictures/images/021/474/777/original/TR_JSP_5_ICE.png.png",
        stock: 47,
        price: 135,
        category: 'Basketball'
      },

      {
        title: "Air Jordan 1 Retro High OG 'Shadow' 2018",
        description:
          "This Nike Air Jordan 1 Retro High OG Shadow; 2018 is a retro re-release of an original 1985 colorway. The shoe features a black and medium grey leather upper with a white midsole and black outsole. It also features OG Nike Air branding on the tongue and the Wings logo on the ankle collar. It was last retroed in 2013, and a low-top version dropped in 2015.",
        imgurl:
          "https://image.goat.com/375/attachments/product_template_pictures/images/011/119/994/original/218099_00.png.png",
        stock: 47,
        price: 160,
        category: 'Basketball'
      },
      {
        title: "Air Jordan 11 Retro 'Space Jam' 2016",
        description:
          "The Air Jordan 11 Retro Space Jam 2016 commemorates the 20th anniversary of the movie Space Jam. Worn by Michael Jordan as a Player Exclusive (PE) in both the movie and the 1995 NBA Playoffs, the 2016 retro ended up being Nikes largest and most successful shoe launch ever. This 2016 sneaker is a more faithful reproduction of the original PE than the 2000 and 2009 retros. The sneaker also swaps the traditional #23 for MJs comeback #45 on the heel, a first for an Air Jordan 11 retail release.",
        imgurl:
          "https://image.goat.com/375/attachments/product_template_pictures/images/008/654/900/original/52015_00.png.png",

        stock: 10,
        price: 550,
        category: 'Basketball'
      },
      {
        title: "Air Jordan 6 Retro 'Infrared' 2019",
        description:
          "The 2019 edition of the Air Jordan 6 Retro Infrared is true to the original colorway, which Michael Jordan wore when he captured his first NBA title. Dressed primarily in black nubuck with a reflective 3M layer underneath, the mid-top features Infrared accents on the midsole, heel tab and lace lock. Nike Air branding adorns the heel and sockliner, an OG detail last seen on the 2000 retro.",
        imgurl:
          "https://image.goat.com/375/attachments/product_template_pictures/images/018/675/311/original/464372_00.png.png",
        stock: 23,
        price: 625,
        category: 'Basketball'
      },
      {
        title: "Yeezy Boost 350",
        description:
          "The adidas Yeezy Boost 350 V2 lives up to its cult appeal through evolved design elements and advanced technology. Released June 2019, this ‘Black Non-Reflective&#39; edition&#39;s re-engineered Primeknit bootie sees futuristic updates including a translucent side stripe and bold stitching on the heel pull. Integrated lacing customizes the fit while a translucent black Boost-equipped midsole complements the covert feel.",
        imgurl:
          "https://image.goat.com/375/attachments/product_template_pictures/images/020/624/696/original/FU9013.png.png",
        stock: 47,
        price: 135,
        category: 'Casual'
      },
      {
        title: "OFF-WHITE x Air Jordan 1 Retro High OG 'UNC'",
        description:
          "Inspired by Michael Jordan’s alma mater, the Off-White x Air Jordan 1 Retro High OG ‘UNC’ carries a classic two-tone composition, filtered through Virgil Abloh’s unique design prism. The process involves taking a white leather base with dark powder blue overlays and adding embellishments that convey an expressive, handmade quality. They include detached Wings, a floating Swoosh, and lines of text on the medial-side quarter panel delineating the taxonomy of the shoe.",
        imgurl:
          "https://image.goat.com/375/attachments/product_template_pictures/images/012/219/518/original/335047_00.png.png",
        stock: 23,
        price: 1200,
        category: 'Casual'
      },
      {
        title: "CHAMPION RALLY PRO",
        description:
          "The Champion Rally Pro sneaker packages street style in a sleek, basketball-inspired silhouette with heritage Champion detailing throughout. This ‘Black’ version is styled for growing kids’ feet and features a one-piece bootie construction made from woven mesh and elastic textile with suede trim on the sidewall and heel. It offers a snug, sock-like fit that’s reinforced with tabs at the tongue and heel for easy on and off. A textured chenille ‘C’ logo on the sidewall and branded elastic strap across the forefoot complement the design.",
        imgurl:
          "https://image.goat.com/375/attachments/product_template_pictures/images/015/567/335/original/CM100018M.png.png",
        stock: 33,
        price: 125,
        category: 'Casual'
      },
      {
        title: "CONVERSE GOLF-WANG ROSE-BOWL",
        description:
          "Tyler, the Creator teamed up with Foot Locker on the ‘Artist Series’ edition of the Converse Chuck 70, featuring an off-white canvas upper printed with original artwork from Wyatt Navarro. The heightened foxing that’s a signature design element of the silhouette is adorned with contrasting stripes in blue and orange. A gum rubber outsole delivers traction underfoot.",
        imgurl:
          "https://image.goat.com/375/attachments/product_template_pictures/images/018/552/840/original/476518_00.png.png",
        stock: 30,
        price: 150,
        category: 'Casual'
      },
      {
        title: "CONVERSE COMME-DES-GARCONS",
        description:
          "This Comme des Garçons x Chuck Taylor All Star Hi features an off-white canvas upper, red CDG heart logo on the side panels, black contrast stripe on the heel, white toe cap, and a vulcanized rubber midsole. Released in June 2017, the sneaker also dropped in a black colorway.",
        imgurl:
          "https://image.goat.com/375/attachments/product_template_pictures/images/015/298/767/original/77243_00.png.png",
        stock: 47,
        price: 135,
        category: 'Casual'
      },
      {
        title: "GUCCI PURSUIT",
        description:
          "The Gucci Pursuit ‘72 Rubber Slide in ‘Black’ sneaker pays homage to the fashion house&#39;s roots with the iconic Web stripe—first developed by Gucci in the 1950s—taking the stage. The minimal, open-toe silhouette features a thick black rubber sole with a rounded shape. The top portion of the slide is a rubber strap displaying the Gucci Web green and red striped motif, and the design is finished with a Gucci logo embossed on the outer midsole.",
        imgurl:
          "https://image.goat.com/375/attachments/product_template_pictures/images/009/249/006/original/259509_00.png.png",
        stock: 23,
        price: 245,
        category: 'Casual'
      },
      {
        title: "FEAR OF GOD AIR RAID",
        description:
          "Nike and frequent collaborator Fear Of God designer, Jerry Lorenzo, joined forces once again for the Air Fear Of God Raid &#39;Black&#39; sneaker. Released in May 2019, the uniquely designed silhouette is inspired by one of Lorenzo’s favorite Nike designs, the Air Raid. Outfitted with a cross strap suede and textile upper above; below, its equipped with a double stacked Zoom Air unit in heel for a retro, yet futuristic finish.",
        imgurl:
          "https://image.goat.com/375/attachments/product_template_pictures/images/021/545/549/original/489359_00.png.png",
        stock: 47,
        price: 135,
        category: 'Casual'
      },
    ];
    for (const product of productsToAdd) {
      const existingProduct = await getProductById(product.id);
      if (!existingProduct) {
        await createProduct(product);
      }
    }
    console.log("Finished adding the products...");
  } catch (error) {
    throw error;
  }
}

async function createInitialCategories() {
  console.log("Starting to add categories...");
  try {
    const categoriesToAdd = [
      {
        name: "Basketball",
      },
      {
        name: "Running",
      },
      {
        name: "Hiking",
      },
      {
        name: "Swimming",
      },
      {
        name: "Casual",
      },
      {
        name: "Cross Training",
      },
    ];

    for (const category of categoriesToAdd) {
      const existingCategory = await getCategoryById(category.id);
      if (!existingCategory) {
        await createCategory(category);
      }
    }
    console.log("Finished adding the categories...");
  } catch (err) {
    throw err;
  }
}

async function createInitialOrders() {
  console.log("Starting to create orders...");
  try {
    console.log("Starting to create orders...");

    const ordersToCreate = [
      {
        creatorId: 1,
      },
      {
        creatorId: 2,
      },
      {
        creatorId: 3,
      },
    ];

    // for (const order of ordersToCreate) {
    //   const existingOrder = await getAllOrdersById(order.id);
    //   if (!existingOrder) {
    //     await createOrder(order);
    //   }
    // }
    console.log("Finished to create orders");
  } catch (error) {
    console.error("Error creating orders");
    throw error;
  }
}

seedDB().catch(console.error);
