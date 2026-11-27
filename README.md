# FanDeal 🍔

A full-stack food poster creation and management application built using the **MERN stack (MongoDB, Express.js, React.js, Node.js)**.

FanDeal allows users to explore food products, create personalized promotional posters using drag-and-drop functionality, and submit them for admin review. Administrators can manage products and review submitted posters by approving or rejecting them.

## ✨ Features

### 👤 User Features

- **User Registration & Login:** Secure authentication using email and password.
- **Browse Products:** Explore products categorized into:
  - Burgers
  - Sides
  - Drinks
- **Product Selection:** Select one product from each category.
- **Interactive Poster Builder:** Create personalized posters by dragging and positioning selected products on a predefined poster background.
- **Poster Submission:** Save the selected products and their positions.
- **My Poster:** View the submitted poster and its current review status.
- **Poster Status Tracking:** Track whether a poster is Pending, Approved, or Rejected.
- **One Poster Per User:** Prevent users from submitting multiple posters simultaneously.

### 🛠️ Admin Features

- **Product Management:** Add products with their name, category, price, and image.
- **Product Listing:** View available products.
- **Poster Review Dashboard:** View posters submitted by registered users.
- **Approval & Rejection:** Approve or reject submitted posters.
- **Status Management:** Update the review status of submitted posters.

## 🧰 Tech Stack

| Technology | Purpose |
|---|---|
| React.js | Frontend user interface |
| React Router DOM | Client-side routing |
| Axios | HTTP requests |
| React Draggable | Drag-and-drop poster editor |
| Node.js | Backend runtime |
| Express.js | REST API development |
| MongoDB | NoSQL database |
| Mongoose | MongoDB object modeling |
| JWT | User authentication |
| bcryptjs | Password hashing |
| Multer | Image upload handling |
| CSS3 | Responsive UI styling |

## 📁 Project Structure

```text
FanDeal/
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   ├── auth/
│   │   │   └── user/
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── index.css
│   └── package.json
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   ├── .env.example
│   ├── server.js
│   └── package.json
│
├── .gitignore
└── README.md
```

## ⚙️ Installation & Setup

### Prerequisites

Make sure you have installed:

- [Node.js](https://nodejs.org/)
- [MongoDB Community Server](https://www.mongodb.com/try/download/community)
- [Git](https://git-scm.com/)
- npm (comes with Node.js)

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/FanDeal.git
cd FanDeal
```

Replace `YOUR_USERNAME` with your GitHub username.

### 2. Setup the Backend

Navigate to the server directory:

```bash
cd server
```

Install dependencies:

```bash
npm install
```

Create a `.env` file inside the `server` directory:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/fandeal
JWT_SECRET=your_secure_secret_key
```

Make sure your local MongoDB service is running.

Start the backend:

```bash
npm run dev
```

If your project does not have a development script, use:

```bash
node server.js
```

The backend should run at:

`http://localhost:5000`

### 3. Setup the Frontend

Open another terminal and navigate to the client directory:

```bash
cd client
```

Install dependencies:

```bash
npm install
```

Start the React development server:

```bash
npm run dev
```

The frontend will typically be available at:

`http://localhost:5173`

## 🔗 API Endpoints

Base URL: `http://localhost:5000/api`

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/register` | Register a new user |
| POST | `/auth/login` | Login user |
| GET | `/user/profile` | Get authenticated user profile |

### Products

| Method | Endpoint | Description |
|---|---|---|
| POST | `/products` | Add a new product with image |
| GET | `/products` | Retrieve all products |

### Posters

| Method | Endpoint | Description |
|---|---|---|
| POST | `/posters` | Submit a new poster |
| GET | `/posters/my-poster` | Get the logged-in user's poster |
| GET | `/posters/admin/all` | Retrieve all submitted posters |
| PATCH | `/posters/admin/:id/status` | Approve or reject a poster |

**Authentication:** Protected endpoints require a valid JWT token.

For authenticated requests, include:

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

## 🗄️ Database Models

FanDeal uses MongoDB with Mongoose schemas.

### User

Stores registered user information:

- `user_name`
- `email`
- `password` (hashed)
- `createdAt`
- `updatedAt`

### Product

Stores product information:

- `product_name`
- `product_category`
- `image_url`
- `product_price`
- `createdAt`
- `updatedAt`

Supported categories: `Burger`, `Side`, `Drink`.

### Poster

Stores user poster submissions:

- `user_id`
- `poster_items`
  - `productId`
  - `x`
  - `y`
- `status`
- `isLocked`
- `createdAt`
- `updatedAt`

Poster positions are stored as percentages (0–100) rather than fixed pixel coordinates, allowing the poster layout to remain responsive across screen sizes.

The poster schema enforces one poster per user and validates that exactly three products are submitted.

## 🔄 Application Workflow

1. A user registers and logs in.
2. The user browses available products.
3. The user selects one Burger, one Side, and one Drink.
4. The user proceeds to the Poster Builder.
5. The selected products can be dragged and positioned on the poster background.
6. The user submits the poster.
7. The backend validates the selection and saves product IDs and their positions.
8. The poster is assigned a Pending status.
9. The administrator reviews the submission.
10. The administrator approves or rejects the poster.
11. The user views the updated status in My Poster.

## 🔐 Security & Validation

- Passwords are hashed using bcryptjs.
- JWT-based authentication protects user-specific endpoints.
- Backend validation ensures exactly three products are submitted.
- Duplicate product categories are not accepted in a poster.
- Product IDs are validated before poster creation.
- Poster coordinates are restricted to values between 0 and 100.
- MongoDB enforces a unique user reference for poster submissions.
- Uploaded product images are validated by file type and size.
- Environment variables are excluded from version control.

## 🖼️ Image Uploads

Product images are uploaded using Multer and stored locally in the backend's `uploads` directory.

Uploaded images are served through:

```text
http://localhost:5000/uploads/<filename>
```

The poster background is maintained as a frontend asset.

## 🚀 Future Improvements

- Product deletion and improved product management.
- Poster deletion and resubmission workflow.
- Admin authentication and role-based authorization.
- Cloud-based image storage.
- Live deployment.
- Improved poster templates and customization options.
- Automated testing and API documentation.

## 👨‍💻 Author

**Kirtan Rathod**

Full-Stack Developer

- GitHub: [Your GitHub Profile](https://github.com/YOUR_USERNAME)
- LinkedIn: [Your LinkedIn Profile](https://www.linkedin.com/)

## 📄 License

This project was developed as a practical full-stack development assignment.

---

**Built with ❤️ using the MERN Stack.**