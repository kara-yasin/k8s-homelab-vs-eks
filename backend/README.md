# Book Review App — Backend

Backend for the Book Review application, built with **Node.js, Express.js, and MySQL**.  
Provides a REST API for user authentication, book management, and reviews.

---

## Tech Stack

| Technology | Usage |
|---|---|
| Node.js (v18+) | Runtime |
| Express.js | API framework |
| MySQL | Relational database |
| Sequelize | ORM |
| JWT | Authentication |
| bcrypt.js | Password hashing |
| dotenv | Environment variables |

---

## Folder Structure

```
/backend
 ├── /src
 │   ├── /config         # Database connection
 │   ├── /models         # Sequelize models (User, Book, Review)
 │   ├── /routes         # API routes
 │   ├── /controllers    # Business logic
 │   ├── /middleware     # JWT authentication
 │   └── server.js       # Express server entry point
 ├── Dockerfile
 ├── package.json
 └── .env                # Environment variables (not committed to Git)
```

---

## Environment Variables

Create a `.env` file in the `backend/` directory:

```env
DB_HOST=localhost
DB_USER=root
DB_PASS=yourpassword
DB_NAME=book_review_db
DB_DIALECT=mysql
JWT_SECRET=your_jwt_secret
ALLOWED_ORIGINS=http://localhost:3000
```

> ⚠️ In Kubernetes environments, these variables are managed via **Kubernetes Secrets** — not via the `.env` file.

---

## Running Locally (without Kubernetes)

```bash
# Install dependencies
npm install

# Start MySQL and create the database
mysql -u root -p
CREATE DATABASE book_review_db;
EXIT;

# Start the server
node src/server.js
```

Server runs on port **3001**.

---

## Docker

```bash
# Build the image
docker build -t book-review-backend .

# Run the container
docker run -p 3001:3001 book-review-backend
```

---

## Kubernetes Deployment

In this project, the backend is deployed using **Argo CD and GitOps methodology**.  
Kubernetes manifests are located in the `/k8s` folder at the root of the repository.

Resources created:
- `Deployment` — runs backend pods
- `Service` — exposes the backend internally within the cluster
- `Secret` — manages database credentials and JWT secret

---

## API Endpoints

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/api/users/register` | Register a new user | No |
| POST | `/api/users/login` | Login, returns JWT token | No |
| GET | `/api/books` | Get all books | No |
| GET | `/api/books/:id` | Get a single book | No |
| POST | `/api/reviews` | Add a review | Yes |
| GET | `/api/reviews/:bookId` | Get reviews for a book | No |

---

## Environments

| Environment | Description |
|---|---|
| On-premise | VirtualBox + kubeadm homelab |
| Cloud | AWS EKS |

Both environments use the same Docker image and Kubernetes manifests.