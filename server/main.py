"""
Main entry point for starting the FinIntel FastAPI Backend Server.
"""
import uvicorn

if __name__ == "__main__":
    uvicorn.run("app_multi:app", host="0.0.0.0", port=8000, reload=False)

