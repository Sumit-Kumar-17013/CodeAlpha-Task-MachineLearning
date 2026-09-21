# 💳 Credit Risk Prediction

> A Machine Learning project that predicts whether a customer represents a **Good Credit Risk** or **Bad Credit Risk** using customer financial and personal information.

The project includes complete data analysis, preprocessing, multiple machine learning models, model comparison, hyperparameter tuning, evaluation, feature importance analysis, and a **Streamlit web application** for real-time credit-risk prediction.

---

## 📌 Project Overview

Credit risk prediction is an important Machine Learning problem in the banking and financial sector.

The objective of this project is to build a classification model that can analyze customer information such as:

* Age
* Sex
* Job
* Housing
* Saving Account
* Checking Account
* Credit Amount
* Loan Duration
* Purpose of Credit

and predict whether the customer is:

* 🟢 **Good Risk**
* 🔴 **Bad Risk**

The dataset contains **1,000 customer records and 11 columns**, including the target column `Risk`.

---

## 🎯 Project Objectives

The main objectives of this project are:

* Perform Exploratory Data Analysis (EDA)
* Understand customer credit-risk patterns
* Handle missing values
* Handle categorical and numerical features
* Encode categorical variables
* Scale numerical variables
* Split the dataset into training and testing sets
* Train multiple classification algorithms
* Handle class imbalance using SMOTE
* Compare model performance
* Perform hyperparameter tuning using GridSearchCV
* Analyze feature importance
* Evaluate the final model using multiple metrics
* Save the trained Machine Learning pipeline
* Build an interactive Streamlit application

---

## 📊 Dataset

The project uses the **German Credit Data** dataset.

### Dataset Size

* **Rows:** 1,000
* **Columns:** 11

### Features

| Feature            | Description                      |
| ------------------ | -------------------------------- |
| `Age`              | Customer age                     |
| `Sex`              | Customer gender                  |
| `Job`              | Job category from 0–3            |
| `Housing`          | Housing status                   |
| `Saving accounts`  | Customer saving account status   |
| `Checking account` | Customer checking account status |
| `Credit amount`    | Requested credit amount          |
| `Duration`         | Credit duration in months        |
| `Purpose`          | Purpose of the credit            |
| `Risk`             | Target variable                  |
| `Unnamed: 0`       | Dataset index column             |

The original dataset contains missing values in `Saving accounts` and `Checking account`.

---

# 🔎 Exploratory Data Analysis

The project performs several EDA operations to understand the dataset.

### EDA Performed

* Dataset inspection
* `head()`
* `info()`
* `describe()`
* Missing-value analysis
* Value-count analysis
* Risk distribution analysis
* Grouped analysis
* Pivot-table analysis
* Credit amount distribution
* Housing vs Credit Amount analysis
* Risk-based visualizations
* Feature relationships

For example, the dataset contains:

* **700 Good Risk customers**
* **300 Bad Risk customers**

This shows that the target variable is imbalanced.

---

# 🧹 Data Preprocessing

Several preprocessing steps were applied before model training.

## 1. Removing Unnecessary Column

The `Unnamed: 0` index column was removed because it does not provide useful predictive information.

```python
df.drop(columns='Unnamed: 0', inplace=True)
```

## 2. Handling Missing Values

Missing values in:

* `Saving accounts`
* `Checking account`

were replaced with:

```text
None
```

This allowed the categorical preprocessing pipeline to handle these values consistently.

---

# 🔤 Feature Encoding

### Label Encoding

Label Encoding was applied to:

* `Sex`
* `Risk`

```python
LabelEncoder()
```

### One-Hot Encoding

One-Hot Encoding was applied to categorical features:

```text
Housing
Saving accounts
Checking account
Purpose
```

The project used:

```python
OneHotEncoder(
    drop='first',
    handle_unknown='ignore'
)
```

### Numerical Scaling

Numerical features were standardized using `StandardScaler`.

Numerical features:

```text
Age
Job
Credit amount
Duration
```

The complete preprocessing workflow was implemented using a `ColumnTransformer`.

---

# ⚙️ Machine Learning Pipeline

The project uses a Scikit-learn preprocessing pipeline so that preprocessing and model prediction remain consistent.

The data was divided using:

```python
train_test_split(
    test_size=0.2,
    random_state=42,
    shuffle=True
)
```

This results in:

* **80% Training Data**
* **20% Testing Data**

---

# 🤖 Machine Learning Models

Three major classification algorithms were evaluated.

## 1. Logistic Regression

The Logistic Regression model was configured with:

```python
LogisticRegression(
    penalty='l2',
    class_weight='balanced',
    C=1.0
)
```

### Performance

| Metric    | Score |
| --------- | ----: |
| Accuracy  | 68.0% |
| Precision | 81.8% |
| Recall    | 70.2% |
| F1 Score  | 75.6% |

---

## 2. Random Forest

The Random Forest model was configured with:

