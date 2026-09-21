import streamlit as st
import pandas as pd
import numpy as np
import joblib

model = joblib.load("credit_risk_model.pkl")
st.title("Welcome to Credit Risk Model")
st.markdown("Predict whether a customer is a Good Risk or Bad Risk.")

st.divider()


age = st.number_input("Age" , min_value=18 , max_value= 80 , value= 30)
sex = st.selectbox("SEX" , ["Male" , "Female"])
job = st.number_input("Job - (0-3)" , min_value=0 , max_value=3 , value=1)
housing = st.selectbox("House" , ["Own" , "Rent" , "Free"])
saving_account = st.selectbox("Saving Account" , ["Little" , "Moderate" , "Rich" , "Quite Rich" , "None"])
checking_account = st.selectbox("Checking Account" , ["Little" , "Moderate" , "Rich", "None"])
credit_amount = st.number_input("Credit Account" , min_value=250 ,max_value= 18424 , value= 3000 , step=100)
st.info("Credit Amount range in dataset: ₹250 to ₹18,424")
duration = st.number_input("Duration - (Months)" , min_value= 4 , max_value= 72 , value= 24)
purpose = st.selectbox("Purpose" , ["Car" ,"radio/TV","education", "furniture/equipment","business","domestic appliances","repairs","vacation/others"])

st.divider()

if st.button("Predict Risk"):
    sex_value = 1 if sex == 'Male' else 0

    input_df = pd.DataFrame({
    "Age": [age],
    "Sex": [sex_value],
    "Job": [job],
    "Housing": [housing.lower()],
    "Saving accounts": [saving_account.lower()],
    "Checking account": [checking_account.lower()],
    "Credit amount": [credit_amount],
    "Duration": [duration],
    "Purpose": [purpose]
})

    prediction = model.predict(input_df)[0]
    probability = model.predict_proba(input_df)[0]

    st.subheader("Prediction Result")

    if(prediction == 1):
        st.success("Good Risk Costomer")

        st.metric(
            "Confidence",
            f"{probability[1]*100:.2f}%"
        )

    else:
        st.error("Bad Risk Costomer")

        st.metric(
            "Confidence",
            f"{probability[0]*100:.2f}%"
        )

st.divider()
st.caption("Machine Learning Project | Credit Risk Prediction Model")
    
