import express from 'express';
import multer from 'multer';
import path from 'path';
import session from 'express-session';
import fs from 'fs';
import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config({ path: './db.env' }); 

const isProduction = process.env.NODE_ENV === "production"; 

const app = express();
const port = 3000;

// PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isProduction ? { rejectUnauthorized: false } : false,
});



app.use(session({
  secret: 'bookstore-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } 
}));



const dir = './uploadImages';
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

const storage = multer.diskStorage({
      
       destination: (req, file, cb) => {
        cb(null, "uploadImages");
       },
       filename:(req, file, cb) => {
         console.log(file);
         cb(null, Date.now() + path.extname(file.originalname));
       },
   
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, 
  fileFilter: (req, file, cb) => {
      const fileTypes = /jpeg|jpg|png|gif/;
      const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
      const mimeType = fileTypes.test(file.mimetype);

      if (extname && mimeType) {
          return cb(null, true);
      } else {
          cb(new Error('Only images are allowed!'));
      }
  }
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

app.set("view engine", "ejs");

app.use('/uploadImages', express.static('uploadImages'));

let addedBook = [];


app.get("/", async (req, res) => {
  if (!req.session.cart) req.session.cart = [];

  
  const result = await pool.query(`SELECT * FROM cart`);
  const products = result.rows;

  const data = await pool.query(`SELECT * FROM best_seller`);
  const bestSeller = data.rows;

  const dataTwo = await pool.query(`SELECT * FROM best_seller2`);
  const bestSellerTwo = dataTwo.rows;

  const dataThree = await pool.query(`SELECT * FROM best_seller3`);
  const bestSellerThree = dataThree.rows;

  let cartCount = req.session.cart
  ? req.session.cart.reduce((total, item) => total + item.quantity, 0)
  : 0;


  let cart = req.session.cart || [];
  let total = cart.reduce((sum, item) => sum + item.product_price * item.quantity, 0);
  const flashMessage = req.session.message;

  const placeMessage = req.session.message;

  delete req.session.message;

 
  res.render("index.ejs", {
    
    homeTitle: "RECOMMEND YOUR CHERISED BOOKS.",
    quote: "QUOTE OF THE DAY",
    bookImg: "/style/assets/hero-img.png",
    image: "style/assets/seuss.jpg",
    loverImage: "/style/assets/lover-icon.png",
    bestTitle: "SPEAK FAVORABLY AS PER BOOK LOVER.",
    loverImage: "/style/assets/lover-icon.png", 
    bookTitle: "To Kill a Mocking Bird by Harper Lee.",
    createPost: "/style/assets/create-post.png",
    bookTitle2: "Frankenstein by Mary Shelley",
    bookTitle3: "Pride and Prejudice",
    newsLetter: "/style/assets/newsletter.png",
    sendBtn:  "/style/assets/send-btn.png",
    girlHand:  "/style/assets/hand.png",
    heartHover: "/style/assets/heartu.png",
    saleIcon: "/style/assets/saleoff.png",
    viewBtn:  "/style/assets/view-all.png",
    saleTag: "/style/assets/sale-tag2.png",
    pin: "/style/assets/pin1.png",
    addedBook,
    cartItems: req.session.cart,
    products: products ,
    best: bestSeller,
    bestTwo: bestSellerTwo,
    bestThree: bestSellerThree,
    cartCount,
    flashMessage,
    placeMessage,
    total,
    
  });
});



app.get("/recommend", (req ,res) => { 

  let cartCount = req.session.cart
  ? req.session.cart.reduce((total, item) => total + item.quantity, 0)
  : 0;


  let cart = req.session.cart || [];
  let total = cart.reduce((sum, item) => sum + item.product_price * item.quantity, 0);
       
  res.render("recommend.ejs",{
  bestTitle: "RECOMMEND YOUR BELOVED BOOK.",
  loverImage: "/style/assets/lover-icon.png",     
  addIcon: "/style/assets/add-icon.png",
  createPost: "/style/assets/create-post.png",
  bookTitle: "Don Quixote",
  bookImage:"/style/assets/Don-Quixote.jpg",
  name: "Anderson",
  addImage:" <button> Add Image </button>",
  sendBtn:  "/style/assets/send-btn.png",
  findBtn: "/style/assets/find-btn.png",
  addedBook,
  total,
  cartCount

 
});

});




     app.get("/card1",  (req, res) => {
      let cartCount = req.session.cart
      ? req.session.cart.reduce((total, item) => total + item.quantity, 0)
      : 0;
    

      let cart = req.session.cart || [];
      let total = cart.reduce((sum, item) => sum + item.product_price * item.quantity, 0);

               res.render("mockingbird.ejs", {
               title: "To Kill a Mockingbird by Harper Lee",
               bookMocking: "/style/assets/bookcover.jpg",
               pin: "/style/assets/pin1.png",
               briefSum: "Brief Summary",
               summaryImg1: "/style/assets/pic1.jpg",
               strength: "Strengths of the Novel",
               createPost: "/style/assets/create-post.png",
               funFactImg: "/style/assets/fun-fact.png",
               racismImg: "/style/assets/racism.jpg",
               characDepth: "Character Depth and Symbolism",
               sendBtn:  "/style/assets/send-btn.png",               
               characIcon: "/style/assets/character.png",
               criticism: "Criticism and Controversy",
               final: "Final Verdict",
               addedBook,
               total,
               cartCount

               });


     });


     app.get("/card2",  (req, res) => {

      let cartCount = req.session.cart
      ? req.session.cart.reduce((total, item) => total + item.quantity, 0)
      : 0;
    
      let cart = req.session.cart || [];
      let total = cart.reduce((sum, item) => sum + item.product_price * item.quantity, 0);


      res.render("frankenstein.ejs", {
      secondTitle: "Frankenstein by Mary Shelley",
      bookMocking2: "/style/assets/Frankenstein-book.png",
      pin2: "/style/assets/pin1.png",
      briefSum2: "Brief Summary",
      summaryImg2: "/style/assets/f1.jpg",
      strength2: "Strengths of the Novel",
      createPost: "/style/assets/create-post.png",
      funFactImg2: "/style/assets/fun-fact.png",
      frankImg2: "/style/assets/f2.jpg",
      characDepth2: "Character Depth and Symbolism",
      characDepthImg: "/style/assets/f3.jpg",
      sendBtn:  "/style/assets/send-btn.png",
      characIcon2: "/style/assets/luigi.png",
      criticism2: "Criticism and Controversy",
      final2: "Final Verdict",
      addedBook,
      total,
      cartCount
      

      });


});



app.get("/card3",  (req, res) => {

  let cartCount = req.session.cart
  ? req.session.cart.reduce((total, item) => total + item.quantity, 0)
  : 0;


  let cart = req.session.cart || [];
  let total = cart.reduce((sum, item) => sum + item.product_price * item.quantity, 0);

  res.render("prideandprejudice.ejs", {
  thirdTitle: "Pride and Prejudice novel by Jane Austen",
  bookMocking3: "/style/assets/pp-book.jpg",
  pin2: "/style/assets/pin1.png",
  briefSum3: "Brief Summary",
  summaryImg3: "/style/assets/pp1.jpg",
  createPost: "/style/assets/create-post.png",
  strength3: "Strengths of the Novel",
  funFactImg3: "/style/assets/fun-fact.png",
   Img: "/style/assets/pp2.jpg",
  characDepth3: "Character Depth and Symbolism",
  Img2: "/style/assets/p3.jpg",
  characIcon3: "/style/assets/daisy.png",
  criticism3: "Criticism and Controversy",
  criticisImg: "/style/assets/pp-landscape.png",
  final3: "Final Verdict",
  addedBook,
  total,
  cartCount


  });


});

app.post("/add_cart", async (req, res) => {
  
  const { product_name, product_author, product_price, product_image, quantity,
   } = req.body;

   if (!product_name || !product_author || !product_price || !product_image) {
    return res.status(400).send("Invalid product data");
}

   const quantityValue = parseInt(quantity) || 1;

  let cart = req.session.cart || [];

  let existingItem = cart.find(item => item.product_name === product_name);
  if (existingItem) {
      existingItem.quantity += 1;
      
  } else {
      cart.push({
          product_name,
          product_author,
          product_price: parseFloat(product_price),
          product_image,
           quantity: quantityValue,
     
          
      });


  }
  
  req.session.cart = cart;
  req.session.message = `"Successfully Added To Cart!`; 

  res.redirect("/");
});




app.post("/place_order", async (req, res) => {

  let cartCount = req.session.cart
  ? req.session.cart.reduce((total, item) => total + item.quantity, 0)
  : 0;

 
                    
  const placeMessage = req.session.message;

  let cart = req.session.cart || [];
  let total = cart.reduce((sum, item) => sum + item.product_price * item.quantity, 0);

  const { product_name, product_author, product_price, product_image, quantity,
  } = req.body;


  try {

       await pool.query(
      `INSERT INTO place_order (product_name, product_author, product_price, product_image, quantity )
       VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [product_name, product_author, product_price, product_image, quantity]
    );


    req.session.cart = req.session.cart || [];
    req.session.cart = [];

    req.session.message = "Successfully Placed An Order!";
    res.render("cart.ejs",{
      createPost: "/style/assets/create-post.png",
      cart,
      total,
      placeMessage,
      cartCount
      
      
    
    });

  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error.");
  }
});

app.get('/cart', (req, res) => {

  const { product_price } = req.body;
  
  let cartCount = req.session.cart
  ? req.session.cart.reduce((total, item) => total + item.quantity, 0)
  : 0;

  const placeMessage = req.session.message;

  let cart = req.session.cart || [];  
  let total = cart.reduce((sum, item) => sum + item.product_price * item.quantity, 0); 
  
  res.render('cart', { cart, total, placeMessage, cartCount, createPost: "/style/assets/create-post.png",
    product_price: parseFloat(product_price)
    
  });
});


 
app.post("/delete_cart", (req, res) => {
  const index = parseInt(req.body.index);
  
  if (!isNaN(index)) {
    req.session.cart.splice(index, 1);
  }
  res.redirect("/cart");
});




     app.post("/posts", upload.single('image'),  async (req, res) => {
      console.log("Received form data:", req.body);


      let cartCount = req.session.cart
      ? req.session.cart.reduce((total, item) => total + item.quantity, 0)
      : 0;
    
     
      const { name, title, author, opinion, image } = req.body;
      const newImage = req.file ? "/uploadImages/" + req.file.filename : null;

      let cart = req.session.cart || [];
      let total = cart.reduce((sum, item) => sum + item.product_price * item.quantity, 0);
  
        
        try {

        const result = await pool.query(
            "INSERT INTO books (your_name, book_title, author, opinion, books_image) VALUES ($1, $2 ,$3 , $4 , $5) RETURNING id",
            [name,title,author,opinion, newImage]
           );

           const bookId  = result.rows[0]?.id;
           

            try {
               
               await pool.query(
                "INSERT INTO books_added (book_id , added_by) VALUES ($1 , $2) ",
                [bookId,name]
               );

            
             
               addedBook.push({id: bookId, name , title, author,opinion, image: newImage});
              
               return res.render("recommend.ejs",{
                bestTitle: "RECOMMEND YOUR BELOVED BOOK.",
                loverImage: "/style/assets/lover-icon.png",     
                addIcon: "/style/assets/add-icon.png",
                bookTitle: "Don Quixote",
                bookImage:"/style/assets/Don-Quixote.jpg",
                name: "Anderson",
                createPost: "/style/assets/create-post.png",
                addImage:" <button> Add Image </button>",
                sendBtn:  "/style/assets/send-btn.png",
                findBtn: "/style/assets/find-btn.png",
                addedBook,
                cartCount
            });
         
              
            } catch (error) {
              console.log(error);
              res.sendStatus(500).send("Internal Server Error.");
            }
            
           
        

        } catch (error) {
          console.log(error);
          res.sendStatus(500).send("Internal Server Error.");
        }
    });
    
    

app.listen(port, () => {
     console.log(`Server running on http://localhost:${port}`);
   });
   