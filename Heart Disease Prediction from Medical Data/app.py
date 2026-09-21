import streamlit as st
import pickle
import numpy as np

# -----------------------------
# Load Model + Scaler
# -----------------------------
model = pickle.load(open("heart_model.pkl", "rb"))
scaler = pickle.load(open("scaler.pkl", "rb"))

# -----------------------------
# Page Config
# -----------------------------
st.set_page_config(page_title="Heart Disease App", page_icon="❤️", layout="wide")

st.title("❤️ Heart Disease Prediction System")
st.markdown("### Enter Patient Details")

# -----------------------------
# Sidebar Inputs
# -----------------------------
st.sidebar.header("🧾 Input Features")

age = st.sidebar.slider("Age", 20, 100, 40)

sex = st.sidebar.selectbox("Sex", ["Male", "Female"])

resting_bp = st.sidebar.number_input("Resting Blood Pressure", 80, 200, 120)

cholesterol = st.sidebar.number_input("Cholesterol", 100, 600, 200)

fasting_bs = st.sidebar.selectbox("Fasting Blood Sugar", [0, 1])

resting_ecg = st.sidebar.selectbox("Resting ECG", ["Normal", "ST", "LVH"])

max_hr = st.sidebar.slider("Max Heart Rate", 60, 220, 150)

exercise_angina = st.sidebar.selectbox("Exercise Angina", ["Yes", "No"])

chest_pain = st.sidebar.selectbox("Chest Pain Type", ["ATA", "NAP", "TA", "ASY"])

# -----------------------------
# Encoding (same as your model)
# -----------------------------
sex = 1 if sex == "Male" else 0
exercise_angina = 1 if exercise_angina == "Yes" else 0

ecg_map = {"Normal": 0, "ST": 1, "LVH": 2}
resting_ecg = ecg_map[resting_ecg]

# One-hot encoding (same as your training)
ATA = 1 if chest_pain == "ATA" else 0
NAP = 1 if chest_pain == "NAP" else 0
TA = 1 if chest_pain == "TA" else 0

# -----------------------------
# Input Data (IMPORTANT ORDER)
# -----------------------------
input_data = np.array([[age, sex, resting_bp, cholesterol, fasting_bs,
                        resting_ecg, max_hr, exercise_angina,
                        ATA, NAP, TA]])

# -----------------------------
# Apply Scaling (VERY IMPORTANT)
# -----------------------------
input_data = scaler.transform(input_data)

# -----------------------------
# Display Input
# -----------------------------
st.subheader("📊 Patient Summary")
st.write(input_data)

# -----------------------------
# Prediction Button
# -----------------------------
if st.button("🔍 Predict"):

    result = model.predict(input_data)

    if result[0] == 1:
        st.error("⚠️ High Risk of Heart Disease")
    else:
        st.success("✅ Low Risk of Heart Disease")

# -----------------------------
# Footer
# -----------------------------
st.markdown("---")
st.markdown("Made with ❤️ using Streamlit")