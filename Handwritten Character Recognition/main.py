import io
import torch
import torch.nn as nn
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
from torchvision import transforms



device = torch.device("cuda" if torch.cuda.is_available() else "cpu")


class SimpleCNN(nn.Module):

    def __init__(self):
        super().__init__()

        self.features = nn.Sequential(
            nn.Conv2d(1, 8, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.MaxPool2d(2),

            nn.Conv2d(8, 16, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.MaxPool2d(2),
        )

        self.classifier = nn.Sequential(
            nn.Linear(16 * 7 * 7, 64),
            nn.ReLU(),
            nn.Linear(64, 10),
        )

    def forward(self, x):
        x = self.features(x)
        x = x.view(x.size(0), -1)
        x = self.classifier(x)

        return x



model = SimpleCNN().to(device)

model.load_state_dict(torch.load( "SimpleCNN.pth", map_location=device))

model.eval()


transform = transforms.Compose([
    transforms.Grayscale(num_output_channels=1),
    transforms.Resize((28, 28)),
    transforms.ToTensor(),
])



app = FastAPI(
    title="MNIST CNN Digit Classifier API",
    description="FastAPI backend for handwritten digit classification using PyTorch CNN.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:5500",
        "http://localhost:5500",
        "http://127.0.0.1:8080",
        "http://localhost:8080",
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)



@app.get("/")
def home():

    return {
        "message": "MNIST CNN API is running",
        "model": "SimpleCNN",
        "device": str(device),
        "input_size": "28x28 grayscale",
        "classes": 10
    }


@app.get("/health")
def health():

    return {
        "status": "healthy",
        "model_loaded": True,
        "device": str(device)
    }



@app.post("/predict")
async def predict(file: UploadFile = File(...)):

    # Check file type
    if not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=400,
            detail="Please upload a valid image file."
        )

    try:

        image_bytes = await file.read()

        image = Image.open(
            io.BytesIO(image_bytes)
        ).convert("L")

        image_tensor = transform(image)

        # Add batch dimension
        image_tensor = image_tensor.unsqueeze(0)

        image_tensor = image_tensor.to(device)

        with torch.no_grad():

            output = model(image_tensor)

            probabilities = torch.softmax(output, dim=1)

            prediction = torch.argmax( probabilities, dim=1).item()

            confidence = probabilities[0, prediction].item()

        return {
            "success": True,
            "filename": file.filename,
            "prediction": prediction,
            "confidence": round(confidence * 100, 2),
            "message": f"The predicted digit is {prediction}"
        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=f"Prediction failed: {str(e)}"
        )