```python
RandomForestClassifier(
    n_estimators=100,
    max_depth=None,
    max_features='sqrt',
    random_state=42
)
```

### Performance

| Metric    | Score |
| --------- | ----: |
| Accuracy  | 76.0% |
| Precision | 78.5% |
| Recall    | 90.8% |
| F1 Score  | 84.2% |

---

## 3. XGBoost ⭐

XGBoost was also evaluated using a preprocessing pipeline.

The model configuration included:

```python
XGBClassifier(
    n_estimators=300,
    max_depth=5,
    learning_rate=0.05,
    subsample=0.8,
    colsample_bytree=0.8,
    random_state=42
)
```

### Performance

| Metric    |     Score |
| --------- | --------: |
| Accuracy  | **76.5%** |
| Precision |     77.0% |
| Recall    | **95.0%** |
| F1 Score  | **85.1%** |
| ROC-AUC   |  **0.79** |

XGBoost achieved the strongest overall F1-score and accuracy among the evaluated models, so it was selected as the final model.

---

# ⚖️ Handling Class Imbalance with SMOTE

The target variable was imbalanced:

```text
Good Risk → 700
Bad Risk  → 300
```

To investigate whether balancing the classes could improve the model, **SMOTE (Synthetic Minority Over-sampling Technique)** was applied with XGBoost.

### XGBoost + SMOTE Performance

| Metric    | Score |
| --------- | ----: |
| Accuracy  | 74.0% |
| Precision | 79.9% |
| Recall    | 84.4% |
| F1 Score  | 82.1% |

Although SMOTE improved some minority-class behavior, the overall accuracy and F1-score were lower than the original XGBoost model.

Therefore, the project selected **XGBoost without SMOTE** as the final model.

---

# 🏆 Model Comparison

| Model               |  Accuracy | Precision |    Recall |  F1 Score |
| ------------------- | --------: | --------: | --------: | --------: |
| Logistic Regression |     68.0% |     81.8% |     70.2% |     75.6% |
| Random Forest       |     76.0% |     78.5% |     90.8% |     84.2% |
| **XGBoost**         | **76.5%** |     77.0% | **95.0%** | **85.1%** |
| XGBoost + SMOTE     |     74.0% | **79.9%** |     84.4% |     82.1% |

### 🥇 Selected Model

**XGBoost**

Reasons:

* Highest accuracy
* Highest F1-score
* Very high recall
* Strong overall classification performance

The notebook explicitly compares these four approaches and selects XGBoost without SMOTE as the final model.

---

# 🔧 Hyperparameter Tuning

To improve XGBoost performance, `GridSearchCV` was used with 5-fold cross-validation.

The parameters searched included:

```python
n_estimators
max_depth
learning_rate
subsample
colsample_bytree
```

### Best Parameters

```python
{
    'model__colsample_bytree': 1.0,
    'model__learning_rate': 0.03,
    'model__max_depth': 5,
    'model__n_estimators': 300,
    'model__subsample': 0.6
}
```

### Best Cross-Validation F1 Score

```text
0.8403
```

The tuned model achieved approximately:

* Accuracy: **76%**
* F1 Score: **85%**
* Recall: **96.5%**

on the test set.

---

# 📈 Model Evaluation

Multiple evaluation metrics were used to understand model performance.

### Metrics Used

* Accuracy
* Precision
* Recall
* F1 Score
* Confusion Matrix
* ROC Curve
* ROC-AUC
* Precision-Recall Curve
* Average Precision

### ROC-AUC

The final XGBoost model achieved:

```text
ROC-AUC = 0.79
```

This indicates that the model has useful ability to distinguish between the two credit-risk classes.

The notebook also calculated an Average Precision score of approximately:

```text
0.885
```

---

# 🔍 Feature Importance

Feature importance was extracted from the trained XGBoost model.

The project generated a visualization of the **Top 10 Important Features** to understand which variables contributed most to the model's predictions.

```python
feature_names = pipline_XGB.named_steps[
    'preprocessing'
].get_feature_names_out()

importance = pipline_XGB.named_steps[
    'model'
].feature_importances_
```

This helps provide additional interpretability to the Machine Learning model.

---

# 💾 Model Saving

After selecting the final XGBoost pipeline, the trained model was saved using Joblib:

```python
joblib.dump(
    pipline_XGB,
    'credit_risk_model.pkl'
)
```

The saved model can then be loaded without retraining:

```python
model = joblib.load(
    'credit_risk_model.pkl'
)
```

The notebook verifies that the saved model can successfully make predictions.

---

# 🖥️ Streamlit Web Application

A Streamlit application was created to make the Machine Learning model interactive.

The application loads:

```python
credit_risk_model.pkl
```

and provides a user-friendly interface for entering customer information.

### User Inputs

The application accepts:

* Age
* Sex
* Job
* Housing
* Saving Account
* Checking Account
* Credit Amount
* Duration
* Purpose

