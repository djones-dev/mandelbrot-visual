from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.mandelbrot.routes import router

app = FastAPI(
    title="Mandelbrot Visualizer",
    description="API for computing and visualizing the Mandelbrot set",
    version="0.1.0"
)

# Allow requests from frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Next.js frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)