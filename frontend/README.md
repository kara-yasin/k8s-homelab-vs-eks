# Book Review App — Frontend

Frontend for the Book Review application, built with **Next.js and Tailwind CSS**.  
Provides an interactive interface for browsing books, registering, logging in, and submitting reviews.

---

## Tech Stack

| Technology | Usage |
|---|---|
| Next.js | React framework |
| Tailwind CSS | Styling |
| Axios | API calls to backend |
| React Context API | Global authentication state |

---

## Folder Structure

```
/frontend
 ├── /src
 │   ├── /app
 │   │   ├── page.js         # Home page (book list)
 │   │   ├── /book/[id]      # Dynamic route for book details
 │   │   ├── /login          # Login page
 │   │   └── /register       # Register page
 │   ├── /components         # Reusable UI components (Navbar)
 │   ├── /context            # React Context for authentication
 │   ├── /services           # Axios API service functions
 │   └── /styles             # Global Tailwind styles
 ├── next.config.js
 ├── package.json
 └── .env.local              # Environment variables (not committed to Git)
```

---

## Environment Variables

Create a `.env.local` file in the `frontend/` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

> ⚠️ In Kubernetes environments, the API URL points to the backend **Service** name inside the cluster, not localhost.

---

## Running Locally (without Kubernetes)

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

Frontend runs on **http://localhost:3000**.  
Make sure the backend is running on **http://localhost:3001** before starting.

---

## Docker

```bash
# Build the image
docker build -t book-review-frontend .

# Run the container
docker run -p 3000:3000 book-review-frontend
```

---

## Kubernetes Deployment

In this project, the frontend is deployed using **Argo CD and GitOps methodology**.  
Kubernetes manifests are located in the `/k8s` folder at the root of the repository.

Resources created:
- `Deployment` — runs frontend pods
- `Service` — exposes the frontend within the cluster
- `Ingress` — routes external traffic to the frontend

---

## Pages

| Route | Description |
|---|---|
| `/` | Home page — lists all books |
| `/book/[id]` | Book details and reviews |
| `/login` | User login |
| `/register` | User registration |

---

## Environments

| Environment | Description |
|---|---|
| On-premise | VirtualBox + kubeadm homelab |
| Cloud | AWS EKS |

Both environments use the same Docker image and Kubernetes manifests.