The input ranges and available categorical options are implemented directly in the Streamlit application.

---

# 🔮 Prediction

After entering the customer information, the user clicks:

```text
Predict Risk
```

The application sends the input to the saved Machine Learning pipeline.

The model returns:

### 🟢 Good Risk

or

### 🔴 Bad Risk

The application also displays the model's prediction confidence using the predicted probabilities.

---

# 🗂️ Project Structure

```text
Credit-Risk/
│
├── Credit Risk.ipynb
├── german_credit_data.csv
├── credit_risk_model.pkl
├── app.py
├── requirements.txt
└── README.md
```

### File Description

| File                     | Description                                                       |
| ------------------------ | ----------------------------------------------------------------- |
| `Credit Risk.ipynb`      | Complete ML workflow, EDA, preprocessing, training and evaluation |
| `german_credit_data.csv` | Credit-risk dataset                                               |
| `credit_risk_model.pkl`  | Trained XGBoost Machine Learning pipeline                         |
| `app.py`                 | Streamlit web application                                         |
| `requirements.txt`       | Required Python dependencies                                      |
| `README.md`              | Project documentation                                             |

---

# 🛠️ Technologies Used

### Programming Language

* Python 🐍

### Data Analysis

* Pandas
* NumPy

### Data Visualization

* Matplotlib
* Seaborn

### Machine Learning

* Scikit-learn
* XGBoost
* Imbalanced-learn
* SMOTE

### Model Persistence

* Joblib

### Web Application

* Streamlit

---

# 📦 Installation

Clone the repository:

```bash
git clone https://github.com/your-username/your-repository.git
```

Move into the project directory:

```bash
cd Credit-Risk
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate the virtual environment on Windows:

```bash
venv\Scripts\activate
```

Install the dependencies:

```bash
pip install -r requirements.txt
```

---

# ▶️ Run the Streamlit Application

Make sure these files are present in the same project directory:

```text
app.py
credit_risk_model.pkl
```

Then run:

```bash
streamlit run app.py
```

The Streamlit application will open in your browser.

---

# 📋 Example Prediction Workflow

```text
User Input
    ↓
Customer Information
    ↓
DataFrame Creation
    ↓
Saved Preprocessing Pipeline
    ↓
XGBoost Model
    ↓
Prediction Probability
    ↓
Good Risk / Bad Risk
```

---

# 🧠 Machine Learning Workflow

```text
Dataset
   ↓
Data Understanding
   ↓
Exploratory Data Analysis
   ↓
Missing Value Handling
   ↓
Feature Encoding
   ↓
Feature Scaling
   ↓
Train/Test Split
   ↓
Multiple ML Models
   ↓
Model Evaluation
   ↓
SMOTE Experiment
   ↓
XGBoost Selection
   ↓
GridSearchCV
   ↓
Feature Importance
   ↓
ROC-AUC Analysis
   ↓
Model Saving
   ↓
Streamlit Deployment
```

---

# 🚀 Key Results

The final project achieved:

```text
Model: XGBoost

Accuracy: 76.5%
Precision: 77.0%
Recall: 95.0%
F1 Score: 85.1%
ROC-AUC: 0.79
```

The model was then saved as a reusable Joblib pipeline and integrated into a Streamlit application for interactive prediction.

---

# 🌟 Project Highlights

* ✅ Complete Machine Learning workflow
* ✅ Exploratory Data Analysis
* ✅ Missing-value handling
* ✅ Label Encoding
* ✅ One-Hot Encoding
* ✅ Feature Scaling
* ✅ ColumnTransformer
* ✅ Machine Learning Pipelines
* ✅ Logistic Regression
* ✅ Random Forest
* ✅ XGBoost
* ✅ SMOTE experimentation
* ✅ GridSearchCV hyperparameter tuning
* ✅ Confusion Matrix
* ✅ ROC Curve
* ✅ ROC-AUC
* ✅ Precision-Recall Curve
* ✅ Feature Importance
* ✅ Model serialization with Joblib
* ✅ Interactive Streamlit application

---

# ⚠️ Disclaimer

This project is created for **educational and Machine Learning demonstration purposes**.

The predictions should not be treated as professional financial or lending decisions. Real-world credit-risk systems require much larger datasets, rigorous validation, fairness analysis, regulatory compliance, monitoring, and domain expertise.

---

# 👨‍💻 Author

**Sumit Kumar**

B.Tech CSE — AI/ML

Machine Learning | Artificial Intelligence | Python

---

## ⭐ If You Like This Project

If you found this project useful or interesting, consider giving the repository a ⭐ on GitHub.

Feel free to explore the notebook, experiment with the model, and improve the application.

---

### 📌 Project Summary

**Credit Risk Prediction** is an end-to-end Machine Learning project that demonstrates how customer financial information can be transformed into meaningful credit-risk predictions using data preprocessing, multiple classification algorithms, XGBoost optimization, model evaluation, and an interactive Streamlit application.
