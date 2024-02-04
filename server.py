# server.py
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from flask import Flask, render_template, request, jsonify
from scraper import scrape_website
from transformers import pipeline
from model_loader import load_and_predict_model
from textblob import TextBlob
import spacy
available_policies = ['CCPA.txt', 'GDPR.txt', 'DPDP.txt']

app = Flask(__name__)
summarizer = pipeline("summarization")
nlp = spacy.load("en_core_web_md")
def calculate_compatibility(government_policy, company_policy):
    # Use spaCy for text similarity
    gov_doc = nlp(government_policy)
    comp_doc = nlp(company_policy)
    similarity_score = gov_doc.similarity(comp_doc)

    # Use TextBlob for sentiment analysis
    gov_sentiment = TextBlob(government_policy).sentiment.polarity
    comp_sentiment = TextBlob(company_policy).sentiment.polarity

    # Combine scores for a compatibility score
    compatibility_score = (similarity_score + (gov_sentiment + comp_sentiment) / 2) / 2

    # Determine color based on the compatibility score
    if compatibility_score >= 0.7:
        color = "#4caf50"  # Green
    elif compatibility_score >= 0.4:
        color = "#ffc107"  # Yellow
    else:
        color = "#e53935"  # Red

    return {
        "score": round(compatibility_score, 2),
        "color": color
    }

def save_predictions_to_txt(predictions, output_file):
    with open(output_file, 'w') as file:
        for entry in predictions:
            if entry['prediction'] == 1:
                file.write(f"{entry['text']}\n\n")

@app.route('/scrape', methods=['POST'])
def scrape_and_predict():
    try:
        data = request.json
        url = data.get('url')
        if not url:
            return jsonify({'error': 'Missing URL in the request'})

        scraped_data_file = scrape_website(url)

        if scraped_data_file:
            predictions = load_and_predict_model(scraped_data_file)
            formatted_predictions = [{'text': entry['text'], 'prediction': entry['prediction']} for entry in predictions]
            save_predictions_to_txt(formatted_predictions, 'final.txt')

            return jsonify({'status': 'Data scraped and predicted successfully', 'predictions': formatted_predictions})
        else:
            return jsonify({'error': 'Error during data scraping'})
    except Exception as e:
        error_message = f'Error during scraping and prediction: {str(e)}'
        return jsonify({'error': error_message})

@app.route('/')
def index():
    return render_template('index.html')
def index1():
    return render_template('index1.html')

@app.route('/summarize', methods=['POST'])
def summarize():
    if request.method == 'POST':
        article = request.form['article']
        max_chunk_length = 1000
        chunks = [article[i:i + max_chunk_length] for i in range(0, len(article), max_chunk_length)]

        chunk_summaries = []
        for chunk in chunks:
            summary = summarizer(chunk, max_length=150, min_length=30, do_sample=False)[0]['summary_text']
            chunk_summaries.append(summary)

        total_summary = ' '.join(chunk_summaries)

        return render_template('index.html', article=article, summary=total_summary)

@app.route('/compare', methods=['POST', 'GET'])
def compare_policies():
    if request.method == 'POST':
        # Inside compare_policies function
        selected_policy = request.form['government_policy']
        company_policy = request.form['company_policy']

        # Load the selected government policy text
        policy_file_path = f"C:/Users/ASUS/Desktop/Projects/help/3.0/static/{selected_policy}"
        with open(policy_file_path, "r", encoding="utf-8") as file:
            government_policy_text = file.read()

        # Perform text comparison and sentiment analysis using spaCy and vaderSentiment
        similarity_score = calculate_similarity(government_policy_text, company_policy)
        sentiment_score = calculate_sentiment(company_policy)

        # Combine scores to get the overall compatibility score
        compatibility_score = (similarity_score + sentiment_score) / 2
        compatibility_score = round(compatibility_score, 2)
        if compatibility_score < 0:
            compatibility_score = 0.1

        # Determine color based on the compatibility score
        color = get_color(compatibility_score)

        result = {
            'score': compatibility_score,
            'color': color
        }

        # Display the content of the selected policy text file
        with open(policy_file_path, "r", encoding="utf-8") as file:
            selected_policy_content = file.read()

        return render_template('index1.html', result=result, available_policies=available_policies, selected_policy_content=selected_policy_content)

    return render_template('index1.html', result=None, available_policies=available_policies, selected_policy_content=None)

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
    app.run(port=5000, debug=True)
