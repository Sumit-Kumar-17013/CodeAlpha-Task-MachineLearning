# ❤️ Heart Disease Prediction

A Machine Learning project that predicts whether a person is likely to have heart disease based on medical and health-related features.

I built this project to practice a complete Machine Learning workflow, including data analysis, preprocessing, model training, evaluation, saving the trained model, and using the model in a prediction application.

---

## 📌 About the Project

Heart disease is a common health problem, and Machine Learning can be used to analyze medical data and identify patterns that may help with prediction.

The goal of this project is to train a Machine Learning classification model using a heart disease dataset and use it to make predictions for new input data.

The project covers both the Machine Learning side and the application side.

---

## 🎯 Project Objectives

* Analyze the heart disease dataset.
* Understand the important features.
* Perform data preprocessing.
* Visualize the dataset.
* Train a Machine Learning classification model.
* Evaluate the model.
* Save the trained model.
* Save the preprocessing/scaling information.
* Build a simple prediction application.

---

## 📊 Dataset

The project uses a heart disease dataset containing medical and health-related information.

The main dataset used in the project is:

```text
heart.xlsx
```

The dataset contains different features related to a person's health condition, which are used to predict the target outcome.

### Target

The target variable represents whether heart disease is present or not.

The exact feature names and preprocessing steps are available in the Jupyter Notebook.

---

## 🛠️ Technologies Used

* Python
* Pandas
* NumPy
* Matplotlib
* Seaborn
* Scikit-learn
* Jupyter Notebook
* Pickle
* Streamlit / Python application

---

## 🔍 Machine Learning Workflow

The project follows this workflow:

```text
Dataset
   ↓
Data Loading
   ↓
Data Cleaning
   ↓
Exploratory Data Analysis
   ↓
Data Visualization
   ↓
Feature Selection
   ↓
Data Preprocessing
   ↓
Train/Test Split
   ↓
Model Training
   ↓
Model Evaluation
   ↓
Save Model
   ↓
Prediction Application
```

---

## 📈 Exploratory Data Analysis

I used data visualization and statistical analysis to understand the dataset and find useful patterns.

Some of the analysis includes:

* Distribution of features
* Feature relationships
* Correlation analysis
* Target distribution
* Comparison of important medical features
* Data visualization using Matplotlib and Seaborn

---

## 🤖 Machine Learning Model

The project uses a classification model to predict the presence of heart disease.

The trained model is saved as:

```text
heart_model.pkl
```

A scaler used during preprocessing is saved as:

```text
scaler.pkl
```

These saved files are loaded by the application so that the model can make predictions without being trained again every time.

---

## 📁 Project Structure

```text
Heart Disease Prediction/
│
├── app.py
├── Heart Diseases.ipynb
├── heart.xlsx
├── heart.pdf
├── heart_model.pkl
├── scaler.pkl
├── sub_plot.png
└── README.md
```

### File Description

| File                   | Description                                                                              |
| ---------------------- | ---------------------------------------------------------------------------------------- |
| `app.py`               | Application used for making heart disease predictions                                    |
| `Heart Diseases.ipynb` | Jupyter Notebook containing data analysis, preprocessing, model training, and evaluation |
| `heart.xlsx`           | Dataset used for the project                                                             |
| `heart.pdf`            | Project/report related document                                                          |
| `heart_model.pkl`      | Saved trained Machine Learning model                                                     |
| `scaler.pkl`           | Saved scaler used during preprocessing                                                   |
| `sub_plot.png`         | Visualization generated during the project                                               |
| `README.md`            | Project documentation                                                                    |

---

## 🚀 How to Run

### 1. Clone the repository

```bash
git clone https://github.com/Sumit-Kumar-17013/Machine-Learning-Projects.git
```

### 2. Go to the project

```bash
cd Machine-Learning-Projects
cd "Heart Disease Prediction"
```

### 3. Install the required libraries

If you have a `requirements.txt` file:

```bash
pip install -r requirements.txt
```

Otherwise:

```bash
pip install pandas numpy matplotlib seaborn scikit-learn jupyter
```

### 4. Run the application

If `app.py` is a Streamlit application:

```bash
streamlit run app.py
```

If it is a normal Python application:

```bash
python app.py
```

---

## 🧪 Running the Notebook

To explore the complete Machine Learning workflow:

```bash
jupyter notebook
```

Then open:

```text
Heart Diseases.ipynb
```

Run the notebook cells in order.

---

## 💾 Saved Model

The trained model and scaler are saved so they can be reused by the application.

```text
heart_model.pkl
scaler.pkl
```

The application loads these files and uses them to generate predictions based on user input.

---

## 📚 What I Learned

Through this project, I practiced:

* Working with a real-world healthcare dataset
* Data cleaning
* Exploratory Data Analysis
* Data visualization
* Correlation analysis
* Feature preprocessing
* Classification
* Train/test splitting
* Model evaluation
* Saving Machine Learning models
* Loading saved models
* Building a prediction application

---

## 🔮 Future Improvements

I can improve this project further by:

* Comparing multiple classification algorithms
* Performing hyperparameter tuning
* Using cross-validation
* Improving feature engineering
* Adding more evaluation metrics
* Improving the user interface
* Deploying the application
* Adding better input validation
* Improving model performance

---

## ⚠️ Disclaimer

This project is created for **educational and Machine Learning practice purposes**.

The predictions from this application should **not be treated as medical advice or a medical diagnosis**. Real medical decisions should always be made by qualified healthcare professionals.

---

## 👨‍💻 Author

**Sumit Kumar**

B.Tech CSE — AI/ML

GitHub:
https://github.com/Sumit-Kumar-17013

---

## ⭐ About This Project

This is one of my Machine Learning projects where I worked with a real-world healthcare dataset and built an end-to-end prediction workflow.

I am continuing to improve this project and adding more Machine Learning projects to my repository as I learn new concepts and technologies.
