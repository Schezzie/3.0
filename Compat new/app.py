from flask import Flask, render_template, request
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
import spacy

app = Flask(__name__)

# Load spaCy model for natural language processing
nlp = spacy.load("en_core_web_sm")

@app.route('/', methods=['GET', 'POST'])
def compare_policies():
    if request.method == 'POST':
        # Inside compare_policies function
        # government_policy_file_path = 'PROJJJJ' + request.form['government_policy']
        govt_policy = request.form['government_policy']
        print(govt_policy)
        company_policy = request.form['company_policy']

        # Load government policy text
# Inside compare_policies function
        with open(f"/Users/shakthibala/Desktop/PROJJJJ/static/{govt_policy}", "r", encoding="utf-8") as file:
            government_policy_text = file.read()


        # Perform text comparison and sentiment analysis using spaCy and vaderSentiment
        similarity_score = calculate_similarity(government_policy_text, company_policy)
        sentiment_score = calculate_sentiment(company_policy)

        # Combine scores to get the overall compatibility score
        compatibility_score = (similarity_score + sentiment_score) / 2
        compatibility_score = round(compatibility_score,2)
        if compatibility_score<0:
            compatibility_score = 0.1

        # Determine color based on the compatibility score
        color = get_color(compatibility_score)

        result = {
            'score': compatibility_score,
            'color': color
        }

        return render_template('index.html', result=result)

    return render_template('index.html', result=None)

def calculate_similarity(text1, text2):
    doc1 = nlp(text1)
    doc2 = nlp(text2)
    similarity_score = doc1.similarity(doc2)
    return similarity_score

def calculate_sentiment(text):
    analyzer = SentimentIntensityAnalyzer()
    sentiment_score = analyzer.polarity_scores(text)['compound']
    return sentiment_score

def get_color(score):
    if score >= 0.8:
        return 'green'
    elif 0.6 <= score < 0.8:
        return 'yellow'
    else:
        return 'red'

if __name__ == '__main__':
    app.run(debug=True)
