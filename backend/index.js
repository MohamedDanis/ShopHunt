const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
const User = require('./model/UserModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const geolib = require('geolib')
const shop = require('./data/shop.json')
const cors = require('cors');


const cors = require('cors');
const corsOptions ={
  origin:'*', 
  credentials:true,       
  allowedHeaders: 'Origin,X-Requested-With,Content-Type,Accept,Authorization',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
}
app.use(cors(corsOptions));
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/Shophunt?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
app.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if the email is already in use
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already registered.' });
    }

    // Hash the password before saving it to the database
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create a new user with the hashed password
    const user = new User({ name, email, password: hashedPassword });

    // Save the user to the database
    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});


// User login route
app.post('/login', async(req, res) => {
try {
    const { email, password } = req.body;

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Authentication failed.' });
    }

    // Verify the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Authentication failed.' });
    }

    // If the user exists and the password is valid, issue a JWT token
    const token = jwt.sign({ userId: user._id }, 'your-secret-key', {
      expiresIn: '1h', // Token expiration time
    });

    res.status(200).json({ message: 'Authentication successful', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

// Product search route
app.get('/search/product', async (req, res) => {
  try {
    const userLocation = {
      latitude: req.query.latitude,
      longitude: req.query.longitude,
    };
    const productName = req.query.productName;
    console.log(productName);
    const nearbyshops = shop.filter((item)=>{
      const shopLocation={
        latitude:item.shopLocation.latitude,
        longitude:item.shopLocation.longitude
      }
      const distance = geolib.getDistance(userLocation,shopLocation)
      return distance;
    }).filter((item2) => {
      return item2.products.some(fruit => fruit.productName===productName);
    }).sort((a, b) => {
      const aDistance = geolib.getDistance(userLocation, a.shopLocation);
      const bDistance = geolib.getDistance(userLocation, b.shopLocation);
      return aDistance - bDistance;
    }).map((shop) => {
      const distance = geolib.getDistance(userLocation, shop.shopLocation);
      return { ...shop, distance };
    });

    console.log(nearbyshops);
    res.status(200).json({ nearbyshops });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

app.get('/shops',(req,res)=>{
  res.status(200).json({shop})
})

// Notification handling route
app.post('/notifications', (req, res) => {
  // Handle notification logic
  // Send real-time notifications to users
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
