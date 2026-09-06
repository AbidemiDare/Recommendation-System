# lib/recommend.py
import sys
import json
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

def get_recommendations(student_id):
    # Load dataset
    students_df = pd.read_csv('student_recommendation_dataset_100.csv')
    
    # Candidate catalog dataset
    projects_df = pd.DataFrame([
        {"id": "PRJ001", "title": "AI Student Project Recommendation Engine", "skills": "Python, Pandas, Scikit-learn", "domain": "Artificial Intelligence"},
        {"id": "PRJ002", "title": "Automated Student Attendance via Facial Recognition", "skills": "Python, OpenCV, TensorFlow", "domain": "Computer Vision"},
        {"id": "PRJ003", "title": "Multi-Tenant University Course & Project Portal", "skills": "React, Node.js, MongoDB", "domain": "Web Development"},
        {"id": "PRJ004", "title": "High-Throughput Timetable Generation Microservice", "skills": "Java, Spring Boot, MySQL", "domain": "Software Engineering"}
    ])

    # Combine text for vectorization
    students_df['profile_text'] = students_df['skills'] + " " + students_df['interests'] + " " + students_df['career_goal']
    projects_df['project_text'] = projects_df['skills'] + " " + projects_df['domain']

    # Vectorize and compute similarity
    tfidf = TfidfVectorizer(stop_words='english')
    project_matrix = tfidf.fit_transform(projects_df['project_text'])
    student_matrix = tfidf.transform(students_df['profile_text'])

    scores = cosine_similarity(student_matrix, project_matrix)

    # Find matching student row
    student_idx = students_df[students_df['student_id'] == student_id].index[0]
    top_proj_idx = scores[student_idx].argmax()

    return projects_df.iloc[top_proj_idx].to_dict()

if __name__ == "__main__":
    student_id = sys.argv[1] if len(sys.argv) > 1 else "S001"
    result = get_recommendations(student_id)
    print(json.dumps(result))