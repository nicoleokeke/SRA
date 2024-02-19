# SRA

This Project has 2 sections

## BACKEND

The backend is built with express and mongoose.

### Setup

You can should a `.env` file in the backend folder with the following content

```bash
# PORT=3000 # you can change the port if 3000 is already in use
MONGO_URI=mongodb://localhost:27017/sra
```

- `cd backend`
- `yarn install`
- `yarn start` OR `yarn build`


## FRONTEND

The frontend is built with react, mantine UI, tanstack query. 

### Setup

You can should a `.env` file in the backend folder with the following content

```bash
# VITE_BACKEND_URL = http://localhost:3000 # you can change the url if the backend is running on a different port
```

- `cd frontend`
- `yarn install`
- `yarn preview` OR `yarn build`
- The frontend will be available on `http://localhost:5173` by default or whatever vitest shows you in the terminal